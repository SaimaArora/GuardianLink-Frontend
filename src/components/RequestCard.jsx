function RequestCard({ req, role, onClaim, onComplete, onDelete }) {
    console.log("Role in card : ", role);
    return(
        <div className="request-card">
            <h3>{req.name}</h3>
            <p>
                <strong>Category:</strong> 
                {req.category?.name}
            </p>

            {req.user &&(
                <p><strong>Created By: </strong>{req.user.email}</p>
            )}
            
            <p><strong>Assigned to: </strong>{" "}
                {req.assignedVolunteer ? req.assignedVolunteer.email : "Not assigned yet"}
            </p>
        
            <span className={`status-badge ${req.status === "COMPLETED"?"done":"open"}`}>{req.status}</span>
        
            <div className="card-actions">
                {req.status ==="OPEN" && role === "VOLUNTEER" &&(
                    <button onClick={()=> onClaim(req.id)} >Claim</button>
                )}
                {req.status ==="IN_PROGRESS" && role ==="VOLUNTEER" && (
                    <button onClick={()=> onComplete(req.id)} className="success">Mark as Completed</button>
                )}
                {role === "USER" && (
                    <button onClick={()=> onDelete(req.id)} className="danger">Delete</button>
                )}
                
            </div>
        </div>
    );
}
export default RequestCard;