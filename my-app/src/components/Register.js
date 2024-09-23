import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		firstname: "",
		lastname: "",
		email: "",
		password: "",
		phoneNo: "",
	});

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:82";
			const response = await axios.post(`${apiUrl}/register`, formData);
			alert(response.data.message);
			navigate("/login");
		} catch (error) {
			alert(error.response.data.message);
		}
	};

	return (
		<div style={styles.container}>
			<form onSubmit={handleSubmit} style={styles.form}>
				<h2 style={styles.title}>Register</h2>
				<div style={styles.inputGroup}>
					<label style={styles.label}>First Name:</label>
					<input
						type="text"
						name="firstname"
						value={formData.firstname}
						onChange={handleChange}
						style={styles.input}
					/>
				</div>
				<div style={styles.inputGroup}>
					<label style={styles.label}>Last Name:</label>
					<input
						type="text"
						name="lastname"
						value={formData.lastname}
						onChange={handleChange}
						style={styles.input}
					/>
				</div>
				<div style={styles.inputGroup}>
					<label style={styles.label}>Email:</label>
					<input
						type="email"
						name="email"
						value={formData.email}
						onChange={handleChange}
						style={styles.input}
					/>
				</div>
				<div style={styles.inputGroup}>
					<label style={styles.label}>Password:</label>
					<input
						type="password"
						name="password"
						value={formData.password}
						onChange={handleChange}
						style={styles.input}
					/>
				</div>
				<div style={styles.inputGroup}>
					<label style={styles.label}>Phone Number:</label>
					<input
						type="text"
						name="phoneNo"
						value={formData.phoneNo}
						onChange={handleChange}
						style={styles.input}
					/>
				</div>
				<button type="submit" style={styles.button}>
					Register
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
};

export default Register;
