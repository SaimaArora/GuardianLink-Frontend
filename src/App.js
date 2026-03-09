import {useState} from "react";
import "./App.css";
import AuthPage from "./components/AuthPage";
import Dashboard from "./components/Dashboard";
import logo from "./assets/logo.png";
import {Toaster} from "react-hot-toast";
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
            <Toaster position="top-right" reverseOrder={false} />
            <header className="navbar">

            <div className="nav-left">
                <img src={logo} alt="GuardianLink Logo" className="app-logo" />
                {/* <span className="app-title">GuardianLink</span> */}
            </div>

            {token && (
                <div className="nav-right">

                <span className="role-badge">
                    {role}
                </span>

                <button onClick={handleLogout}>
                    Logout
                </button>

                </div>
            )}

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