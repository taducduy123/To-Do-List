import React, {useState, useEffect} from "react";

export function TaskCRUD() {
    const [records, setRecords] = useState([]);
    const [keyword, setKeyword] = useState("");

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

    // DELETE -> backend sẽ đặt is_deleted = true; frontend cập nhật lại
    const handleDelete = (id) => {
        if (!window.confirm(`Xóa task #${id}?`)) return;
        fetch(`http://127.0.0.1:8000/api/task?id=${id}`, {
            method: "DELETE"
        })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                // Cập nhật UI: loại bỏ record vừa xóa
                setRecords(prev => prev.filter(t => t.id !== id));
                // hoặc nếu muốn giữ trong state nhưng ẩn đi:
                // setRecords(prev => prev.map(t => (t.id === id ? { ...t, is_deleted: 1 } : t)));
            })
            .catch(err => alert("Xóa thất bại: " + err.message));
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
                                <th style={{ width: 110 }}>Actions</th>
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
                </div>

                <div className="card-footer text-muted">
                    Tổng số hiển thị: <strong>{visible.length}</strong> tasks
                </div>
            </div>
        </div>
    );
}
