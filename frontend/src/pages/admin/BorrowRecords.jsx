import React, { useState, useCallback } from "react";
import { borrowAPI } from "../../api";
import { useApi } from "../../hooks/useApi";
import { PageSpinner, Alert, Badge, EmptyState, Modal, Spinner } from "../../components/common/UI";
import Shell from "../../components/layout/Shell";

const FILTERS = ["all", "borrowed", "returned", "overdue"];

const BorrowRecords = () => {
  const [filter,   setFilter]   = useState("all");
  const [search,   setSearch]   = useState("");
  const [page,     setPage]     = useState(1);
  const [confirm,  setConfirm]  = useState(null);
  const [returning, setReturning] = useState(null);
  const [toast,    setToast]    = useState(null);

  const fetcher = useCallback(
    () => borrowAPI.allBorrows({ status: filter === "all" ? "" : filter, search, page, limit: 15 }),
    [filter, search, page]
  );
  const { data, loading, error, execute: refetch } = useApi(fetcher, [filter, search, page]);

  const records    = data?.borrows    || [];
  const totalPages = data?.totalPages || 1;

  const handleReturn = async () => {
    if (!confirm) return;
    setReturning(confirm._id);
    try {
      await borrowAPI.return(confirm._id);
      setToast({ type: "success", msg: "Book marked as returned." });
      refetch();
    } catch (e) {
      setToast({ type: "error", msg: e.response?.data?.message || "Failed." });
    } finally { setReturning(null); setConfirm(null); }
  };

  return (
    <Shell>
      <div className="mb-6">
        <h1 className="font-display font-bold text-ink text-2xl md:text-3xl">Borrow Records</h1>
        <p className="text-gray-400 text-sm mt-1">All borrowing activity across the library</p>
      </div>

      {toast && <div className="mb-5"><Alert type={toast.type} message={toast.msg} onClose={() => setToast(null)} /></div>}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input type="text" placeholder="Search student or book…" value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input-field pl-9" />
        </div>
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          {FILTERS.map(f => (
            <button key={f} onClick={() => { setFilter(f); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                filter === f ? "bg-white text-primary-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? <PageSpinner /> : error ? <Alert type="error" message={error} /> : (
        records.length === 0 ? (
          <EmptyState icon="📋" title="No records found" subtitle="Try adjusting your filters." />
        ) : (
          <>
            <div className="card !p-0 overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {["Student", "Student ID", "Book", "Borrowed On", "Due Date", "Status", "Action"].map(h => (
                        <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {records.map((b) => {
                      const days = Math.ceil((new Date(b.dueDate) - Date.now()) / 86400000);
                      return (
                        <tr key={b._id} className="hover:bg-gray-50 transition">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                                {b.student?.name?.[0] || "?"}
                              </div>
                              <span className="font-medium text-ink">{b.student?.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-gray-400 text-xs">{b.student?.studentId || "—"}</td>
                          <td className="px-5 py-3.5 text-gray-600 max-w-[160px] truncate">{b.book?.title}</td>
                          <td className="px-5 py-3.5 text-gray-400">{new Date(b.borrowedAt).toLocaleDateString("en-IN")}</td>
                          <td className="px-5 py-3.5">
                            <span className="text-gray-500">{new Date(b.dueDate).toLocaleDateString("en-IN")}</span>
                            {b.status !== "returned" && days < 0 && (
                              <p className="text-xs text-red-500 mt-0.5">Overdue</p>
                            )}
                          </td>
                          <td className="px-5 py-3.5">
                            <Badge label={b.status}
                              variant={b.status === "overdue" ? "overdue" : b.status === "returned" ? "returned" : "borrowed"} />
                          </td>
                          <td className="px-5 py-3.5">
                            {b.status !== "returned" && (
                              <button onClick={() => setConfirm(b)}
                                className="text-xs px-2.5 py-1 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 font-medium transition">
                                Mark Returned
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-secondary px-3 py-2 text-sm disabled:opacity-40">← Prev</button>
                <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="btn-secondary px-3 py-2 text-sm disabled:opacity-40">Next →</button>
              </div>
            )}
          </>
        )
      )}

      <Modal isOpen={!!confirm} onClose={() => setConfirm(null)} title="Mark as Returned">
        <p className="text-gray-600 text-sm mb-1">Mark this borrow as returned?</p>
        <p className="font-semibold text-ink">{confirm?.student?.name}</p>
        <p className="text-gray-400 text-sm mb-5">"{confirm?.book?.title}"</p>
        <div className="flex gap-3">
          <button onClick={() => setConfirm(null)} className="btn-secondary flex-1">Cancel</button>
          <button onClick={handleReturn} disabled={!!returning} className="btn-primary flex-1 flex items-center justify-center gap-2">
            {returning ? <><Spinner size="sm" /> Processing…</> : "Confirm Return"}
          </button>
        </div>
      </Modal>
    </Shell>
  );
};

export default BorrowRecords;
