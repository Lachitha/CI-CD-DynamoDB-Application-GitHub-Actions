import AWS from "aws-sdk";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { auth } from "../middleware/auth.js";
import { sendEmail } from "../utils/sendEmail.js";
import { resetPassword } from "../utils/emailTemplate.js";

// Initialize DynamoDB DocumentClient

AWS.config.update({
	region: process.env.AWS_REGION || "ap-south-1",
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
const dynamoDb = new AWS.DynamoDB.DocumentClient();

// Table names for DynamoDB
const CUSTOMER_TABLE = "Customers";
const TOKEN_TABLE = "Tokens";

// Helper function to hash the password
const hashPassword = (password) => {
	return crypto.createHash("sha256").update(password).digest("hex");
};

const register = async (req, res) => {
	try {
		const { email, password } = req.body;

		// Check if customer already exists
		const existingCustomer = await dynamoDb
			.get({
				TableName: CUSTOMER_TABLE,
				Key: { email },
			})
			.promise();

		if (existingCustomer.Item) {
			return res.status(409).json({
				status: false,
				message: "Email already exists",
				data: undefined,
			});
		}

		// Hash password
		const hashedPassword = hashPassword(password);

		// Save new customer
		const newCustomer = { ...req.body, password: hashedPassword };
		await dynamoDb
			.put({
				TableName: CUSTOMER_TABLE,
				Item: newCustomer,
			})
			.promise();

		return res.status(201).json({
			status: true,
			message: "Customer created successfully",
			data: newCustomer,
		});
	} catch (err) {
		console.error("Error creating customer:", err);
		return res.status(500).json({
			status: false,
			message: err.message,
			data: undefined,
		});
	}
};

const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		// Find customer by email
		const customerData = await dynamoDb
			.get({
				TableName: CUSTOMER_TABLE,
				Key: { email },
			})
			.promise();

		const customer = customerData.Item;
		if (!customer) {
			return res.status(401).json({
				status: false,
				message: "User not found",
				data: undefined,
			});
		}

		// Check password
		const passwordMatch = hashPassword(password) === customer.password;
		if (passwordMatch) {
			// Create JWT token
			const token = jwt.sign(
				{ email: customer.email, customerId: customer.email },
				process.env.JWT_KEY,
				{ expiresIn: "1h" }
			);

			// Save token to DynamoDB
			await dynamoDb
				.put({
					TableName: TOKEN_TABLE,
					Item: {
						_customerId: customer.email,
						tokenType: "login",
						token,
					},
				})
				.promise();

			return res.status(200).json({
				status: true,
				message: "Auth successful",
				data: {
					token,
					customer,
				},
			});
		} else {
			return res.status(401).json({
				status: false,
				message: "Wrong password",
				data: undefined,
			});
		}
	} catch (err) {
		console.log(err);
		res.status(500).json({
			status: false,
			message: "Server Error",
			data: undefined,
		});
	}
};

const logout = async (req, res) => {
	try {
		await dynamoDb
			.delete({
				TableName: TOKEN_TABLE,
				Key: {
					_customerId: req.customerId,
					tokenType: "login",
				},
			})
			.promise();

		return res.status(200).json({
			status: true,
			message: "Logout successful",
			data: undefined,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			status: false,
			message: "Server Error",
			data: undefined,
		});
	}
};

const authUser = async (req, res) => {
	const customerId = req.customerId;
	try {
		const customerData = await dynamoDb
			.get({
				TableName: CUSTOMER_TABLE,
				Key: { email: customerId },
			})
			.promise();

		const customer = customerData.Item;
		if (!customer) {
			return res.status(401).json({
				status: false,
				message: "User not found",
				data: undefined,
			});
		}

		return res.status(200).json({
			status: true,
			message: "User found",
			data: customer,
		});
	} catch (err) {
		console.error(err);
		return res.status(500).json({
			status: false,
			message: "Error retrieving user",
			data: undefined,
		});
	}
};

const forgetPassword = async (req, res) => {
	try {
		const { email } = req.body;

		// Find customer by email
		const customerData = await dynamoDb
			.get({
				TableName: CUSTOMER_TABLE,
				Key: { email },
			})
			.promise();

		const customer = customerData.Item;
		if (!customer) {
			return res.status(401).json({
				status: false,
				message: "User not found",
				data: undefined,
			});
		}

		// Create a reset token with a 20-minute expiry
		const token = jwt.sign(
			{
				email: customer.email,
				customerId: customer.email,
			},
			process.env.JWT_RESET_PW_KEY,
			{ expiresIn: "20m" }
		);

		// Save reset token in the Tokens table
		await dynamoDb
			.put({
				TableName: TOKEN_TABLE,
				Item: {
					_customerId: customer.email,
					tokenType: "resetPassword",
					token,
				},
			})
			.promise();

		// Send reset password email
		const emailTemplate = resetPassword(email, token);
		await sendEmail(emailTemplate);

		return res.status(200).json({
			status: true,
			message: "Email sent successfully",
			data: undefined,
		});
	} catch (err) {
		console.error("Error sending email:", err);
		return res.status(500).json({
			status: false,
			message: "Error sending email",
			data: undefined,
		});
	}
};
const resetPasswordcon = async (req, res) => {
	const { token } = req.params;
	const { password } = req.body;

	try {
		// Verify the token
		const decoded = jwt.verify(token, process.env.JWT_RESET_PW_KEY);

		// Fetch the customer using the decoded customer ID
		const customerData = await dynamoDb
			.get({
				TableName: CUSTOMER_TABLE,
				Key: { email: decoded.customerId },
			})
			.promise();

		const customer = customerData.Item;
		if (!customer) {
			return res.status(404).json({
				status: false,
				message: "Customer not found or invalid token",
				data: undefined,
			});
		}

		// Hash the new password and update the customer in DynamoDB
		const hashedPassword = hashPassword(password);
		await dynamoDb
			.update({
				TableName: CUSTOMER_TABLE,
				Key: { email: customer.email },
				UpdateExpression: "SET password = :password",
				ExpressionAttributeValues: {
					":password": hashedPassword,
				},
			})
			.promise();

		// Delete the resetPassword token from the Tokens table
		await dynamoDb
			.delete({
				TableName: TOKEN_TABLE,
				Key: {
					_customerId: customer.email,
					tokenType: "resetPassword",
				},
			})
			.promise();

		return res.status(200).json({
			status: true,
			message: "Password reset successful",
			data: undefined,
		});
	} catch (err) {
		console.error("Error resetting password:", err);
		return res.status(500).json({
			status: false,
			message: "Error resetting password",
			data: undefined,
		});
	}
};
export { register, login, logout, authUser, forgetPassword, resetPasswordcon };
