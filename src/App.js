import {useEffect, useState } from "react";

function App() {
  //create state variable called requests, initally []
  //when we call setRequests(data) -> react updates the value, and re renders the ui
  const [requests, setRequests] = useState([]); //will hold list of reuests from backend

  //runs once when component loads - used to call the backend api
  useEffect(()=>{
    fetch("http://localhost:8081/requests") //calls springboot api, gets json list of helpRequest objects
    .then((response)=>response.json())
    .then((data)=>{
      console.log("Data from backend", data);
      setRequests(data); //store it in state after conversion
    })
    .catch((error)=>{
      console.error("Error fetching requests:", error);
    });
  }, []); //run only once on page load

  return(
    <div>
      <h1>Guardian Link</h1>
      <h2> Help Request</h2>
      {requests.length === 0 ? (
        <p>No request found.</p>
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