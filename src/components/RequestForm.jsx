function RequestForm({
    token, name, setName, categoryId, setCategoryId, categories,loading, setError, setMessage, fetchRequests
}) {
    const handleSubmit = (e) =>{
        e.preventDefault();
        setError("");
        setMessage("");
        if(!categoryId) {
            setError("Please select a category");
            return;
        }
        const newRequest = {
            name : name, 
            categoryId : Number(categoryId),
        }
        fetch("http://localhost:8081/requests", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(newRequest),
        })
        .then((response) => {
  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem("token");
    window.location.reload();
    throw new Error("Unauthorized");
  }
  if (!response.ok) {
    throw new Error("Failed to create request");
  }
  return response.json();
})
        .then(()=>{
            setMessage("Request created successfully");
            setName("");
            setCategoryId("");
            fetchRequests();
        })
        .catch((error)=>{
            console.error("Error creating request:", error);
            setError(error.message);
        });
    };
    return(
        <div className="card">
            <h2>Help Request</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Request title" value={name} onChange={(e)=> setName(e.target.value)} required   />
                <div className="category-grid">
                    {categories.map((cat) => (
                        <div key={cat.id} className={`category-card ${categoryId === String(cat.id)? "selected" : ""}`} onClick={()=> setCategoryId(String(cat.id))}>
                            {cat.name}
                        </div>
                    ))}
                </div>
                <button type="submit" disabled={loading}>{loading ? "Please wait..." : "Create Request"}</button>
            </form>
        </div>
    );
}
export default RequestForm;