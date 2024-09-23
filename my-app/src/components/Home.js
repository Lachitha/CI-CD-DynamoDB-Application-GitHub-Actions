import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				height: "100vh",
				backgroundColor: "#f0f0f0",
			}}>
			<h1 style={{ fontSize: "2rem", marginBottom: "2rem", color: "#333" }}>
				Welcome to Our Authentication Application
			</h1>
			<div style={{ display: "flex", gap: "1rem" }}>
				<Link to="/login">
					<button
						style={{
							padding: "10px 20px",
							fontSize: "1rem",
							backgroundColor: "#007bff",
							color: "#fff",
							border: "none",
							borderRadius: "5px",
							cursor: "pointer",
							transition: "background-color 0.3s ease",
						}}>
						Login
					</button>
				</Link>
				<Link to="/register">
					<button
						style={{
							padding: "10px 20px",
							fontSize: "1rem",
							backgroundColor: "#007bff",
							color: "#fff",
							border: "none",
							borderRadius: "5px",
							cursor: "pointer",
							transition: "background-color 0.3s ease",
						}}>
						Register
					</button>
				</Link>
			</div>
		</div>
	);
};

export default Home;
