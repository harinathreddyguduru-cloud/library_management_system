import React, { useState } from "react";
import { borrowAPI } from "../../api";
import { useApi } from "../../hooks/useApi";
import { PageSpinner, Alert, Badge, EmptyState, Modal, Spinner } from "../../components/common/UI";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const statusVariant = {
  borrowed: "borrowed",
  overdue: "overdue",
  returned: "returned",
  requested: "requested",
  "return requested": "return requested",
};

const MyBorrows = () => {
  const { user } = useAuth();
  const studentId = user?.studentId || user?.id;
  const { data: borrows, loading, error, execute: refetch } = useApi(
    () => borrowAPI.myBorrows(studentId),
    [studentId],
    !!studentId
  );
  const [tab,      setTab]      = useState("active");
  const [confirm,  setConfirm]  = useState(null);
  const [returning, setReturning] = useState(null);
  const [toast,    setToast]    = useState(null);

  const active   = (borrows || []).filter(b => b.status !== "returned");
  const history  = (borrows || []).filter(b => b.status === "returned");
  const displayed = tab === "active" ? active : history;
  const totalFine = (borrows || []).reduce((sum, b) => sum + (parseFloat(b.fineAmount) || 0), 0);

  const handleReturn = async () => {
    if (!confirm) return;
    setReturning(confirm._id);
    try {
      await borrowAPI.requestReturn(confirm._id);
      setToast({ type: "success", msg: `Return request for "${confirm.book?.title}" has been submitted.` });
      refetch();
    } catch (e) {
      setToast({ type: "error", msg: e.response?.data?.message || "Return request failed." });
    } finally {
      setReturning(null); setConfirm(null);
    }
  };

  const daysLabel = (b) => {
    if (b.status === "returned") return null;
    if (b.status === "requested") return { text: "Awaiting approval", cls: "text-gray-400" };
    if (b.status === "return requested") return { text: "Awaiting return approval", cls: "text-amber-500" };

    const due = b.dueDate ? new Date(b.dueDate) : null;
    if (!due) return null;

    const days = Math.ceil((due - Date.now()) / 86400000);
    if (days < 0) return { text: `Overdue by ${Math.abs(days)} day(s)`, cls: "text-red-500" };
    if (days === 0) return { text: "Due today!", cls: "text-amber-500" };
    return { text: `Due in ${days} day(s)`, cls: days <= 3 ? "text-amber-500" : "text-gray-400" };
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="font-display font-bold text-ink text-2xl md:text-3xl">My Borrowed Books</h1>
        <p className="text-gray-400 text-sm mt-1">Track and return your borrowed books</p>
      </div>

      {toast && (
        <div className="mb-5">
          <Alert type={toast.type} message={toast.msg} onClose={() => setToast(null)} />
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-6">
        {[["active", "Active"], ["history", "History"]].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition ${
              tab === key ? "bg-white text-primary-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}>
            {label}
            <span className={`ml-2 text-xs rounded-full px-1.5 py-0.5 ${
              tab === key ? "bg-primary-100 text-primary-600" : "bg-gray-200 text-gray-500"
            }`}>
              {key === "active" ? active.length : history.length}
            </span>
          </button>
        ))}
      </div>

      {loading ? <PageSpinner /> : error ? <Alert type="error" message={error} /> : (
        displayed.length === 0 ? (
          <EmptyState
            icon={tab === "active" ? "📭" : "📚"}
            title={tab === "active" ? "No active borrows" : "No borrowing history"}
            subtitle={tab === "active" ? "Head to the catalog to borrow a book." : "Books you return will appear here."}
            action={tab === "active" ? (
              <Link to="/books" className="btn-primary text-sm">Browse Catalog</Link>
            ) : null}
          />
        ) : (
          <div className="card overflow-hidden !p-0">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Book", "Author", "Borrowed On", "Due Date", "Status", "Action"].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {displayed.map((b) => {
                  const due = daysLabel(b);
                  return (
                    <tr key={b._id} className="hover:bg-gray-50 transition">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">📕</span>
                          <span className="font-medium text-ink">{b.book?.title}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-500">{b.book?.author}</td>
                      <td className="px-5 py-4 text-gray-400">
                        {new Date(b.borrowedAt).toLocaleDateString("en-IN")}
                      </td>
                      <td className="px-5 py-4">
                        <span>{b.dueDate ? new Date(b.dueDate).toLocaleDateString("en-IN") : "—"}</span>
                        {due && <p className={`text-xs mt-0.5 ${due.cls}`}>{due.text}</p>}
                        {b.fineAmount > 0 && (
                          <p className="text-xs mt-1 text-red-500">Fine ₹{parseFloat(b.fineAmount).toFixed(2)}</p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <Badge label={b.status} variant={statusVariant[b.status] || "default"} />
                      </td>
                      <td className="px-5 py-4">
                        {(b.status === "issued" || b.status === "overdue") && (
                          <button onClick={() => setConfirm(b)}
                            className="text-xs px-3 py-1.5 rounded-lg font-semibold bg-green-50 text-green-700 hover:bg-green-100 transition">
                            Request Return
                          </button>
                        )}
                        {b.status === "requested" && (
                          <span className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-500">Pending approval</span>
                        )}
                        {b.status === "return requested" && (
                          <span className="text-xs px-3 py-1.5 rounded-lg bg-amber-100 text-amber-700">Return pending</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )
      )}

      <Modal isOpen={!!confirm} onClose={() => setConfirm(null)} title="Request Return">
        <p className="text-gray-600 text-sm mb-1">Request return for:</p>
        <p className="font-semibold text-ink mb-5">"{confirm?.book?.title}"</p>
        <div className="flex gap-3">
          <button onClick={() => setConfirm(null)} className="btn-secondary flex-1">Cancel</button>
          <button onClick={handleReturn} disabled={!!returning} className="btn-primary flex-1 flex items-center justify-center gap-2">
            {returning ? <><Spinner size="sm" /> Requesting…</> : "Confirm Request"}
          </button>
        </div>
      </Modal>
    </>
  );
};

export default MyBorrows;
