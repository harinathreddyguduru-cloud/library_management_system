import React, { useState, useCallback } from "react";
import { studentsAPI } from "../../api";
import { useApi } from "../../hooks/useApi";
import { PageSpinner, Alert, Badge, EmptyState, Modal, Spinner } from "../../components/common/UI";
import Shell from "../../components/layout/Shell";

const Students = () => {
  const [search,  setSearch]  = useState("");
  const [page,    setPage]    = useState(1);
  const [viewing, setViewing] = useState(null);
  const [delCon,  setDelCon]  = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast,   setToast]   = useState(null);

  const fetcher = useCallback(
    () => studentsAPI.getAll({ search, page, limit: 15 }),
    [search, page]
  );
  const { data, loading, error, execute: refetch } = useApi(fetcher, [search, page]);

  const students   = Array.isArray(data) ? data : data?.students || [];
  const totalPages = Array.isArray(data) ? 1 : data?.totalPages || 1;

  const handleDelete = async () => {
    if (!delCon) return;
    setDeleting(true);
    try {
      await studentsAPI.delete(delCon._id);
      setToast({ type: "success", msg: "Student removed." });
      refetch();
    } catch (e) {
      setToast({ type: "error", msg: e.response?.data?.message || "Delete failed." });
    } finally { setDeleting(false); setDelCon(null); }
  };

  return (
    <Shell>
      <div className="mb-6">
        <h1 className="font-display font-bold text-ink text-2xl md:text-3xl">Students</h1>
        <p className="text-gray-400 text-sm mt-1">Manage registered student accounts</p>
      </div>

      {toast && <div className="mb-5"><Alert type={toast.type} message={toast.msg} onClose={() => setToast(null)} /></div>}

      <div className="relative mb-6 max-w-sm">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        <input type="text" placeholder="Search students…" value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="input-field pl-9" />
      </div>

      {loading ? <PageSpinner /> : error ? <Alert type="error" message={error} /> : (
        students.length === 0 ? (
          <EmptyState icon="👥" title="No students found" subtitle="Students who register will appear here." />
        ) : (
          <>
            <div className="card !p-0 overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {["Student", "Student ID", "Department", "Email", "Active Borrows", "Role", "Actions"].map(h => (
                        <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {students.map((s) => (
                      <tr key={s._id} className="hover:bg-gray-50 transition">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-bold text-sm flex items-center justify-center flex-shrink-0">
                              {s.name?.[0]?.toUpperCase() || "?"}
                            </div>
                            <span className="font-medium text-ink">{s.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-gray-400 text-xs font-mono">{s.studentId || "—"}</td>
                        <td className="px-5 py-3.5 text-gray-500">{s.department || "—"}</td>
                        <td className="px-5 py-3.5 text-gray-400 text-xs">{s.email}</td>
                        <td className="px-5 py-3.5 text-center">
                          <span className={`font-semibold ${(s.activeBorrows || 0) > 0 ? "text-amber-600" : "text-gray-400"}`}>
                            {s.activeBorrows || 0}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <Badge label={s.role || "student"} variant={s.role === "admin" ? "admin" : "student"} />
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <button onClick={() => setViewing(s)}
                              className="text-xs px-2.5 py-1 rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 font-medium transition">View</button>
                            <button onClick={() => setDelCon(s)}
                              className="text-xs px-2.5 py-1 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 font-medium transition">Remove</button>
                          </div>
                        </td>
                      </tr>
                    ))}
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

      {/* View student modal */}
      <Modal isOpen={!!viewing} onClose={() => setViewing(null)} title="Student Details">
        {viewing && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary-100 text-primary-700 font-display font-bold text-2xl flex items-center justify-center">
                {viewing.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-display font-bold text-ink text-lg">{viewing.name}</p>
                <Badge label={viewing.role || "student"} variant={viewing.role === "admin" ? "admin" : "student"} />
              </div>
            </div>
            {[
              ["Email",      viewing.email],
              ["Student ID", viewing.studentId || "—"],
              ["Department", viewing.department || "—"],
              ["Active Borrows", viewing.activeBorrows || 0],
              ["Joined", viewing.createdAt ? new Date(viewing.createdAt).toLocaleDateString("en-IN") : "—"],
            ].map(([label, val]) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-sm text-gray-400">{label}</span>
                <span className="text-sm font-medium text-ink">{val}</span>
              </div>
            ))}
            <button onClick={() => setViewing(null)} className="btn-secondary w-full mt-2">Close</button>
          </div>
        )}
      </Modal>

      {/* Delete confirm */}
      <Modal isOpen={!!delCon} onClose={() => setDelCon(null)} title="Remove Student">
        <p className="text-gray-600 text-sm mb-1">Remove this student account?</p>
        <p className="font-semibold text-ink mb-5">{delCon?.name} ({delCon?.email})</p>
        <Alert type="error" message="This will remove all associated data and cannot be undone." />
        <div className="flex gap-3 mt-5">
          <button onClick={() => setDelCon(null)} className="btn-secondary flex-1">Cancel</button>
          <button onClick={handleDelete} disabled={deleting} className="btn-danger flex-1 flex items-center justify-center gap-2">
            {deleting ? <><Spinner size="sm" /> Removing…</> : "Remove Student"}
          </button>
        </div>
      </Modal>
    </Shell>
  );
};

export default Students;
