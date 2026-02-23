import {useEffect, useState } from "react";
import "./App.css";

//holds token, decides to show Auth page or dashboard
function App() {
  //create state variable called requests, initally []
  //when we call setRequests(data) -> react updates the value, and re renders the ui
  const [requests, setRequests] = useState([]); //will hold list of reqests from backend
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showRegister, setShowRegister] = useState(false);

  //for ux - show loading spinner, and error message if api call fails
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [categories, setCategories] = useState([]); //for dropdown of categories
  const [categoryId, setCategoryId] = useState("");


  //fetch ALL requests from backend
  const fetchRequests = () => {
    console.log("Using token:", token);

    setMessage("");
    setLoading(true); //start loading
    setError(""); //clear prev error
    fetch("http://localhost:8081/requests", {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((response) => {
        if(!response.ok) {
          throw new Error("Failed to fetch requests");
        }
        return response.json();
      })
      .then((data)=> {
        setRequests(data);
      })
      .catch((error)=> {
        console.error("Error fetching requests: ", error);
        setError("Error fetching requests. Please try again later.");
      })
      .finally(()=>{
        setLoading(false); //stop loading(success or error)
      })
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    fetch("http://localhost:8081/auth/login",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },
      body:JSON.stringify({
        email:email,
        password:password,
      }),
    })
    .then(async (res) => {
      const text = await res.text();   // 👈 backend returns plain token

      if (!res.ok) {
        throw new Error(text || "Login failed");
      }

      return text; // 👈 this IS the token
    })
    .then((tokenValue) => {
      localStorage.setItem("token", tokenValue);
      setToken(tokenValue);
      setEmail("");
      setPassword("");
      setMessage("Login successful!");
    })
    .catch((err) => {
      console.error(err);
      setError("Invalid email or password");
    });
};

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setRequests([]);
  };
  
  const handleRegister = (e) =>{
    e.preventDefault();
    setError("");
    setMessage("");
    fetch("http://localhost:8081/auth/register",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },
      body:JSON.stringify({
        email:email,password:password,
        name:email.split("@")[0], //use part of email as name
      }),
    })
    .then(async (res) => {
      const text = await res.text();   // 👈 backend returns plain token
      if(!res.ok) {
        throw new Error(text || "Registration failed");
      }
      setMessage("Registration successful! Please login.");
      setShowRegister(false); //go to login
      setEmail("");
      setPassword("");
    })
    .catch((err)=>{
      console.error(err);
      setError("Registration failed. Please try different email.");
    })
  }

  const fetchCategories = () => {
    fetch("http://localhost:8081/categories")
      .then((response) => {
        if(!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        return response.json();
      })
      .then((data)=> {
        setCategories(data);
      })
      .catch((error)=> {
        console.error("Error fetching categories: ", error);
        setError("Could not load categories. Please try again later.");
      });
  };

  //runs once when component loads - used to call the backend api
  useEffect(()=>{
    if(token) {
    fetchRequests();
    fetchCategories();
    }
  }, [token]); //dependency array - useEffect runs when token changes (login/logout)


   
  //CREATE
  const handleSubmit = (e) =>{
    e.preventDefault();
    setError("");
    setMessage("");

    if(!categoryId) {
      setError("Please select a category");
      return;
    }

    const newRequest = {
      name : name,
      categoryId:Number(categoryId)
    };

    fetch("http://localhost:8081/requests", {
      method : "POST",
      headers : {
        "Content-Type" : "application/json",
        "Authorization" : `Bearer ${token}`,
      },
      body : JSON.stringify(newRequest),
    })
    .then((response)=>{
      if (!response.ok) {
        throw new Error("Failed to create request");
      }
      return response.json();
    })
    .then(()=>{
      setName("");  //clear form
      setMessage("Request created successfully!");
      setCategoryId(""); //after creating form resets
      //reload list from backend
      fetchRequests();
    })
    .catch((error)=>{
      console.error("Error creating requests : ", error);
      setError("Could not create request. Please try again");
    });
  };

  //UPDATE
  const markAsCompleted = (id) =>{
    setError("");
    fetch(`http://localhost:8081/requests/${id}/complete`,{method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
      }
    })
    .then((response)=>{
      if(!response.ok) {
        throw new Error("Failed to complete request");
      }
      setMessage("Request marked as completed!");
      fetchRequests(); //reload list after update
    })
    .catch((error)=>{
      console.error("Error completing request:", error);
      setError("Could not mark the request as completed. Please try later.");
    });
  };

  //DELETE
  const deleteRequest = (id) => {
    setError("");
    fetch(`http://localhost:8081/requests/${id}`, {method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      }
    }) //calls backend endpoint
    .then((response)=>{
      if(!response.ok) {
        throw new Error("Failed to delete the request. Please try later.");
      }
      setMessage("Request deleted successfully");
      fetchRequests(); //reload after delete
    })
    .catch((error)=>{
      console.error("Error deleting request: ", error);
      setError("Could not delete the request. Please try later.");
    });
  };

  return(
    <div className="app-container">
      <header>
        <h1>Guardian Link</h1>
        {token && <button onClick={handleLogout}>Logout</button>}
      </header>
      {!token ? ( //if token is null, show login message, else show the app
        <div className="auth-container">
          <div className="auth-card">
          {!showRegister ? (
            <>
          <h2>Login</h2>
          {error && <div className="error">{error}</div>}
          {message && <div className="success">{message}</div>}
          <form onSubmit={handleLogin}>
            <input type="email" placeholder="Email" value={email} onChange={(e)=> setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={(e)=> setPassword(e.target.value)} required />
            <button type="submit">Login</button>
          </form>
          <p>
            Don't have an account?{" "}
            <button type="button" onClick={()=> setShowRegister(true)}>Register</button>
          </p>
          </>
          ) : (
            <>
            <h2>Register</h2>
            {error && <div className="error">{error}</div>}
            {message && <div className="success">{message}</div>}
            <form onSubmit={handleRegister}>
              <input type="email" placeholder="Email" value={email} onChange={(e)=> setEmail(e.target.value)} required />
              <input type="password" placeholder="Password" value={password} onChange={(e)=> setPassword(e.target.value)} required />
              <button type="submit">Register</button>
            </form>
            <p>
              Already have an account?{" "}
              <button type="button" onClick={()=> setShowRegister(false)}>Back to Login</button>
            </p>
            </>
          )}
          </div>
        </div>
      ) : (
        <div className="dashboard">
        
      <div className="card">
        <h2> Help Request</h2>
        {error &&  <div className="error">{error}</div>}
        {message && <div className="success">{message}</div>}
        <form onSubmit={handleSubmit}>
      
          <input type="text" placeholder="Request title" value={name} onChange={(e)=> setName(e.target.value)} required />
    
          <div className="category-grud">
            {categories.map((cat)=>(
              <div key = {cat.id} className={`category-card ${categoryId === String(cat.id)?"selected":""}`} onClick={()=> setCategoryId(String(cat.id))}>
                {cat.name}
              </div>
  ))}
          </div>
     
        <button type="submit" disabled={loading}>
          {loading ? "Please wait..." : "Create Request"}
        </button>
      </form>
      </div>
      <div className="card">
      <h2>Help Requests</h2>
      {loading && <p> Loading...</p>}
      {!loading && requests.length === 0 && <p>No requests found.</p>}
      {!loading && requests.length > 0 &&(
        <div className="requests-grid">
          {requests.map((req)=> ( //loop over array, show each helpRequest on page
            <div key={req.id} className="request-card">
              <h3>{req.name}</h3>
              <p><strong>Category: </strong>{req.category?.name}</p>
              <span className={`status-badge ${req.status === "COMPLETED" ? "done" : "open"}`}>
               {req.status}
              </span>

              <div className="card-actions">
                {req.status === "OPEN" && ( //show button only if status not completed
                <button onClick={()=> markAsCompleted(req.id)} disabled={loading}>
                  Mark Completed
                </button>
              )}
              
              <button className="danger"onClick={()=>deleteRequest(req.id)} disabled = {loading}>
                Delete
              </button>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
       </div>
        
      )}
    </div>

  );
}
export default App;