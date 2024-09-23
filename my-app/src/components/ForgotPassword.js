import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
	const [email, setEmail] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post(
				"http://localhost:5000/forgetPassword",
				{ email }
			);
			alert(response.data.message);
		} catch (error) {
			alert(error.response.data.message);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<h2>Forgot Password</h2>
			<div>
				<label>Email:</label>
				<input
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
			</div>
			<button type="submit">Send Reset Link</button>
		</form>
	);
};

export default ForgotPassword;
