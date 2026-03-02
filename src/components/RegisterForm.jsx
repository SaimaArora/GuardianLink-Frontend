import { useState } from "react";

function RegisterForm({email, password, setEmail, setPassword, setError, setMessage, switchToLogin}) {
    const [role, setRole] = useState("user");

    const handleRegister = (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        fetch("http://localhost:8081/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email:email,
                password:password,
                name:email.split("@")[0],
                role:role,
            }),
        })
        .then(async (res) => {
            const data = await res.json();
            if (!res.ok) {
                throw new Error(text || "Registration failed");
            }
            setMessage("Registration successful! Please log in.");
            switchToLogin();
            setEmail("");
            setPassword("");
        })
        .catch((err) => {
            console.error("Registration error:", err);
            setError(err.message);
        });
    };
    return(
        <>
            <h2>Create Account</h2>
            <form onSubmit={handleRegister} className="auth-form">
                <input type="email" placeholder="Email" value={email} onChange={(e)=> setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e)=> setPassword(e.target.value)} required />
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="USER">User (Request Help)</option>
                    <option value="VOLUNTEER">Volunteer (Provide Help)</option>
                </select>
                <button type="submit" className="primary-btn">Register</button>
            </form>
            <p>
                Already have an account? {" "}
                <button type="button" onClick={switchToLogin}>Back to Login</button>
            </p>
        </>
    );
}
export default RegisterForm;