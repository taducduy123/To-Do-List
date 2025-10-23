import React, {useState, useEffect} from "react";

export function TaskCRUD() {
    const timeout_alert = 4000;

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
    const [editForm, setEditForm] = useState({id: null, description: "", is_done: 0});
    const [saving, setSaving] = useState(false);

    // Chế độ hiển thị 1 task (sau khi tạo mới)
    const [singleMode, setSingleMode] = useState(false);

    // ----------------- PHÂN TRANG (chỉ khi KHÔNG search) -----------------
    const [page, setPage] = useState(1);    // 1-based
    const [size] = useState(20);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [hasNext, setHasNext] = useState(false);

    // Tổng số bản ghi (lấy từ /api/task-count)
    const [total, setTotal] = useState(0);

    // derived
    const isSearching = Boolean(keyword.trim());
    const showPager = !singleMode && !isSearching;
    const lastPage = Math.max(1, Math.ceil((total || 0) / size));
    const hasPrev = page > 1 && showPager;
    const canNext = showPager && (total ? page < lastPage : hasNext);

    // ----------------- HELPERS -----------------
    const shapeTask = (raw, fallback = {}) => {
        const obj = raw && raw.data ? raw.data : raw;
        const asArr = Array.isArray(obj) ? obj[0] : obj;

        const id =
            (asArr && (asArr.id ?? asArr.insertId ?? asArr.lastId ?? asArr.inserted_id ?? asArr.task_id)) ??
            fallback.id ?? null;

        const description =
            (asArr && (asArr.description ?? asArr.desc ?? asArr.name)) ??
            fallback.description ?? "";

        const is_done = Number(asArr && asArr.is_done) || Number(fallback.is_done) || 0;
        const is_deleted = Number(asArr && asArr.is_deleted) || Number(fallback.is_deleted) || 0;

        return {id, description, is_done: is_done ? 1 : 0, is_deleted: is_deleted ? 1 : 0};
    };

    // Đọc total an toàn cho mọi kiểu (mảng / object)
    const readCountSafely = (data) => {
        // Trường hợp API trả mảng: [{ total: number }]
        if (Array.isArray(data) && data.length > 0) {
            const t = data[0]?.total ?? data[0]?.count ?? data[0]?.value;
            if (typeof t === "number") return t;
        }
        // Trường hợp object: { total: number } / { count: number } / { total: { value: number } }
        if (typeof data?.total === "number") return data.total;
        if (typeof data?.count === "number") return data.count;
        if (data?.total && typeof data.total.value === "number") return data.total.value;
        return 0;
    };

    // fetchTotal: vừa setState vừa trả về số total để dùng ngay
    const fetchTotal = async () => {
        try {
            const res = await fetch("http://127.0.0.1:8000/api/task-count");
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            const t = readCountSafely(data);
            const n = Number.isFinite(t) ? t : 0;
            setTotal(n);
            return n;
        } catch (e) {
            console.error(e);
            return total; // fallback: trả về state hiện tại
        }
    };

    // ----------------- DATA LOADERS -----------------
    const fetchPage = async (p) => {
        try {
            setLoading(true);
            setError("");
            setSingleMode(false);

            const res = await fetch(`http://127.0.0.1:8000/api/task-pagination?page=${p}&size=${size}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();
            const items = Array.isArray(data) ? data : (data.items ?? []);
            setRecords(items);

            // Nếu biết total -> xác định next theo page < lastPage; nếu chưa biết, fallback theo độ dài items
            if (total > 0) {
                setHasNext(p < Math.max(1, Math.ceil(total / size)));
            } else {
                setHasNext(items.length === size);
            }
        } catch (e) {
            console.error(e);
            setError("Không tải được dữ liệu. Vui lòng thử lại.");
            setRecords([]);
            setHasNext(false);
        } finally {
            setLoading(false);
        }
    };

    // Search KHÔNG phân trang
    const fetchSearch = async (q) => {
        try {
            setLoading(true);
            setError("");
            setSingleMode(false);

            const res = await fetch(`http://127.0.0.1:8000/api/task-search?keyword=${encodeURIComponent(q)}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();
            setRecords(Array.isArray(data) ? data : []);
            setHasNext(false);
        } catch (e) {
            console.error(e);
            setError("Không tải được dữ liệu tìm kiếm.");
            setRecords([]);
            setHasNext(false);
        } finally {
            setLoading(false);
        }
    };

    // Lần đầu vào: lấy total và trang 1
    useEffect(() => {
        (async () => {
            const t = await fetchTotal();
            setPage(1);
            await fetchPage(1);
            // nếu page 1 mà > lastPage (khi t=0) cũng OK vì fetchPage đã xử lý empty
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Làm mới theo ngữ cảnh hiện tại
    const refreshView = async () => {
        const q = keyword.trim();
        if (q) {
            await fetchSearch(q);
        } else {
            const t = await fetchTotal();
            const lp = Math.max(1, Math.ceil((t || 0) / size));
            const safePage = Math.min(page, lp);
            if (safePage !== page) setPage(safePage);
            await fetchPage(safePage);
        }
    };

    // search submit
    const onSearch = async (e) => {
        e.preventDefault();
        const q = keyword.trim();
        if (q) {
            await fetchSearch(q);
        } else {
            setPage(1);
            await fetchTotal();
            await fetchPage(1);
        }
    };

    // DELETE
    const handleDelete = (id) => {
        if (!window.confirm(`Xóa task #${id}?`)) return;
        fetch(`http://127.0.0.1:8000/api/task?id=${id}`, {method: "DELETE"})
            .then(async (res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                if (singleMode) {
                    setRecords([]);
                } else {
                    const t = await fetchTotal();
                    const lp = Math.max(1, Math.ceil((t || 0) / size));
                    const safePage = Math.min(page, lp);
                    setPage(safePage);
                    await fetchPage(safePage);
                }
            })
            .catch(err => alert("Xóa thất bại: " + err.message));
    };

    // CREATE -> chỉ hiển thị task vừa tạo (singleMode)
    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        const desc = newDesc.trim();
        if (!desc) return;
        try {
            setCreating(true);
            const res = await fetch("http://127.0.0.1:8000/api/task", {
                method: "POST",
                headers: {"Content-Type": "application/json", "Accept": "application/json"},
                body: JSON.stringify({description: desc})
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            let created = null;
            const txt = await res.text();
            if (txt) {
                try {
                    created = JSON.parse(txt);
                } catch {
                    created = txt;
                }
            }

            const createdTask = shapeTask(created, {description: desc});

            setNewDesc("");
            setShowCreate(false);

            // Single mode & ẩn phân trang
            setSingleMode(true);
            setRecords(createdTask && createdTask.id != null ? [createdTask] : []);
            setKeyword(""); // clear search nếu đang có

            // cập nhật total để khi quay lại list có số liệu đúng
            await fetchTotal();

            setSuccessMsg("Tạo mới thành công");
            setTimeout(() => setSuccessMsg(""), timeout_alert);
        } catch (err) {
            alert("Tạo task thất bại: " + err.message);
        } finally {
            setCreating(false);
        }
    };

    // OPEN EDIT
    const openEdit = (task) => {
        setEditForm({
            id: task.id,
            description: task.description ?? "",
            is_done: Number(task.is_done) ? 1 : 0,
        });
        setShowEdit(true);
    };

    // SAVE EDIT
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
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            let updated = null;
            const txt = await res.text();
            if (txt) {
                try {
                    updated = JSON.parse(txt);
                } catch {
                    updated = txt;
                }
            }
            const updatedTask = shapeTask(updated, payload);

            setShowEdit(false);

            if (singleMode) {
                setRecords(prev => {
                    if (!prev || prev.length === 0) return updatedTask.id != null ? [updatedTask] : [];
                    return prev.map(t => t.id === payload.id ? {...t, ...updatedTask} : t);
                });
            } else {
                await refreshView();
            }

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

    // Tính from–to chỉ khi KHÔNG search và KHÔNG single
    const fromIdx = showPager && visible.length ? ((page - 1) * size + 1) : (visible.length ? 1 : 0);
    const toIdx = showPager && visible.length ? ((page - 1) * size + visible.length) : visible.length;

    // --------- Handlers phân trang (First/Prev/Next/Last) ----------
    const goFirst = async () => {
        if (!showPager || loading || page === 1) return;
        setPage(1);
        await fetchPage(1);
    };

    const goPrev = async () => {
        if (!showPager || loading || !hasPrev) return;
        const p = page - 1;
        setPage(p);
        await fetchPage(p);
    };

    const goNext = async () => {
        if (!showPager || loading || !canNext) return;
        const p = page + 1;
        setPage(p);
        await fetchPage(p);
    };

    const goLast = async () => {
        if (!showPager || loading) return;
        const t = await fetchTotal(); // lấy total mới nhất
        const lp = Math.max(1, Math.ceil((t || 0) / size));
        if (lp !== page) {
            setPage(lp);
            await fetchPage(lp);
        }
    };

    return (
        <div className="container py-4">
            <div className="card shadow-sm">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
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
                                onClick={async () => {
                                    setKeyword("");
                                    setPage(1);
                                    await fetchTotal();
                                    await fetchPage(1);
                                }}
                            >
                                Clear
                            </button>
                        </div>
                    </form>

                    {error && <div className="alert alert-danger py-2">{error}</div>}
                    {loading && <div className="text-muted mb-2">Đang tải dữ liệu…</div>}

                    {/* Table */}
                    <div className="table-responsive"
                         style={{maxHeight: 420, overflowY: "auto", border: "1px solid #dee2e6", borderRadius: 6}}>
                        <table className="table table-striped table-hover align-middle mb-0">
                            <thead className="table-dark" style={{position: "sticky", top: 0, zIndex: 1}}>
                            <tr>
                                <th>ID</th>
                                <th>Description</th>
                                <th className="text-center">Done?</th>
                                <th style={{width: 220}}>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {visible.map(r => (
                                <tr key={r.id}>
                                    <td>{r.id}</td>
                                    <td>{r.description}</td>
                                    <td className="text-center">
                                        {Number(r.is_done) ? (
                                            <span role="img" aria-label="Done"
                                                  style={{fontSize: "1.25rem", lineHeight: 1}}>✅</span>
                                        ) : (
                                            <span role="img" aria-label="Pending"
                                                  style={{fontSize: "1.25rem", lineHeight: 1}}>⏳</span>
                                        )}
                                    </td>
                                    <td className="d-flex gap-2">
                                        <button className="btn btn-warning btn-sm" onClick={() => openEdit(r)}>Edit
                                        </button>
                                        <button className="btn btn-danger btn-sm"
                                                onClick={() => handleDelete(r.id)}>Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {visible.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center text-muted">
                                        {singleMode ? "Không có dữ liệu (đã xoá task hiện tại)." : "Không có dữ liệu."}
                                    </td>
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

                    {/* Create */}
                    <div className="mt-3">
                        <button className="btn btn-success" onClick={() => setShowCreate(true)}>
                            + Create new task
                        </button>
                    </div>
                </div>

                <div className="card-footer d-flex justify-content-between align-items-center text-muted">
                    <span>
                        Hiển thị: <strong>{fromIdx ? `${fromIdx}–${toIdx}` : 0}</strong>
                        {showPager ? ` / Tổng: ${total}` : ""}
                    </span>

                    {showPager && (
                        <div className="d-flex align-items-center gap-2">
                            <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={goFirst}
                                disabled={loading || !hasPrev}
                                title="Trang đầu"
                            >
                                « First
                            </button>

                            <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={goPrev}
                                disabled={loading || !hasPrev}
                                title="Trang trước"
                            >
                                ‹ Previous
                            </button>

                            <span className="small">
                                Trang <strong>{page}</strong> {total ? ` / ${lastPage}` : ""}
                            </span>

                            <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={goNext}
                                disabled={loading || !canNext}
                                title="Trang sau"
                            >
                                Next ›
                            </button>

                            <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={goLast}
                                disabled={loading || (total ? page >= lastPage : false)}
                                title="Trang cuối"
                            >
                                Last »
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Modal */}
            {showCreate && (
                <>
                    <div className="modal d-block" tabIndex="-1" role="dialog" style={{background: "rgba(0,0,0,0.3)"}}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <form onSubmit={handleCreateSubmit}>
                                    <div className="modal-header">
                                        <h5 className="modal-title">Create New Task</h5>
                                        <button type="button" className="btn-close"
                                                onClick={() => setShowCreate(false)}/>
                                    </div>
                                    <div className="modal-body">
                                        <div className="mb-3">
                                            <label className="form-label">Description (max 100 characters)</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={newDesc}
                                                onChange={(e) => setNewDesc(e.target.value)}
                                                placeholder="Nhập mô tả task (max 100 characters)..."
                                                autoFocus
                                                maxLength={100}
                                            />
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-outline-secondary"
                                                onClick={() => setShowCreate(false)} disabled={creating}>
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-success"
                                                disabled={creating || !newDesc.trim()}>
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
                    <div className="modal d-block" tabIndex="-1" role="dialog" style={{background: "rgba(0,0,0,0.3)"}}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <form onSubmit={handleEditSave}>
                                    <div className="modal-header">
                                        <h5 className="modal-title">Edit Task #{editForm.id}</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowEdit(false)}/>
                                    </div>
                                    <div className="modal-body">
                                        <div className="mb-3">
                                            <label className="form-label">Description (max 100 characters)</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editForm.description}
                                                onChange={(e) => setEditForm(f => ({
                                                    ...f,
                                                    description: e.target.value
                                                }))}
                                                placeholder="Nhập mô tả task (max 100 characters)..."
                                                autoFocus
                                                maxLength={100}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Is Done?</label>
                                            <select
                                                className="form-select"
                                                value={String(editForm.is_done)}
                                                onChange={(e) => setEditForm(f => ({
                                                    ...f,
                                                    is_done: Number(e.target.value)
                                                }))}
                                            >
                                                <option value="0">No</option>
                                                <option value="1">Yes</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-outline-secondary"
                                                onClick={() => setShowEdit(false)} disabled={saving}>
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-warning"
                                                disabled={saving || !editForm.description.trim()}>
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
