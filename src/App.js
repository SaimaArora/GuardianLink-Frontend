import {useEffect, useState } from "react";

function App() {
  //create state variable called requests, initally []
  //when we call setRequests(data) -> react updates the value, and re renders the ui
  const [requests, setRequests] = useState([]); //will hold list of reqests from backend

  const [name, setName] = useState("");
  const [helpType, setHelpType] = useState("");

  //for ux - show loading spinner, and error message if api call fails
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  //fetch ALL requests from backend
  const fetchRequests = () => {
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

  //runs once when component loads - used to call the backend api
  useEffect(()=>{
    fetchRequests();
  }, []);
   
  //CREATE
  const handleSubmit = (e) =>{
    e.preventDefault();
    setError("");

    const newRequest = {
      name : name,
      helpType : helpType,
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
      setHelpType("");
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
      <form onSubmit={handleSubmit}>
        <div>
          <input type="text" placeholder="Name" value={name} onChange={(e)=> setName(e.target.value)} required />
        </div>
        <div>
          <input type="text" placeholder="Help Type" value={helpType} onChange= {(e)=> setHelpType(e.target.value)} required />
        </div>
        <button type="submit">Create Request</button>
      </form>
      <hr/>
      <h2>Help Requests</h2>
      {loading && <p> Loading...</p>}
      {!loading && requests.length === 0 && <p>No requests found.</p>}
      {!loading && requests.length > 0 &&(
        <ul>
          {requests.map((req)=> ( //loop over array, show each helpRequest on page
            <li key={req.id}>
              <strong>{req.name}</strong> - {req.helpType} - {req.status}{" "}
              {req.status !== "COMPLETED" && ( //show button only if status not completed
                <button onClick={()=> markAsCompleted(req.id)}>
                  Mark As Completed
                </button>
              )}{" "}
              <button onClick={()=>deleteRequest(req.id)}>
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