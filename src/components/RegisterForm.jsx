function RegisterForm({email, password, setEmail, setPassword, setError, setMessage, switchToLogin}) {
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
                name:email.split("@")[0]
            }),
        })
        .then(async (res) => {
            const text = await res.text();
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
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <input type="email" placeholder="Email" value={email} onChange={(e)=> setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e)=> setPassword(e.target.value)} required />
                <button type="submit">Register</button>
            </form>
            <p>
                Already have an account? {" "}
                <button type="button" onClick={switchToLogin}>Back to Login</button>
            </p>
        </>
    );
}
export default RegisterForm;