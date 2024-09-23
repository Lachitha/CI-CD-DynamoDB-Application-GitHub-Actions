import React, { useState, useEffect } from "react";
import axios from "axios";

const UserDetails = () => {
	const [user, setUser] = useState(null);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchUserDetails = async () => {
			try {
				// Replace with your API URL
				const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:82";
				const token = localStorage.getItem("token");

				if (!token) {
					throw new Error("User not authenticated");
				}

				const response = await axios.get(`${apiUrl}/auth`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				setUser(response.data.data);
			} catch (error) {
				console.error("Error fetching user details:", error.message);
				setError(error.message);
			}
		};

		fetchUserDetails();
	}, []);

	if (error) {
		return <div>Error: {error}</div>;
	}

	if (!user) {
		return <div>Loading...</div>;
	}

	return (
		<div style={styles.container}>
			<h2 style={styles.title}>User Details</h2>
			<div style={styles.details}>
				<p>
					<strong>First Name:</strong> {user.firstname}
				</p>
				<p>
					<strong>Last Name:</strong> {user.lastname}
				</p>
				<p>
					<strong>Email:</strong> {user.email}
				</p>
				<p>
					<strong>Phone Number:</strong> {user.phoneNo}
				</p>
			</div>
		</div>
	);
};

const styles = {
	container: {
		padding: "20px",
		borderRadius: "10px",
		boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
		backgroundColor: "#fff",
		width: "300px",
		margin: "auto",
		marginTop: "50px",
	},
	title: {
		textAlign: "center",
		marginBottom: "20px",
		color: "#333",
	},
	details: {
		padding: "10px",
		border: "1px solid #ccc",
		borderRadius: "5px",
	},
};

export default UserDetails;
