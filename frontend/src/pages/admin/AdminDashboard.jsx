import React from "react";
import { statsAPI, booksAPI, borrowAPI } from "../../api";
import { useApi } from "../../hooks/useApi";
import { StatCard, PageSpinner, Alert, Badge } from "../../components/common/UI";
import Shell from "../../components/layout/Shell";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const { data: stats, loading, error } = useApi(statsAPI.dashboard);
  const { data: recentBorrows }         = useApi(borrowAPI.allBorrows, [], true);
  const { data: booksData }             = useApi(() => booksAPI.getAll({ limit: 5 }), [], true);

  const recentBooks = booksData?.books || [];
  const borrows     = recentBorrows?.borrows || [];

  return (
    <Shell>
      <div className="mb-7">
        <h1 className="font-display font-bold text-ink text-2xl md:text-3xl">Admin Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Library management overview</p>
      </div>

      {loading ? <PageSpinner /> : error ? <Alert type="error" message={error} /> : (
        <>
          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon="📚" label="Total Books"     value={stats?.totalBooks}      color="primary" sub={`${stats?.availableBooks || 0} available`} />
            <StatCard icon="👥" label="Students"        value={stats?.totalStudents}   color="green"  />
            <StatCard icon="📖" label="Issued Books"    value={stats?.issuedBooks}    color="amber"  />
            <StatCard icon="⚠️" label="Available"      value={stats?.availableBooks} color="blue"   />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Recent borrows */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-semibold text-ink">Recent Borrows</h2>
                <Link to="/admin/borrows" className="text-xs text-primary-600 hover:underline font-medium">View all →</Link>
              </div>
              {borrows.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">No borrow records yet</p>
              ) : (
                <ul className="space-y-3">
                  {borrows.slice(0, 5).map((b) => (
                    <li key={b._id} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-bold text-xs flex items-center justify-center flex-shrink-0">
                        {b.student?.name?.[0] || "?"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-ink truncate">{b.student?.name}</p>
                        <p className="text-xs text-gray-400 truncate">"{b.book?.title}"</p>
                      </div>
                      <Badge label={b.status} variant={b.status === "overdue" ? "overdue" : b.status === "returned" ? "returned" : "borrowed"} />
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Quick admin actions */}
            <div className="card">
              <h2 className="font-display font-semibold text-ink mb-4">Manage</h2>
              <div className="space-y-3">
                {[
                  { to: "/admin/books",    icon: "📚", label: "Manage Books",      sub: "Add, edit, or remove books" },
                  { to: "/admin/borrows",  icon: "📋", label: "Borrow Records",    sub: "View all borrowing activity" },
                  { to: "/admin/students", icon: "👥", label: "Student Accounts",  sub: "View and manage students" },
                ].map(({ to, icon, label, sub }) => (
                  <Link key={to} to={to}
                    className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50 transition group">
                    <span className="text-xl">{icon}</span>
                    <div>
                      <p className="font-semibold text-ink text-sm group-hover:text-primary-700 transition">{label}</p>
                      <p className="text-xs text-gray-400">{sub}</p>
                    </div>
                    <span className="ml-auto text-gray-300 group-hover:text-primary-400">→</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Recent books added */}
          {recentBooks.length > 0 && (
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-semibold text-ink">Recent Books Added</h2>
                <Link to="/admin/books" className="text-xs text-primary-600 hover:underline font-medium">Manage →</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                      <th className="pb-3 font-semibold">Title</th>
                      <th className="pb-3 font-semibold">Author</th>
                      <th className="pb-3 font-semibold">Genre</th>
                      <th className="pb-3 font-semibold">Copies</th>
                      <th className="pb-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {recentBooks.map((b) => (
                      <tr key={b._id} className="hover:bg-gray-50 transition">
                        <td className="py-3 font-medium text-ink">{b.title}</td>
                        <td className="py-3 text-gray-500">{b.author}</td>
                        <td className="py-3"><Badge label={b.genre || "N/A"} /></td>
                        <td className="py-3 text-gray-500">{b.availableCopies}/{b.totalCopies}</td>
                        <td className="py-3">
                          <Badge label={b.availableCopies > 0 ? "Available" : "Borrowed"}
                            variant={b.availableCopies > 0 ? "available" : "borrowed"} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </Shell>
  );
};

export default AdminDashboard;
