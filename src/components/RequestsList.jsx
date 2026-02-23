import RequestCard from "./RequestCard";

function RequestsList({
    requests, loading, token, role, setError, setMessage, fetchRequests}) 
{
    const markAsCompleted = (id)=>{
        setError("");
        fetch(`http://localhost:8081/requests/${id}/complete`, {
            method: "PUT",
            headers: {
                Authorization : `Bearer ${token}`,
    } ,
        })
        .then((response) => {
  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem("token");
    window.location.reload();
    throw new Error("Unauthorized");
  }
  if (!response.ok) {
    throw new Error("Failed to complete request");
  }
  setMessage("Request marked as completed!");
  fetchRequests();
})
        .catch((error)=>{
            console.error("Error marking request as completed:", error);
            setError(error.message);
        });
    };
    const deleteRequest = (id) => {
        setError("");
        fetch(`http://localhost:8081/requests/${id}`, {
            method: "DELETE",
            headers: {
                Authorization : `Bearer ${token}`,
            }
        })
        .then((response) => {
  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem("token");
    window.location.reload();
    throw new Error("Unauthorized");
  }
  if (!response.ok) {
    throw new Error("Failed to delete the request. Please try later.");
  }
  setMessage("Request deleted successfully");
  fetchRequests();
})
        .catch((error) => {
            console.error("Error deleting request:", error);
            setError(error.message);
        });
    };
    return(
        <div className="card">
            <h2>Help Requests</h2>
            {loading &&<p>Loading...</p>}
            {!loading && requests.length === 0 && <p>No requests found. Be the first to create one!</p>}
            {!loading && requests.length > 0 && (
                <div className="requests-grid">
                    {requests.map((req) => (
                        <RequestCard
                            key={req.id}
                            req={req}
                            role={role}
                            onComplete={markAsCompleted}
                            onDelete={deleteRequest}/>
                    ))}
                    </div>
            )}
        </div>

    );
}
export default RequestsList;