function RequestCard({ req, role, onClaim, onComplete, onDelete }) {

  const getStatusClass = () => {
    if (req.status === "OPEN") return "open";
    if (req.status === "IN_PROGRESS") return "in-progress";
    if (req.status === "COMPLETED") return "done";
    return "";
  };

  const canVolunteerClaim =
    role === "VOLUNTEER" && req.status === "OPEN";

  const canVolunteerComplete =
    role === "VOLUNTEER" && req.status === "IN_PROGRESS";

  const canUserDelete =
    role === "USER";

  return (
    <div className="request-card">

      <h3>{req.name}</h3>

      <p>
        <strong>Category:</strong> {req.categoryName}
      </p>

      <p>
        <strong>Created By:</strong> {req.requestedBy}
      </p>

      <p>
        <strong>Assigned To:</strong>{" "}
        {req.assignedVolunteer ? req.assignedVolunteer : "Not assigned yet"}
      </p>

      <span className={`status-badge ${getStatusClass()}`}>
        {req.status.replace("_", " ")}
      </span>

      <div className="card-actions">

        {canVolunteerClaim && (
          <button onClick={() => onClaim(req.id)}>
            Claim
          </button>
        )}

        {canVolunteerComplete && (
          <button onClick={() => onComplete(req.id)}>
            Mark Completed
          </button>
        )}

        {canUserDelete && (
          <button
            onClick={() => onDelete(req.id)}
            className="danger"
          >
            Delete
          </button>
        )}

      </div>

    </div>
  );
}

export default RequestCard;