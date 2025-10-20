import React, {useState, useEffect} from "react";

export function TaskCRUD() {
    const [records, setRecords] = useState([]);
    const [keyword, setKeyword] = useState("");

    // popup create
    const [showCreate, setShowCreate] = useState(false);
    const [newDesc, setNewDesc] = useState("");
    const [creating, setCreating] = useState(false);

    // success message
    const [successMsg, setSuccessMsg] = useState("");

    // load all
    const loadAll = () => {
        fetch("http://127.0.0.1:8000/api/task")
            .then(res => res.json())
            .then(data => setRecords(Array.isArray(data) ? data : []))
            .catch(err => console.log(err));
    };

    useEffect(() => { loadAll(); }, []);

    // search
    const onSearch = (e) => {
        e.preventDefault();
        const q = keyword.trim();
        if (!q) return loadAll();
        fetch(`http://127.0.0.1:8000/api/task-search?keyword=${encodeURIComponent(q)}`)
            .then(res => res.json())
            .then(data => setRecords(Array.isArray(data) ? data : []))
            .catch(err => console.log(err));
    };

    // DELETE
    const handleDelete = (id) => {
        if (!window.confirm(`Xóa task #${id}?`)) return;
        fetch(`http://127.0.0.1:8000/api/task?id=${id}`, { method: "DELETE" })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                setRecords(prev => prev.filter(t => t.id !== id));
            })
            .catch(err => alert("Xóa thất bại: " + err.message));
    };

    // CREATE -> POST { description }, show success (bên dưới bảng)
    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        const desc = newDesc.trim();
        if (!desc) return;
        try {
            setCreating(true);
            const res = await fetch("http://127.0.0.1:8000/api/task", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ description: desc })
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            setNewDesc("");
            setShowCreate(false);
            loadAll();

            // Hiển thị thông báo dưới bảng
            setSuccessMsg("Tạo mới thành công");
            setTimeout(() => setSuccessMsg(""), 3000);
        } catch (err) {
            alert("Tạo task thất bại: " + err.message);
        } finally {
            setCreating(false);
        }
    };

    // chỉ hiển thị chưa bị xóa
    const visible = records.filter(r => !Number(r.is_deleted));

    return (
        <div className="container py-4">
            <div className="card shadow-sm">
                <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">All Tasks</h5>
                </div>

                <div className="card-body">
                    {/* Search */}
                    <form className="row g-2 mb-3" onSubmit={onSearch}>
                        <div className="col-sm-9">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by description..."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                            />
                        </div>
                        <div className="col-sm-3 d-flex gap-2">
                            <button type="submit" className="btn btn-primary w-100">Search</button>
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => { setKeyword(""); loadAll(); }}
                            >
                                Clear
                            </button>
                        </div>
                    </form>

                    {/* Table */}
                    <div className="table-responsive">
                        <table className="table table-striped table-hover align-middle">
                            <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Description</th>
                                <th>Done?</th>
                                <th>Deleted?</th>
                                <th style={{ width: 160 }}>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {visible.map(r => (
                                <tr key={r.id}>
                                    <td>{r.id}</td>
                                    <td>{r.description}</td>
                                    <td>{Number(r.is_done) ? "Yes" : "No"}</td>
                                    <td>{Number(r.is_deleted) ? "Yes" : "No"}</td>
                                    <td>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(r.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {visible.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center text-muted">Không có dữ liệu.</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>

                    {/* Success alert: ĐẶT Ở ĐÂY, dưới danh sách task */}
                    {successMsg && (
                        <div className="alert alert-success alert-dismissible fade show mt-2" role="alert">
                            {successMsg}
                            <button type="button" className="btn-close" onClick={() => setSuccessMsg("")}></button>
                        </div>
                    )}

                    {/* Create button */}
                    <div className="mt-3">
                        <button className="btn btn-success" onClick={() => setShowCreate(true)}>
                            + Create new task
                        </button>
                    </div>
                </div>

                <div className="card-footer text-muted">
                    Tổng số hiển thị: <strong>{visible.length}</strong> tasks
                </div>
            </div>

            {/* Modal */}
            {showCreate && (
                <>
                    <div className="modal d-block" tabIndex="-1" role="dialog" style={{ background: "rgba(0,0,0,0.3)" }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <form onSubmit={handleCreateSubmit}>
                                    <div className="modal-header">
                                        <h5 className="modal-title">Create New Task</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowCreate(false)} />
                                    </div>
                                    <div className="modal-body">
                                        <div className="mb-3">
                                            <label className="form-label">Description</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={newDesc}
                                                onChange={(e) => setNewDesc(e.target.value)}
                                                placeholder="Nhập mô tả task..."
                                                autoFocus
                                            />
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() => setShowCreate(false)}
                                            disabled={creating}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-success"
                                            disabled={creating || !newDesc.trim()}
                                        >
                                            {creating ? "Submitting..." : "Submit"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop show"></div>
                </>
            )}
        </div>
    );
}
