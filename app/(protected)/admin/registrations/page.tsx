"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  RefreshCw,
  Mail,
  Phone,
  BookOpen,
  Calendar,
  Trash2,
  Edit,
  ShieldCheck,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useAuth } from "@/context/authContext";
import {
  getAllRegistrations,
  updateRegistration,
  deleteRegistration,
} from "@/lib/api/registration";
import { Registration, UpdateRegistrationInput } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function AdminRegistrationsPage() {
  const { user, isAdmin, isLoading: isAuthLoading } = useAuth();

  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  // Edit modal state
  const [editingItem, setEditingItem] = useState<Registration | null>(null);
  const [editForm, setEditForm] = useState<UpdateRegistrationInput>({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Delete modal state
  const [deletingItem, setDeletingItem] = useState<Registration | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Success toast / notification banner
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllRegistrations();
      setRegistrations(data);
    } catch (err: any) {
      setError(err.message || "Failed to load registrations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchRegistrations();
    }
  }, [isAdmin]);

  // Filtered and sorted registrations based on search query & created_at sortOrder
  const filteredRegistrations = useMemo(() => {
    let result = [...registrations];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.full_name?.toLowerCase().includes(q) ||
          item.email?.toLowerCase().includes(q) ||
          item.phone?.toLowerCase().includes(q) ||
          item.course?.toLowerCase().includes(q) ||
          (item.message && item.message.toLowerCase().includes(q)),
      );
    }

    return result.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });
  }, [registrations, searchQuery, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  // Quick stats
  const uniqueCoursesCount = useMemo(() => {
    const set = new Set(registrations.map((r) => r.course?.trim().toLowerCase()));
    return set.size;
  }, [registrations]);

  // Open Edit Dialog
  const handleOpenEdit = (item: Registration) => {
    setEditingItem(item);
    setEditForm({
      full_name: item.full_name,
      email: item.email,
      phone: item.phone,
      course: item.course,
      message: item.message || "",
    });
    setEditError(null);
  };

  // Submit Edit
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      setIsUpdating(true);
      setEditError(null);

      const updated = await updateRegistration(editingItem.id, editForm);

      setRegistrations((prev) =>
        prev.map((r) => (r.id === updated.id ? updated : r)),
      );

      setEditingItem(null);
      setFeedback({
        type: "success",
        message: `Successfully updated registration for ${updated.full_name}`,
      });
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      setEditError(err.message || "Failed to update registration");
    } finally {
      setIsUpdating(false);
    }
  };

  // Submit Delete
  const handleConfirmDelete = async () => {
    if (!deletingItem) return;

    try {
      setIsDeleting(true);
      setDeleteError(null);

      await deleteRegistration(deletingItem.id);

      setRegistrations((prev) => prev.filter((r) => r.id !== deletingItem.id));

      const deletedName = deletingItem.full_name;
      setDeletingItem(null);
      setFeedback({
        type: "success",
        message: `Registration for ${deletedName} has been deleted.`,
      });
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      setDeleteError(err.message || "Failed to delete registration");
    } finally {
      setIsDeleting(false);
    }
  };

  // Format date helper
  const formatDate = (iso: string) => {
    try {
      const date = new Date(iso);
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch {
      return iso;
    }
  };

  if (isAuthLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  // Access Control: Strictly Admin Only
  if (!isAdmin) {
    return (
      <div className="max-w-3xl mx-auto py-12">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900/50 dark:bg-red-950/20">
          <ShieldCheck className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-red-900 dark:text-red-200">
            Access Denied
          </h2>
          <p className="mt-2 text-sm text-red-700 dark:text-red-300">
            Only administrators with full privileges can view, modify, or delete
            registration submissions.
          </p>
          <Button asChild variant="outline" className="mt-6">
            <Link href="/admin" className="inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Admin Portal
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-9 px-2.5 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white"
          >
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Admin Portal
            </Link>
          </Button>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Registration Management
          </h1>
        </div>

        <Button
          onClick={fetchRegistrations}
          variant="outline"
          size="sm"
          disabled={loading}
          className="h-9 rounded-xl border-slate-200 dark:border-slate-800 text-xs font-semibold self-start sm:self-auto"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Refresh Data
        </Button>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div
          className={`p-4 rounded-xl border text-xs font-semibold flex items-center gap-2.5 transition-all ${feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-900 dark:text-emerald-300"
              : "bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300"
            }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="h-11 w-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Total Registrations
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {registrations.length}
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="h-11 w-11 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Programs Inquired
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {uniqueCoursesCount}
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="h-11 w-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Latest Submission
            </p>
            <p className="text-xs font-semibold text-slate-900 dark:text-slate-200 mt-1 truncate">
              {registrations.length > 0
                ? formatDate(registrations[0].created_at)
                : "No submissions yet"}
            </p>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        {/* Search Bar & Controls */}
        <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 flex-1 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by student name, email, phone, or course..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 rounded-xl text-xs border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            {/* Sort Toggle Button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={toggleSortOrder}
              className="h-10 rounded-xl border-slate-200 dark:border-slate-800 text-xs font-semibold shrink-0 gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              title={`Currently sorted by created date (${sortOrder === "desc" ? "Newest first" : "Oldest first"})`}
            >
              <ArrowUpDown className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>{sortOrder === "desc" ? "Newest First" : "Oldest First"}</span>
            </Button>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Showing <strong className="text-slate-900 dark:text-slate-100">{filteredRegistrations.length}</strong> of {registrations.length} leads
          </p>
        </div>

        {/* Table Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-2" />
            <p className="text-xs text-slate-500">Loading registrations...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-rose-500 text-xs font-semibold">
            {error}
          </div>
        ) : filteredRegistrations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              No registrations found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
              {searchQuery
                ? `No registrations match "${searchQuery}". Try searching with different keywords.`
                : "No prospective students have submitted registration inquiries yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-3.5 px-5">Student</th>
                  <th className="py-3.5 px-5">Contact</th>
                  <th className="py-3.5 px-5">Course / Program</th>
                  <th className="py-3.5 px-5">Inquiry Note</th>
                  <th className="py-3.5 px-5">
                    <button
                      type="button"
                      onClick={toggleSortOrder}
                      className="inline-flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors uppercase font-bold tracking-wider cursor-pointer group"
                      title="Click to toggle ascending/descending order by date"
                    >
                      <span>Received Date</span>
                      {sortOrder === "desc" ? (
                        <ArrowDown className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                      ) : (
                        <ArrowUp className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                      )}
                    </button>
                  </th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800 text-xs">
                {filteredRegistrations.map((reg) => (
                  <tr
                    key={reg.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Student Name */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center shrink-0">
                          {reg.full_name?.substring(0, 2).toUpperCase() || "NA"}
                        </div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                          {reg.full_name}
                        </div>
                      </div>
                    </td>

                    {/* Contact (Email + Phone) */}
                    <td className="py-4 px-5 space-y-1">
                      <a
                        href={`mailto:${reg.email}`}
                        className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        <Mail className="h-3.5 w-3.5 text-slate-400" />
                        <span className="truncate max-w-[180px]">{reg.email}</span>
                      </a>
                      <a
                        href={`tel:${reg.phone}`}
                        className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                        <span>{reg.phone}</span>
                      </a>
                    </td>

                    {/* Course */}
                    <td className="py-4 px-5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/40">
                        <BookOpen className="h-3 w-3" />
                        {reg.course}
                      </span>
                    </td>

                    {/* Note / Message */}
                    <td className="py-4 px-5 max-w-xs">
                      {reg.message ? (
                        <p className="text-slate-600 dark:text-slate-400 line-clamp-2 text-xs leading-relaxed" title={reg.message}>
                          {reg.message}
                        </p>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">No message</span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-5 text-slate-500 dark:text-slate-400 whitespace-nowrap text-[11px]">
                      {formatDate(reg.created_at)}
                    </td>

                    {/* Action buttons */}
                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(reg)}
                          className="h-8 w-8 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 dark:text-slate-400 dark:hover:text-indigo-400 dark:hover:bg-indigo-950/50"
                          title="Edit Registration"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setDeletingItem(reg);
                            setDeleteError(null);
                          }}
                          className="h-8 w-8 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 dark:text-slate-400 dark:hover:text-rose-400 dark:hover:bg-rose-950/50"
                          title="Delete Registration"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* EDIT MODAL DIALOG */}
      <Dialog
        open={!!editingItem}
        onOpenChange={(open) => {
          if (!open) setEditingItem(null);
        }}
      >
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 p-6 border-slate-200 dark:border-slate-800 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Edit Registration Details
            </DialogTitle>
          </DialogHeader>

          {editError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-600 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-400">
              {editError}
            </div>
          )}

          <form onSubmit={handleSaveEdit} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Full Name
              </label>
              <Input
                value={editForm.full_name || ""}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, full_name: e.target.value }))
                }
                required
                className="h-10 rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <Input
                type="email"
                value={editForm.email || ""}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, email: e.target.value }))
                }
                required
                className="h-10 rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Phone Number
              </label>
              <Input
                type="tel"
                value={editForm.phone || ""}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, phone: e.target.value }))
                }
                required
                className="h-10 rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Course / Program
              </label>
              <Input
                value={editForm.course || ""}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, course: e.target.value }))
                }
                required
                className="h-10 rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Inquiry Message
              </label>
              <Textarea
                value={editForm.message || ""}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, message: e.target.value }))
                }
                rows={3}
                className="rounded-xl text-xs"
                placeholder="Optional student message..."
              />
            </div>

            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingItem(null)}
                className="h-10 rounded-xl text-xs font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isUpdating}
                className="h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-500/20"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Saving Changes...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION MODAL */}
      <Dialog
        open={!!deletingItem}
        onOpenChange={(open) => {
          if (!open) setDeletingItem(null);
        }}
      >
        <DialogContent className="sm:max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 border-slate-200 dark:border-slate-800 shadow-2xl">
          <DialogHeader>
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
              <Trash2 className="h-6 w-6" />
            </div>
            <DialogTitle className="text-center text-lg font-bold text-slate-900 dark:text-slate-100">
              Delete Registration?
            </DialogTitle>
          </DialogHeader>

          <p className="text-center text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Are you sure you want to permanently delete the registration inquiry
            for <strong className="text-slate-900 dark:text-slate-100">{deletingItem?.full_name}</strong> ({deletingItem?.email})? This action cannot be undone.
          </p>

          {deleteError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-600 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-400">
              {deleteError}
            </div>
          )}

          <DialogFooter className="mt-4 gap-2 sm:justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeletingItem(null)}
              className="h-10 rounded-xl text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isDeleting}
              onClick={handleConfirmDelete}
              className="h-10 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md shadow-rose-500/20"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                "Yes, Delete Lead"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
