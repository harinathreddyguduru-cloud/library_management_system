import React, { useState } from "react";
import { borrowAPI } from "../../api";
import { useApi } from "../../hooks/useApi";
import { PageSpinner, Alert, Badge, EmptyState, Modal, Spinner } from "../../components/common/UI";
import Shell from "../../components/layout/Shell";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const statusVariant = { borrowed: "borrowed", overdue: "overdue", returned: "returned" };

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

  const handleReturn = async () => {
    if (!confirm) return;
    setReturning(confirm._id);
    try {
      await borrowAPI.return(confirm._id);
      setToast({ type: "success", msg: `"${confirm.book?.title}" returned successfully!` });
      refetch();
    } catch (e) {
      setToast({ type: "error", msg: e.response?.data?.message || "Return failed." });
    } finally {
      setReturning(null); setConfirm(null);
    }
  };

  const daysLabel = (b) => {
    const days = Math.ceil((new Date(b.dueDate) - Date.now()) / 86400000);
    if (b.status === "returned") return null;
    if (days < 0) return { text: `Overdue by ${Math.abs(days)} day(s)`, cls: "text-red-500" };
    if (days === 0) return { text: "Due today!", cls: "text-amber-500" };
    return { text: `Due in ${days} day(s)`, cls: days <= 3 ? "text-amber-500" : "text-gray-400" };
  };

  return (
    <Shell>
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
                        <span>{new Date(b.dueDate).toLocaleDateString("en-IN")}</span>
                        {due && <p className={`text-xs mt-0.5 ${due.cls}`}>{due.text}</p>}
                      </td>
                      <td className="px-5 py-4">
                        <Badge label={b.status} variant={statusVariant[b.status] || "default"} />
                      </td>
                      <td className="px-5 py-4">
                        {b.status !== "returned" && (
                          <button onClick={() => setConfirm(b)}
                            className="text-xs px-3 py-1.5 rounded-lg font-semibold bg-green-50 text-green-700 hover:bg-green-100 transition">
                            Return
                          </button>
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

      <Modal isOpen={!!confirm} onClose={() => setConfirm(null)} title="Return Book">
        <p className="text-gray-600 text-sm mb-1">Returning:</p>
        <p className="font-semibold text-ink mb-5">"{confirm?.book?.title}"</p>
        <div className="flex gap-3">
          <button onClick={() => setConfirm(null)} className="btn-secondary flex-1">Cancel</button>
          <button onClick={handleReturn} disabled={!!returning} className="btn-primary flex-1 flex items-center justify-center gap-2">
            {returning ? <><Spinner size="sm" /> Returning…</> : "Confirm Return"}
          </button>
        </div>
      </Modal>
    </Shell>
  );
};

export default MyBorrows;
