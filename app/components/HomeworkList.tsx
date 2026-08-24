"use client";

import { useState } from "react";
import { Homework } from "@/types";
import { useHomework } from "@/hooks/useHomework";
import { useAuth } from "@/context/authContext";
import {
  CheckCircle2,
  Clock,
  BookCheck,
  Lock,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface HomeworkListProps {
  courseId: string;
}

export default function HomeworkList({ courseId }: HomeworkListProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [studentId, setStudentId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const {
    homework,
    loading,
    error,
    addHomework,
    changeStatus,
    removeHomework,
  } = useHomework(courseId);

  const { user, canWrite, isLoading: authLoading } = useAuth();

  const hasHomeworkWriteAccess = !authLoading && canWrite("homework");

  const handleCreateHomework = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !studentId || !dueDate) return;

    setSubmitting(true);

    try {
      await addHomework({
        course_id: courseId,
        student_id: studentId,
        title,
        due_date: dueDate,
      });

      setTitle("");
      setStudentId("");
      setDueDate("");
      setOpen(false);
    } catch {
      // Error toast is handled inside useHomework
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStatus = async (item: Homework) => {
    if (!hasHomeworkWriteAccess || updatingId === item.id) {
      return;
    }

    const nextStatus = item.status === "submitted" ? "pending" : "submitted";

    setUpdatingId(item.id);

    try {
      await changeStatus(item.id, nextStatus);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!hasHomeworkWriteAccess) return;

    await removeHomework(id);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-xs text-slate-500 py-4 animate-pulse">
        <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
        Loading homework assignments...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-xs text-rose-500 py-4">
        Failed to load homework assignments.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <BookCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          Course Homework ({homework.length})
        </h3>

        {hasHomeworkWriteAccess ? (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Plus className="h-3.5 w-3.5" />
                Assign Homework
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Assign Homework</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleCreateHomework} className="space-y-4 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Title
                  </label>

                  <Input
                    required
                    placeholder="e.g. Complete Exercises 1-4"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Student ID
                  </label>

                  <Input
                    required
                    placeholder="Enter target student UUID"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Due Date
                  </label>

                  <Input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {submitting ? "Assigning..." : "Assign Homework"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        ) : (
          user?.role !== "student" && (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
              <Lock className="h-2.5 w-2.5" />
              Read-only Mode
            </span>
          )
        )}
      </div>

      {homework.length === 0 ? (
        <div className="p-6 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center bg-slate-50/50 dark:bg-slate-900/20">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            No homework assigned for this course yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-2.5">
          {homework.map((item) => {
            const isDone =
              item.status === "submitted" || item.status === "reviewed";

            const isUpdating = updatingId === item.id;

            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50"
              >
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {item.title}
                  </p>

                  <div className="flex items-center gap-3 text-[10px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Due: {new Date(item.due_date).toLocaleDateString()}
                    </span>

                    {user?.role !== "student" && (
                      <span className="font-mono text-slate-400">
                        Student: {item.student_id.slice(0, 8)}...
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {hasHomeworkWriteAccess ? (
                    <>
                      <button
                        disabled={isUpdating}
                        onClick={() => toggleStatus(item)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                          isUpdating
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer"
                        } ${
                          isDone
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-400"
                            : "bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/60 dark:text-amber-400"
                        }`}
                      >
                        {isUpdating ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        )}

                        {item.status === "submitted"
                          ? "Submitted"
                          : item.status === "reviewed"
                            ? "Reviewed"
                            : "Pending"}
                      </button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(item.id)}
                        className="h-7 w-7 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </>
                  ) : (
                    <span
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium cursor-not-allowed ${
                        isDone
                          ? "bg-emerald-50/60 text-emerald-700/80 dark:bg-emerald-950/40 dark:text-emerald-400/80"
                          : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      <Lock className="h-3 w-3" />

                      {item.status === "submitted"
                        ? "Submitted"
                        : item.status === "reviewed"
                          ? "Reviewed"
                          : "Pending"}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
// "use client";

// import { useState, useEffect } from "react";
// import {
//   fetchHomework,
//   createHomework,
//   updateHomeworkStatus,
//   deleteHomework,
// } from "@/lib/api/homework";
// import { useAuth } from "@/context/authContext";
// import {
//   CheckCircle2,
//   Clock,
//   BookCheck,
//   Lock,
//   Loader2,
//   Plus,
//   Trash2,
//   AlertCircle,
// } from "lucide-react";
// import { toast } from "sonner";
// import { Homework } from "@/types";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";

// interface HomeworkListProps {
//   courseId: string;
// }

// export default function HomeworkList({ courseId }: HomeworkListProps) {
//   const [homework, setHomework] = useState<Homework[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [updatingId, setUpdatingId] = useState<string | null>(null);

//   // Form State
//   const [open, setOpen] = useState(false);
//   const [title, setTitle] = useState("");
//   const [studentId, setStudentId] = useState("");
//   const [dueDate, setDueDate] = useState("");
//   const [submitting, setSubmitting] = useState(false);

//   const { user, canWrite, isLoading: authLoading } = useAuth();
//   const hasHomeworkWriteAccess = !authLoading && canWrite("homework");

//   useEffect(() => {
//     async function loadHomework() {
//       setLoading(true);
//       try {
//         const data = await fetchHomework(courseId);
//         console.log("Fetched homeworkLIst:", courseId);
//         setHomework(data);
//       } catch (err: any) {
//         toast.error(err.message || "Failed to load homework assignments");
//       } finally {
//         setLoading(false);
//       }
//     }

//     if (courseId) {
//       loadHomework();
//     }
//   }, [courseId]);

//   const handleCreateHomework = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!title || !studentId || !dueDate) return;

//     setSubmitting(true);
//     try {
//       const newItem = await createHomework({
//         course_id: courseId,
//         student_id: studentId,
//         title,
//         due_date: dueDate,
//       });

//       setHomework((prev) => [newItem, ...prev]);
//       toast.success("Homework assigned successfully");

//       // Reset Form
//       setTitle("");
//       setStudentId("");
//       setDueDate("");
//       setOpen(false);
//     } catch (err: any) {
//       toast.error(err.message || "Failed to assign homework");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const toggleStatus = async (item: Homework) => {
//     if (!hasHomeworkWriteAccess || updatingId === item.id) return;

//     const nextStatus = item.status === "submitted" ? "pending" : "submitted";
//     setUpdatingId(item.id);

//     try {
//       await updateHomeworkStatus(item.id, nextStatus);
//       setHomework((prev) =>
//         prev.map((h) => (h.id === item.id ? { ...h, status: nextStatus } : h)),
//       );
//       toast.success(`Marked homework as ${nextStatus}`);
//     } catch (err: any) {
//       toast.error(err.message || "Failed to update homework status");
//     } finally {
//       setUpdatingId(null);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if (!hasHomeworkWriteAccess) return;

//     try {
//       await deleteHomework(id);
//       setHomework((prev) => prev.filter((h) => h.id !== id));
//       toast.success("Homework assignment removed");
//     } catch (err: any) {
//       toast.error(err.message || "Failed to delete homework assignment");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center gap-2 text-xs text-slate-500 py-4 animate-pulse">
//         <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
//         Loading homework assignments...
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4">
//       {/* Header & Write Access Actions */}
//       <div className="flex items-center justify-between">
//         <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
//           <BookCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
//           Course Homework ({homework.length})
//         </h3>

//         {hasHomeworkWriteAccess ? (
//           <Dialog open={open} onOpenChange={setOpen}>
//             <DialogTrigger asChild>
//               <Button
//                 size="sm"
//                 className="gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
//               >
//                 <Plus className="h-3.5 w-3.5" /> Assign Homework
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-md">
//               <DialogHeader>
//                 <DialogTitle>Assign Homework</DialogTitle>
//               </DialogHeader>
//               <form onSubmit={handleCreateHomework} className="space-y-4 pt-2">
//                 <div className="space-y-1">
//                   <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
//                     Title
//                   </label>
//                   <Input
//                     required
//                     placeholder="e.g. Complete Exercises 1-4"
//                     value={title}
//                     onChange={(e) => setTitle(e.target.value)}
//                   />
//                 </div>
//                 <div className="space-y-1">
//                   <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
//                     Student ID
//                   </label>
//                   <Input
//                     required
//                     placeholder="Enter target student UUID"
//                     value={studentId}
//                     onChange={(e) => setStudentId(e.target.value)}
//                   />
//                 </div>
//                 <div className="space-y-1">
//                   <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
//                     Due Date
//                   </label>
//                   <Input
//                     type="date"
//                     required
//                     value={dueDate}
//                     onChange={(e) => setDueDate(e.target.value)}
//                   />
//                 </div>
//                 <Button
//                   type="submit"
//                   disabled={submitting}
//                   className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
//                 >
//                   {submitting ? "Assigning..." : "Assign Homework"}
//                 </Button>
//               </form>
//             </DialogContent>
//           </Dialog>
//         ) : (
//           user?.role !== "student" && (
//             <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
//               <Lock className="h-2.5 w-2.5" /> Read-only Mode
//             </span>
//           )
//         )}
//       </div>

//       {/* Homework List View */}
//       {homework.length === 0 ? (
//         <div className="p-6 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center bg-slate-50/50 dark:bg-slate-900/20">
//           <p className="text-xs text-slate-500 dark:text-slate-400">
//             No homework assigned for this course yet.
//           </p>
//         </div>
//       ) : (
//         <div className="grid gap-2.5">
//           {homework.map((item) => {
//             const isDone =
//               item.status === "submitted" || item.status === "reviewed";
//             const isUpdating = updatingId === item.id;

//             return (
//               <div
//                 key={item.id}
//                 className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50"
//               >
//                 <div className="space-y-1">
//                   <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
//                     {item.title}
//                   </p>
//                   <div className="flex items-center gap-3 text-[10px] text-slate-500">
//                     <span className="flex items-center gap-1">
//                       <Clock className="h-3 w-3" />
//                       Due: {new Date(item.due_date).toLocaleDateString()}
//                     </span>
//                     {user?.role !== "student" && (
//                       <span className="font-mono text-slate-400">
//                         Student: {item.student_id.slice(0, 8)}...
//                       </span>
//                     )}
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-2">
//                   {hasHomeworkWriteAccess ? (
//                     <>
//                       <button
//                         disabled={isUpdating}
//                         onClick={() => toggleStatus(item)}
//                         className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
//                           isUpdating
//                             ? "opacity-50 cursor-not-allowed"
//                             : "cursor-pointer"
//                         } ${
//                           isDone
//                             ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-400"
//                             : "bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/60 dark:text-amber-400"
//                         }`}
//                       >
//                         {isUpdating ? (
//                           <Loader2 className="h-3.5 w-3.5 animate-spin" />
//                         ) : (
//                           <CheckCircle2 className="h-3.5 w-3.5" />
//                         )}
//                         {item.status === "submitted"
//                           ? "Submitted"
//                           : item.status === "reviewed"
//                             ? "Reviewed"
//                             : "Pending"}
//                       </button>

//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => handleDelete(item.id)}
//                         className="h-7 w-7 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
//                       >
//                         <Trash2 className="h-3.5 w-3.5" />
//                       </Button>
//                     </>
//                   ) : (
//                     <span
//                       className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium cursor-not-allowed ${
//                         isDone
//                           ? "bg-emerald-50/60 text-emerald-700/80 dark:bg-emerald-950/40 dark:text-emerald-400/80"
//                           : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
//                       }`}
//                     >
//                       <Lock className="h-3 w-3" />
//                       {item.status === "submitted"
//                         ? "Submitted"
//                         : item.status === "reviewed"
//                           ? "Reviewed"
//                           : "Pending"}
//                     </span>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }
