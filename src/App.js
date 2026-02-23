import {useState} from "react";
import "./App.css";
import AuthPage from "./components/AuthPage";
import Dashboard from "./components/Dashboard";

function App() {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [role, setRole] = useState(localStorage.getItem("role"));
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setToken(null);
        setRole(null);
    };
    return (
        <div className="app-container">
            <header>
                <h1>Guardian Link</h1>
                {token && <button onClick={handleLogout}>Logout</button>}
            </header>
            {!token ? (
                <AuthPage setToken={setToken} setRole={setRole} />
            ) : (
                <Dashboard token={token} role={role}/>
            )}
        </div>

    );
    
}
export default App;