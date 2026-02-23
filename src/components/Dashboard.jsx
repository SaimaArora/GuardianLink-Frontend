import { useEffect, useState } from "react";
import RequestForm from "./RequestForm";
import RequestsList from "./RequestsList";
const role = localStorage.getItem("role");
function Dashboard({token, role}) {
    const [requests, setRequests] = useState([]);
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [viewMode, setViewMode] = useState(role==="VOLUNTEER"?"ALL" : "MY"); // "MY" or "ALL"

    const handleUnauthorized = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.reload();
};
    const fetchRequests = () => {
        setMessage("");
        setLoading(true);
        setError("");
        const endpoint = viewMode === "MY" ? "http://localhost:8081/requests/my" : "http://localhost:8081/requests";

        fetch(endpoint, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
            
        })
        
        .then((response) => {
  if (response.status === 401 || response.status === 403) {
    handleUnauthorized();
    throw new Error("Unauthorized");
  }
  if (!response.ok) {
    throw new Error("Failed to fetch requests");
  }
  return response.json();
})
        .then((data)=>{
            setRequests(data);
        })
        .catch((error)=>{
            console.error("Error fetching requests:", error);
            setError(error.message);
        })
        .finally(()=>{
            setLoading(false);
        });
        console.log("Fetching requests from:", endpoint);
        console.log("Using token:", token);
    };
    

    const fetchCategories = () => {
        fetch("http://localhost:8081/categories")
        .then((response) => {
            if(!response.ok) {
                throw new Error("Failed to fetch categories");
            }
            return response.json();
        })
        .then((data)=>{
            setCategories(data);
        })
        .catch((error)=>{
            if(error.name === "AbortError") {
                return;
            }
            console.error("Error fetching categories:", error);
            setError(error.message);
        });
    };
    useEffect(()=>{
        fetchRequests();
         if(role === "USER") { fetchCategories() };
    }, [token, viewMode, role]); //when user switch between my and all, we refetch the requests
    return(
        <div className="dashboard">
            <h1>Dashboard</h1>
            {role === "USER" && (<RequestForm token={token} name = {name} setName={setName} categoryId={categoryId} setCategoryId={setCategoryId} categories={categories} loading={loading} setError={setError} setMessage={setMessage} fetchRequests={fetchRequests} />)}
            <div style={{marginBottom: "20px", display:"flex", gap:"10px"}}>
                {role === "USER" && <button onClick={()=> setViewMode("MY")}>My Requests</button>}
                {role === "VOLUNTEER" && <button onClick={()=> setViewMode("ALL")}>All Requests</button>}
                </div>
            <RequestsList requests={requests} loading={loading} token={token} role={role} setError={setError} setMessage={setMessage} fetchRequests={fetchRequests}/>
            {error && <div className="error">{error}</div>}
            {message && <div className="message">{message}</div>}
        </div>
    );
}
export default Dashboard;