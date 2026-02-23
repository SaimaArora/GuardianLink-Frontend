import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

function AuthPage({ setToken, setRole}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showRegister, setShowRegister] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    return(
        <div className="auth-container">
            <div className="auth-card">
                {!showRegister ? (
                    <LoginForm
                        email={email}
                        setEmail={setEmail}
                        password={password}
                        setPassword={setPassword}
                        setToken={setToken}
                        setRole={setRole}
                        setError={setError}
                        setMessage={setMessage}
                        switchToRegister={()=> setShowRegister(true)}
                    />
                ) : (
                    <RegisterForm
                        email={email}
                        setEmail={setEmail}
                        password={password}
                        setPassword={setPassword}
                        setError={setError}
                        setMessage={setMessage}
                        switchToLogin={()=> setShowRegister(false)}
                    />
                )}
                {error && <div className="error">{error}</div>}
                {message && <div className="message">{message}</div>}
            </div>
        </div>
    );
}
export default AuthPage;