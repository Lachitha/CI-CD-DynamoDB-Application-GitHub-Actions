import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate from React Router

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate(); // Initialize useNavigate

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:82";
			const response = await axios.post(`${apiUrl}/login`, {
				email,
				password,
			});
			alert(response.data.message);
			localStorage.setItem("token", response.data.data.token);

			// Navigate to UserDetails on successful login
			navigate("/authUser");
		} catch (error) {
			setError(error.response.data.message);
		}
	};

	return (
		<div style={styles.container}>
			<form onSubmit={handleSubmit} style={styles.form}>
				<h2 style={styles.title}>Login</h2>
				{error && <div style={styles.error}>{error}</div>}
				<div style={styles.inputGroup}>
					<label style={styles.label}>Email:</label>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						style={styles.input}
					/>
				</div>
				<div style={styles.inputGroup}>
					<label style={styles.label}>Password:</label>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						style={styles.input}
					/>
				</div>
				<button type="submit" style={styles.button}>
					Login
				</button>
			</form>
		</div>
	);
};

const styles = {
	container: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		height: "100vh",
		backgroundColor: "#f0f2f5",
	},
	form: {
		padding: "60px",
		borderRadius: "10px",
		boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
		backgroundColor: "#fff",
		width: "300px",
	},
	title: {
		textAlign: "center",
		marginBottom: "20px",
		color: "#333",
	},
	inputGroup: {
		marginBottom: "15px",
	},
	label: {
		display: "block",
		marginBottom: "5px",
		color: "#555",
	},
	input: {
		width: "100%",
		padding: "10px",
		borderRadius: "5px",
		border: "1px solid #ccc",
	},
	button: {
		width: "100%",
		padding: "10px",
		borderRadius: "5px",
		border: "none",
		backgroundColor: "#007bff",
		color: "#fff",
		fontWeight: "bold",
		cursor: "pointer",
	},
	error: {
		color: "red",
		marginBottom: "10px",
		textAlign: "center",
	},
};

export default Login;
