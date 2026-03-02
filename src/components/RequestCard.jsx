function RequestCard({ req, role, onClaim, onComplete, onDelete }) {
    console.log("Role in card : ", role);
    const getStatusClass = () => {
        switch(req.status) {
            case "OPEN":
                return "open";
            case "IN_PROGRESS":
                return "in-progress";
            case "COMPLETED":
                return "done";
            default:
                return "";
        }
    };
    const canVolunteerClaim = role === "VOLUNTEER" && req.status === "OPEN";
    const canVolunteerComplete = role === "VOLUNTEER" && req.status === "IN_PROGRESS";
    const canUserDelete = role === "USER";

    return(
        <div className="request-card">
            <h3>{req.name}</h3>
            <p>
                <strong>Category:</strong> 
                {req.category?.name || req.categoryName}
            </p>

            {req.requestedBy &&(
                <p><strong>Created By: </strong>{req.requestedBy}</p>
            )}
            
            <p><strong>Assigned to: </strong>{" "}
                {req.assignedVolunteerEmail || "Not assigned yet"}
            </p>
        
            <span className={`status-badge ${getStatusClass()}`}>{req.status.replace("_", " ")}</span>
        
            <div className="card-actions">
                {canVolunteerClaim && (
                    <button onClick={()=> onClaim(req.id)} >Claim</button>
                )}
                {canVolunteerComplete && (
                    <button onClick={()=> onComplete(req.id)} className="success">Mark as Completed</button>
                )}
                {canUserDelete && (
                    <button onClick={()=> onDelete(req.id)} className="danger">Delete</button>
                )}
                
            </div>
        </div>
    );
}
export default RequestCard;