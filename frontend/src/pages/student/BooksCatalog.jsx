import React, { useState, useCallback } from "react";
import { booksAPI, borrowAPI } from "../../api";
import { useApi } from "../../hooks/useApi";
import { PageSpinner, Alert, Badge, EmptyState, Modal, Spinner } from "../../components/common/UI";
import { useAuth } from "../../context/AuthContext";

const GENRES = [
  "All",
  "Computer Science",
  "Information Technology",
  "Electrical Engineering",
  "Mathematics",
  "Fiction",
  "Programming",
  "Data Structures",
  "Algorithms",
  "Database",
  "Operating Systems",
  "Networking",
  "Computer Architecture",
  "Digital Electronics",
  "Electronics",
  "Civil Engineering",
  "Mechanical Engineering",
  "AI & ML",
  "Cyber Security",
  "Software Engineering",
];

const BookCard = ({ book, onBorrow, borrowing }) => {
  const avail = book.availableCopies > 0;
  return (
    <div className="card flex flex-col h-full hover:shadow-md transition-shadow duration-200">
      {/* Spine color strip */}
      <div className="h-1.5 -mx-6 -mt-6 mb-5 rounded-t-2xl bg-gradient-to-r from-primary-400 to-primary-600" />
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-16 rounded-lg bg-primary-50 flex items-center justify-center text-2xl flex-shrink-0">📗</div>
        <div className="min-w-0">
          <h3 className="font-display font-semibold text-ink text-sm leading-snug line-clamp-2">{book.title}</h3>
          <p className="text-gray-400 text-xs mt-1">{book.author}</p>
          <p className="text-gray-300 text-xs">{book.year}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap mb-3">
        {book.genre && <Badge label={book.genre} variant="default" />}
        <Badge label={avail ? "Available" : "Borrowed"} variant={avail ? "available" : "borrowed"} />
      </div>
      {book.description && (
        <p className="text-gray-400 text-xs line-clamp-3 flex-1 mb-4">{book.description}</p>
      )}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
        <span className="text-xs text-gray-400">{book.availableCopies}/{book.totalCopies} available</span>
        <button
          onClick={() => onBorrow(book)}
          disabled={!avail || borrowing === book._id}
          className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition ${
            avail
              ? "bg-primary-600 hover:bg-primary-700 text-white"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          {borrowing === book._id ? <Spinner size="sm" /> : avail ? "Request Borrow" : "Unavailable"}
        </button>
      </div>
    </div>
  );
};

const BooksCatalog = () => {
  const { user, isAdmin } = useAuth();
  const [search,  setSearch]  = useState("");
  const [genre,   setGenre]   = useState("All");
  const [page,    setPage]    = useState(1);
  const [confirm, setConfirm] = useState(null);   // book to confirm
  const [borrowing, setBorrowing] = useState(null);
  const [toast,   setToast]   = useState(null);

  const fetcher = useCallback(
    () => booksAPI.getAll({ search, genre: genre === "All" ? "" : genre, page, limit: 12 }),
    [search, genre, page]
  );
  const { data, loading, error, execute: refetch } = useApi(fetcher, [search, genre, page]);

  const books      = data?.books || [];
  const totalPages = data?.totalPages || 1;

  const handleBorrow = async () => {
    if (!confirm) return;
    setBorrowing(confirm._id);
    try {
      const studentId = user?.studentId || user?.id;
      if (!studentId) throw new Error("Student information is missing.");
      await borrowAPI.borrow(confirm._id, studentId);
      setToast({ type: "success", msg: `"${confirm.title}" borrowed successfully!` });
      refetch();
    } catch (e) {
      setToast({ type: "error", msg: e.response?.data?.message || e.message || "Could not borrow book." });
    } finally {
      setBorrowing(null);
      setConfirm(null);
    }
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="font-display font-bold text-ink text-2xl md:text-3xl">Book Catalog</h1>
        <p className="text-gray-400 text-sm mt-1">Browse and borrow from our collection</p>
      </div>

      {toast && (
        <div className="mb-5">
          <Alert type={toast.type} message={toast.msg} onClose={() => setToast(null)} />
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text" placeholder="Search by title, author, ISBN…"
            value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input-field pl-9"
          />
        </div>
        <select value={genre} onChange={(e) => { setGenre(e.target.value); setPage(1); }}
          className="input-field sm:w-52">
          {GENRES.map(g => <option key={g}>{g}</option>)}
        </select>
      </div>

      {loading ? <PageSpinner /> : error ? <Alert type="error" message={error} /> : (
        <>
          {books.length === 0 ? (
            <EmptyState icon="🔍" title="No books found" subtitle="Try adjusting your search or filter." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
              {books.map((b) => (
                <BookCard key={b._id} book={b} onBorrow={isAdmin ? () => {} : setConfirm} borrowing={borrowing} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="btn-secondary px-3 py-2 text-sm disabled:opacity-40">← Prev</button>
              <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
              <button disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="btn-secondary px-3 py-2 text-sm disabled:opacity-40">Next →</button>
            </div>
          )}
        </>
      )}

      {/* Confirm modal */}
      <Modal isOpen={!!confirm} onClose={() => setConfirm(null)} title="Confirm Borrow">
        <p className="text-gray-600 text-sm mb-1">You are about to borrow:</p>
        <p className="font-semibold text-ink mb-1">"{confirm?.title}"</p>
        <p className="text-gray-400 text-sm mb-5">by {confirm?.author}</p>
        <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2 mb-6">
          ⚠ Your borrow request will be sent to the admin for approval.
        </p>
        <div className="flex gap-3">
          <button onClick={() => setConfirm(null)} className="btn-secondary flex-1">Cancel</button>
          <button onClick={handleBorrow} disabled={!!borrowing} className="btn-primary flex-1 flex items-center justify-center gap-2">
            {borrowing ? <><Spinner size="sm" /> Requesting…</> : "Confirm Request"}
          </button>
        </div>
      </Modal>
    </>
  );
};

export default BooksCatalog;
