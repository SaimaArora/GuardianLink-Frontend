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
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Login failed");
            }

            const token = data.data.token;
            const role = data.data.role;

            localStorage.setItem("token", token);
            localStorage.setItem("role", role);
            localStorage.setItem("email", email);
console.log(data);
            setToken(token);
            setRole(role);

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