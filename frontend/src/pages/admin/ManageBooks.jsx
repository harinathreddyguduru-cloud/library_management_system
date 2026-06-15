import React, { useState, useCallback } from "react";
import { booksAPI } from "../../api";
import { useApi } from "../../hooks/useApi";
import { PageSpinner, Alert, Badge, EmptyState, Modal, Spinner } from "../../components/common/UI";
import Shell from "../../components/layout/Shell";

const EMPTY_FORM = {
  title: "", author: "", isbn: "", publisher: "", category_id: "", shelf_location: "",
  total_count: 1, available_count: 1, description: "",
};

const BookFormModal = ({ isOpen, onClose, initial, onSave }) => {
  const [form,   setForm]   = useState(initial || EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [err,    setErr]    = useState("");

  React.useEffect(() => { setForm(initial || EMPTY_FORM); setErr(""); }, [initial, isOpen]);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setErr("");
    try {
      await onSave(form);
      onClose();
    } catch (ex) {
      setErr(ex.response?.data?.message || "Save failed.");
    } finally { setSaving(false); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initial?._id ? "Edit Book" : "Add New Book"}>
      {err && <Alert type="error" message={err} className="mb-4" />}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Title *</label>
            <input type="text" name="title" required value={form.title} onChange={handleChange} className="input-field" placeholder="Book title" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Author *</label>
            <input type="text" name="author" required value={form.author} onChange={handleChange} className="input-field" placeholder="Author name" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">ISBN</label>
            <input type="text" name="isbn" value={form.isbn} onChange={handleChange} className="input-field" placeholder="ISBN number" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Publisher</label>
            <input type="text" name="publisher" value={form.publisher} onChange={handleChange} className="input-field" placeholder="Publisher name" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Shelf location</label>
            <input type="text" name="shelf_location" value={form.shelf_location} onChange={handleChange} className="input-field" placeholder="Shelf location" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Total Copies *</label>
            <input type="number" name="total_count" required min="1" value={form.total_count} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Available Copies *</label>
            <input type="number" name="available_count" required min="0" value={form.available_count} onChange={handleChange} className="input-field" />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3}
              className="input-field resize-none" placeholder="Brief description…" />
          </div>
        </div>
        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
            {saving ? <><Spinner size="sm" /> Saving…</> : (initial?._id ? "Update Book" : "Add Book")}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const ManageBooks = () => {
  const [search,  setSearch]  = useState("");
  const [page,    setPage]    = useState(1);
  const [editing, setEditing] = useState(null);
  const [delCon,  setDelCon]  = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast,   setToast]   = useState(null);

  const fetcher = useCallback(
    () => booksAPI.getAll({ search, page, limit: 10 }),
    [search, page]
  );
  const { data, loading, error, execute: refetch } = useApi(fetcher, [search, page]);

  const books      = data?.books      || [];
  const totalPages = data?.totalPages || 1;

  const handleSave = async (form) => {
    if (editing?._id) {
      await booksAPI.update(editing._id, form);
      setToast({ type: "success", msg: "Book updated!" });
    } else {
      await booksAPI.create(form);
      setToast({ type: "success", msg: "Book added!" });
    }
    refetch();
  };

  const handleDelete = async () => {
    if (!delCon) return;
    setDeleting(true);
    try {
      await booksAPI.delete(delCon._id);
      setToast({ type: "success", msg: "Book deleted." });
      refetch();
    } catch (e) {
      setToast({ type: "error", msg: e.response?.data?.message || "Delete failed." });
    } finally { setDeleting(false); setDelCon(null); }
  };

  return (
    <Shell>
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="font-display font-bold text-ink text-2xl md:text-3xl">Manage Books</h1>
          <p className="text-gray-400 text-sm mt-1">Add, edit or remove books in the catalog</p>
        </div>
        <button onClick={() => setEditing({})} className="btn-primary whitespace-nowrap text-sm">+ Add Book</button>
      </div>

      {toast && <div className="mb-5"><Alert type={toast.type} message={toast.msg} onClose={() => setToast(null)} /></div>}

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        <input type="text" placeholder="Search books…" value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="input-field pl-9" />
      </div>

      {loading ? <PageSpinner /> : error ? <Alert type="error" message={error} /> : (
        books.length === 0 ? (
          <EmptyState icon="📚" title="No books found" subtitle="Add the first book to the catalog."
            action={<button onClick={() => setEditing({})} className="btn-primary text-sm">Add Book</button>} />
        ) : (
          <>
            <div className="card !p-0 overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {["Title", "Author", "Genre", "Year", "Copies", "Status", "Actions"].map(h => (
                        <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {books.map((b) => (
                      <tr key={b._id} className="hover:bg-gray-50 transition">
                        <td className="px-5 py-3.5 font-medium text-ink max-w-[200px] truncate">{b.title}</td>
                        <td className="px-5 py-3.5 text-gray-500">{b.author}</td>
                        <td className="px-5 py-3.5"><Badge label={b.genre || "—"} /></td>
                        <td className="px-5 py-3.5 text-gray-400">{b.year || "—"}</td>
                        <td className="px-5 py-3.5 text-gray-500">{b.availableCopies}/{b.totalCopies}</td>
                        <td className="px-5 py-3.5">
                          <Badge label={b.availableCopies > 0 ? "Available" : "Borrowed"}
                            variant={b.availableCopies > 0 ? "available" : "borrowed"} />
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <button onClick={() => setEditing(b)}
                              className="text-xs px-2.5 py-1 rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 font-medium transition">Edit</button>
                            <button onClick={() => setDelCon(b)}
                              className="text-xs px-2.5 py-1 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 font-medium transition">Delete</button>
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

      {/* Edit / Add modal */}
      <BookFormModal isOpen={editing !== null} onClose={() => setEditing(null)} initial={editing} onSave={handleSave} />

      {/* Delete confirm */}
      <Modal isOpen={!!delCon} onClose={() => setDelCon(null)} title="Delete Book">
        <p className="text-gray-600 text-sm mb-1">Are you sure you want to delete:</p>
        <p className="font-semibold text-ink mb-5">"{delCon?.title}"?</p>
        <Alert type="error" message="This action cannot be undone." />
        <div className="flex gap-3 mt-5">
          <button onClick={() => setDelCon(null)} className="btn-secondary flex-1">Cancel</button>
          <button onClick={handleDelete} disabled={deleting} className="btn-danger flex-1 flex items-center justify-center gap-2">
            {deleting ? <><Spinner size="sm" /> Deleting…</> : "Delete Book"}
          </button>
        </div>
      </Modal>
    </Shell>
  );
};

export default ManageBooks;
