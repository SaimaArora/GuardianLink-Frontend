import {useEffect, useState } from "react";

function App() {
  //create state variable called requests, initally []
  //when we call setRequests(data) -> react updates the value, and re renders the ui
  const [requests, setRequests] = useState([]); //will hold list of reuests from backend

  const [name, setName] = useState("");
  const [helpType, setHelpType] = useState("");

  //fetch ALL requests from backend
  const fetchRequests = () => {
    fetch("http://localhost:8081/requests")
      .then((response) => response.json())
      .then((data)=> {
        setRequests(data);
      })
      .catch((error)=> {
        console.error("Error fetching requests: ", error);
      });
  };

  //runs once when component loads - used to call the backend api
  useEffect(()=>{
    fetchRequests();
  }, []);
   
  const handleSubmit = (e) =>{
    e.preventDefault();

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
    .then((response)=> response.json())
    .then((data)=>{
      setName("");  //clear form
      setHelpType("");
      //reload list from backend
      fetchRequests();
    })
    .catch((error)=>{
      console.error("Error creating requests : ", error);
    });
  };

  return(
    <div>
      <h1>Guardian Link</h1>
      <h2> Help Request</h2>
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
      {requests.length === 0 ? (
        <p>No Requests found.</p>
      ) : (
        <ul>
          {requests.map((req)=> ( //loop over array, show each helpRequest on page
            <li key={req.id}>
              <strong>{req.name}</strong> - {req.helpType} - {req.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
export default App;