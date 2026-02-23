import {jwtDecode} from "jwt-decode";

function LoginForm({
    email, password, setEmail, setPassword, setToken, setRole, setError, setMessage, switchToRegister}) {
    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        fetch("http://localhost:8081/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                email:email, 
                password:password, }),
            })
        .then(async (res) => {
            if (!res.ok) {
                throw new Error("Login failed");
            }
            return res.json(); 
        })
        .then((data) => {
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);
            setToken(data.token);
            setRole(data.role);
            setEmail("");
            setPassword("");
            setMessage("Login successful!");
        })
        .catch((err) => {
            console.error("Login error:", err);
            setError(err.message);
        });
    
};
return(
    <>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
            <input type="email" placeholder="Email" value={email} onChange={(e)=> setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={(e)=> setPassword(e.target.value)} required />
            <button type="submit">Login</button>

        </form>
        <p>
            Don't have an account? {" "}
            <button type="button" onClick={switchToRegister}>Register</button>
        </p>
    </>
);
    }
    export default LoginForm;