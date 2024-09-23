import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import AWS from "aws-sdk";
import CustomerRoutes from "./routes/CustomerRoutes.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use("/", CustomerRoutes);

// Health check route
app.get("/health", (req, res) => {
	res.status(200).send("OK");
});

// Initialize DynamoDB and DocumentClient with explicit region
AWS.config.update({
	region: process.env.AWS_REGION || "ap-south-1", // Ensure the region is set
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// Create instances of DynamoDB and DocumentClient with the updated config
const dynamodb = new AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient({
	region: process.env.AWS_REGION || "ap-south-1", // Ensure the region is also set for DocumentClient
});

app.set("docClient", docClient);

// Check DynamoDB connection by listing tables
const checkDynamoDBConnection = async () => {
	try {
		const result = await dynamodb.listTables().promise();
		console.log(
			`Connected to DynamoDB! Tables: ${
				result.TableNames.length > 0
					? result.TableNames.join(", ")
					: "No tables found"
			}`
		);
	} catch (error) {
		console.error("Error connecting to DynamoDB:", error.message);
	}
};

// Call the connection check function
checkDynamoDBConnection();

// Example route to list tables
app.get("/dynamodb/tables", async (req, res) => {
	try {
		const result = await dynamodb.listTables().promise();
		res.status(200).json({ tables: result.TableNames });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

const PORT = process.env.PORT || 85;

app.listen(PORT, () => {
	console.log(`Server is up and running on: ${PORT} 🚀🚀🚀`);
});
