import {useState} from "react";
import RequestCard from "./RequestCard";

function RequestsList({
    requests, loading, token, role, setError, setMessage, fetchRequests}) 
{
    const [statusFilter, setStatusFilter] = useState("ALL"); //all, open, inprogress, completed
    
    const handleUnauthorized = () => {
        localStorgae.removeItem("token");
        localStorage.removeItem("role");
        window.location.reload();
    }

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
                handleUnauthorized();
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
    const claimRequest=(id)=>{
        setError("");
        fetch(`http://localhost:8081/requests/${id}/claim`,{
            method:"PUT",
            headers:{
                Authorization:`Bearer ${token}`,
            },
        })
        .then((response)=>{
            if(response.status === 401 || response.status === 403) {
                handleUnauthorized();
                throw new Error("Unauthorized");
            }
            if(!response.ok) {
                throw new Error("Failed to claim the request. Please try later.");
            }
            setMessage("Request claimed successfully!");
            fetchRequests();
        })
        .catch((error)=>{
            console.error("Error claiming request: ", error);
            setError(error.message);
        });
    }
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
                handleUnauthorized();
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

    const filteredRequests = requests.filter((req) => {
        if(statusFilter === "ALL") return true;
        return req.status === statusFilter;
    });

    return(
        <>
      {/* Filter Controls */}
      <div className="card-actions" style={{ marginBottom: "16px" }}>
        {["ALL", "OPEN", "IN_PROGRESS", "COMPLETED"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            disabled={statusFilter === status}
          >
            {status.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && <p style={{opacity:0.7}}>Loading requests...</p>}

      {/* Empty State */}
      {!loading && filteredRequests.length === 0 && (
        <p style={{opacity:0.7}}>
          {role === "USER"
            ? "You haven't created any requests yet."
            : "No requests available for this filter."}
        </p>
      )}

      {/* Requests Grid */}
      {!loading && filteredRequests.length > 0 && (
        <div className="requests-grid">
          {filteredRequests.map((req) => (
            <RequestCard
              key={req.id}
              req={req}
              role={role}
              onClaim={claimRequest}
              onComplete={markAsCompleted}
              onDelete={deleteRequest}
            />
          ))}
        </div>
      )}
    </>
    );
}
export default RequestsList;