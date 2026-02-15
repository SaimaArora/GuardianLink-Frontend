import {useEffect, useState } from "react";

function App() {
  //create state variable called requests, initally []
  //when we call setRequests(data) -> react updates the value, and re renders the ui
  const [requests, setRequests] = useState([]); //will hold list of reqests from backend

  const [name, setName] = useState("");

  //for ux - show loading spinner, and error message if api call fails
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [categories, setCategories] = useState([]); //for dropdown of categories
  const [categoryId, setCategoryId] = useState("");

  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");

  //fetch ALL requests from backend
  const fetchRequests = () => {
    setMessage("");
    setLoading(true); //start loading
    setError(""); //clear prev error
    fetch("http://localhost:8081/requests")
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

  const fetchUsers = () => {
    fetch("http://localhost:8081/users")
      .then((response) => {
        if(!response.ok) {
          throw new Error("Failed to fetch users");
        }
        return response.json();
      })
      .then((data)=> {
        setUsers(data);
      })
      .catch((error)=> {
        console.error("Error fetching users: ", error);
        setError("Could not load users. Please try again later.");
      });
  };

  //runs once when component loads - used to call the backend api
  useEffect(()=>{
    fetchRequests();
    fetchCategories();
    fetchUsers();
  }, []);


   
  //CREATE
  const handleSubmit = (e) =>{
    e.preventDefault();
    setError("");
    setMessage("");

    if(!categoryId) {
      setError("Please select a category");
      return;
    }
    if (!userId) {
      setError("Please select a user");
      return;
    }

    const newRequest = {
      name : name,
      categoryId:Number(categoryId),
      userId:Number(userId),
      status : "Pending"
    };

    fetch("http://localhost:8081/requests", {
      method : "POST",
      headers : {
        "Content-Type" : "application/json",
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
      setUserId("");
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
    fetch(`http://localhost:8081/requests/${id}/complete`,{method: "PUT",})
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
    fetch(`http://localhost:8081/requests/${id}`, {method: "DELETE",}) //calls backend endpoint
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
    <div>
      <h1>Guardian Link</h1>
      <h2> Help Request</h2>
      {error && <p style={{color:"red"}} >{error}</p>}
      {message && <p style={{ color: "green"}}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <input type="text" placeholder="Name" value={name} onChange={(e)=> setName(e.target.value)} required />
        </div>
        <div>
          <select value={userId} onChange={(e) => setUserId(e.target.value)} required>
          <option value="">Select User</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
          </select>
        </div>
        <div>
          <select value={categoryId} onChange = {(e) => setCategoryId(e.target.value)} required>
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Please wait..." : "Create Request"}
        </button>
      </form>
      <hr/>
      <h2>Help Requests</h2>
      {loading && <p> Loading...</p>}
      {!loading && requests.length === 0 && <p>No requests found.</p>}
      {!loading && requests.length > 0 &&(
        <ul>
          {requests.map((req)=> ( //loop over array, show each helpRequest on page
            <li key={req.id}>
              <strong>{req.name}</strong> - {req.user?.name} - {req.category?.name} - {req.status}{" "}
              {req.status === "OPEN" && ( //show button only if status not completed
                <button onClick={()=> markAsCompleted(req.id)} disabled={loading}>
                  Mark As Completed
                </button>
              )}{" "}
              <button onClick={()=>deleteRequest(req.id)} disabled = {loading}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
export default App;