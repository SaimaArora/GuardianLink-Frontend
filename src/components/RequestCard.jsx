function RequestCard({ req, role, onComplete, onDelete }) {
    console.log("Role in card : ", role);
    return(
        <div className="request-card">
            <h3>{req.title}</h3>
            <p>
                <strong>Description:</strong> 
                {req.category?.name}
            </p>
            <span className={`status-badge ${req.status === "COMPLETED"?"done":"open"}`}>{req.status}</span>
        
            <div className="card-actions">
                {req.status === "OPEN" && role==="VOLUNTEER"  && (
                    <button onClick={()=> onComplete(req.id)}>Mark as Completed</button>
                )}
                {role === "USER" && (
                    <button onClick={()=> onDelete(req.id)} className="danger">Delete</button>
                )}
                
            </div>
        </div>
    );
}
export default RequestCard;