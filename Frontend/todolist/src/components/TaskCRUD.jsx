import React, {useState, useEffect} from "react";

export function TaskCRUD() {
    const timeout_alert = 9000;

    const [records, setRecords] = useState([]);
    const [keyword, setKeyword] = useState("");

    // popup create
    const [showCreate, setShowCreate] = useState(false);
    const [newDesc, setNewDesc] = useState("");
    const [creating, setCreating] = useState(false);

    // success message (tạo mới / chỉnh sửa)
    const [successMsg, setSuccessMsg] = useState("");

    // popup edit
    const [showEdit, setShowEdit] = useState(false);
    const [editForm, setEditForm] = useState({ id: null, description: "", is_done: 0 });
    const [saving, setSaving] = useState(false);

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

    // CREATE -> POST { description }
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

            setSuccessMsg("Tạo mới thành công");
            setTimeout(() => setSuccessMsg(""), timeout_alert);
        } catch (err) {
            alert("Tạo task thất bại: " + err.message);
        } finally {
            setCreating(false);
        }
    };

    // OPEN EDIT modal
    const openEdit = (task) => {
        setEditForm({
            id: task.id,
            description: task.description ?? "",
            is_done: Number(task.is_done) ? 1 : 0,
        });
        setShowEdit(true);
    };

    // SAVE EDIT -> PUT { id, description, is_done }
    const handleEditSave = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            const payload = {
                id: editForm.id,
                description: editForm.description.trim(),
                is_done: Number(editForm.is_done),
            };
            if (!payload.description) throw new Error("Description không được để trống");

            const res = await fetch("http://127.0.0.1:8000/api/task", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            setShowEdit(false);
            loadAll();

            setSuccessMsg("Chỉnh sửa thành công");
            setTimeout(() => setSuccessMsg(""), timeout_alert);
        } catch (err) {
            alert("Cập nhật thất bại: " + err.message);
        } finally {
            setSaving(false);
        }
    };

    // chỉ hiển thị chưa bị xóa
    const visible = records.filter(r => !Number(r.is_deleted));

    return (
        <div className="container py-4">
            <div className="card shadow-sm">
                <div className="card-header bg-primary text-white">
                    <h5 className="mb-0 text-center">To Do List</h5>
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
                                {/* Căn giữa header cột Done? */}
                                <th className="text-center">Done?</th>
                                {/*<th>Deleted?</th>*/}
                                <th style={{ width: 220 }}>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {visible.map(r => (
                                <tr key={r.id}>
                                    <td>{r.id}</td>
                                    <td>{r.description}</td>

                                    {/* Cột Done? căn giữa, icon thẳng hàng với header */}
                                    <td className="text-center">
                                        {Number(r.is_done) ? (
                                            <span role="img" aria-label="Done" style={{ fontSize: "1.25rem", lineHeight: 1 }}>
                                                ✅
                                            </span>
                                        ) : (
                                            <span role="img" aria-label="Pending" style={{ fontSize: "1.25rem", lineHeight: 1 }}>
                                                ⏳
                                            </span>
                                        )}
                                    </td>

                                    {/*<td>{Number(r.is_deleted) ? "Yes" : "No"}</td>*/}
                                    <td className="d-flex gap-2">
                                        <button
                                            className="btn btn-warning btn-sm"
                                            onClick={() => openEdit(r)}
                                        >
                                            Edit
                                        </button>
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

                    {/* Success alert */}
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

            {/* Create Modal */}
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
                                            {creating ? "Creating..." : "Create"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop show"></div>
                </>
            )}

            {/* Edit Modal */}
            {showEdit && (
                <>
                    <div className="modal d-block" tabIndex="-1" role="dialog" style={{ background: "rgba(0,0,0,0.3)" }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <form onSubmit={handleEditSave}>
                                    <div className="modal-header">
                                        <h5 className="modal-title">Edit Task #{editForm.id}</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowEdit(false)} />
                                    </div>
                                    <div className="modal-body">
                                        <div className="mb-3">
                                            <label className="form-label">Description</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editForm.description}
                                                onChange={(e) => setEditForm(f => ({ ...f, description: e.target.value }))}
                                                placeholder="Nhập mô tả task..."
                                                autoFocus
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Is Done?</label>
                                            <select
                                                className="form-select"
                                                value={String(editForm.is_done)}
                                                onChange={(e) => setEditForm(f => ({ ...f, is_done: Number(e.target.value) }))}
                                            >
                                                <option value="0">Không</option>
                                                <option value="1">Có</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() => setShowEdit(false)}
                                            disabled={saving}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-warning"
                                            disabled={saving || !editForm.description.trim()}
                                        >
                                            {saving ? "Saving..." : "Save"}
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
