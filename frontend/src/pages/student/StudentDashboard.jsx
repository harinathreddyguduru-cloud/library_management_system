import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { borrowAPI, booksAPI } from "../../api";
import { useApi } from "../../hooks/useApi";
import { StatCard, PageSpinner, Alert, Badge } from "../../components/common/UI";
import Shell from "../../components/layout/Shell";

const greet = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const StudentDashboard = () => {
  const { user } = useAuth();
  const studentId = user?.studentId || user?.id;
  const { data: borrows, loading: bLoading, error: bError } = useApi(
    () => borrowAPI.myBorrows(studentId),
    [studentId],
    !!studentId
  );
  const { data: booksData, loading: cLoading } = useApi(booksAPI.getAll, [], true);

  const active  = borrows?.filter((b) => b.status === "borrowed")  || [];
  const overdue = borrows?.filter((b) => b.status === "overdue")   || [];
  const history = borrows?.filter((b) => b.status === "returned")  || [];

  const dueSoon = active.filter((b) => {
    const days = Math.ceil((new Date(b.dueDate) - Date.now()) / 86400000);
    return days <= 3 && days >= 0;
  });

  return (
    <Shell>
      {/* Header */}
      <div className="mb-7">
        <h1 className="font-display font-bold text-ink text-2xl md:text-3xl">
          {greet()}, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-gray-400 mt-1 text-sm">
          {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Stats */}
      {bLoading ? <PageSpinner /> : (
        <>
          {bError && <Alert type="error" message={bError} className="mb-6" />}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon="📖" label="Currently Borrowed" value={active.length}  color="primary" />
            <StatCard icon="⚠️" label="Overdue"            value={overdue.length} color="red"     />
            <StatCard icon="✅" label="Returned"           value={history.length} color="green"   />
            <StatCard icon="📚" label="Total Books"        value={booksData?.total ?? "—"} color="amber" />
          </div>

          {/* Due-soon alerts */}
          {dueSoon.length > 0 && (
            <div className="mb-6 space-y-2">
              {dueSoon.map((b) => {
                const days = Math.ceil((new Date(b.dueDate) - Date.now()) / 86400000);
                return (
                  <Alert
                    key={b._id}
                    type="warning"
                    message={`"${b.book?.title}" is due in ${days} day${days !== 1 ? "s" : ""} — return it on time to avoid fines.`}
                  />
                );
              })}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Currently borrowed */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-semibold text-ink">Currently Borrowed</h2>
                <Link to="/my-books" className="text-xs text-primary-600 hover:underline font-medium">View all →</Link>
              </div>
              {active.length === 0 ? (
                <p className="text-gray-400 text-sm py-6 text-center">No active borrows</p>
              ) : (
                <ul className="space-y-3">
                  {active.slice(0, 4).map((b) => {
                    const due  = new Date(b.dueDate);
                    const days = Math.ceil((due - Date.now()) / 86400000);
                    const isOd = days < 0;
                    return (
                      <li key={b._id} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                        <div className="w-9 h-12 rounded-lg bg-primary-50 flex items-center justify-center text-lg flex-shrink-0">📕</div>
                        <div className="min-w-0">
                          <p className="font-medium text-ink text-sm truncate">{b.book?.title}</p>
                          <p className="text-gray-400 text-xs mt-0.5">{b.book?.author}</p>
                          <p className={`text-xs mt-1 font-medium ${isOd ? "text-red-500" : days <= 3 ? "text-amber-500" : "text-gray-400"}`}>
                            {isOd ? `Overdue by ${Math.abs(days)} day(s)` : `Due in ${days} day(s)`}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Quick actions */}
            <div className="card">
              <h2 className="font-display font-semibold text-ink mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link to="/books" className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50 transition group">
                  <span className="text-2xl">🔍</span>
                  <div>
                    <p className="font-semibold text-ink text-sm group-hover:text-primary-700 transition">Browse Catalog</p>
                    <p className="text-xs text-gray-400">Search and borrow books</p>
                  </div>
                  <span className="ml-auto text-gray-300 group-hover:text-primary-400 transition">→</span>
                </Link>
                <Link to="/my-books" className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50 transition group">
                  <span className="text-2xl">📋</span>
                  <div>
                    <p className="font-semibold text-ink text-sm group-hover:text-primary-700 transition">My Borrowed Books</p>
                    <p className="text-xs text-gray-400">View & return borrowed books</p>
                  </div>
                  <span className="ml-auto text-gray-300 group-hover:text-primary-400 transition">→</span>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </Shell>
  );
};

export default StudentDashboard;
