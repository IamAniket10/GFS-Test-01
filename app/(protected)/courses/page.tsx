"use client";

import { useState } from "react";
import CourseCard from "../../components/CourseCard";
import { CourseForm } from "../../components/CourseForm";
import { useCourses } from "@/hooks/useCourses";
import { useAuth } from "@/context/authContext";
import { Button } from "@/components/ui/button";
import CoursesLoading from "./loading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  GraduationCap,
  AlertTriangle,
  RefreshCw,
  Lock,
} from "lucide-react";
import { Course, CreateCourseInput } from "@/types";

export default function CoursesPage() {
  const { courses, loading, error, refresh, create, update, remove } =
    useCourses();

  const { canWrite } = useAuth();
  const hasWriteAccess = canWrite("courses");

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreateCourse = async (courseData: CreateCourseInput) => {
    try {
      await create(courseData);
      setIsDialogOpen(false);
    } catch {
      // Toast notification is handled inside useCourses
    }
  };

  const handleUpdateActive = async (courseToUpdate: Course) => {
    const updatedStatus = !courseToUpdate.is_active;

    try {
      await update(courseToUpdate.id, {
        is_active: updatedStatus,
      });
    } catch {
      // Toast notification is handled inside useCourses
    }
  };

  if (loading) {
    return <CoursesLoading />;
  }

  if (error) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto pb-10">
        <div className="flex flex-col items-center justify-center p-12 rounded-2xl border border-red-200 bg-red-50 text-red-900 dark:bg-red-950/20 dark:border-red-800/50 dark:text-red-200 text-center mt-6">
          <AlertTriangle className="h-10 w-10 text-red-500 mb-3" />

          <h3 className="text-lg font-bold">Failed to load courses</h3>

          <p className="font-medium text-sm text-red-600 dark:text-red-400 mt-1">
            {error}
          </p>

          <Button
            onClick={refresh}
            variant="outline"
            className="mt-5 gap-2 border-red-300 text-red-700 hover:bg-red-100 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-900/40"
          >
            <RefreshCw className="h-4 w-4" />
            Retry Request
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <GraduationCap className="h-6 w-6" />
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Courses Management
            </h2>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Overview of active training modules, tracks, and session counts.
            </p>
          </div>
        </div>

        {/* Create Course */}
        {hasWriteAccess ? (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/10 transition-all active:scale-[0.99]">
                <Plus className="h-4 w-4" />
                Create Course
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden rounded-2xl border-slate-200 dark:border-slate-800">
              <DialogHeader className="sr-only">
                <DialogTitle>Add New Course</DialogTitle>

                <DialogDescription>
                  Fill in the details below to create a new course track.
                </DialogDescription>
              </DialogHeader>

              <CourseForm addCourse={handleCreateCourse} />
            </DialogContent>
          </Dialog>
        ) : (
          <Button
            disabled
            className="gap-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
          >
            <Lock className="h-3.5 w-3.5" />
            Create Course (Read-only)
          </Button>
        )}
      </div>

      {/* Course List */}
      <CourseCard
        courses={courses}
        onDelete={remove}
        onUpdate={handleUpdateActive}
      />
    </div>
  );
}
// "use client";

// import { useState } from "react";
// import CourseCard from "../../components/CourseCard";
// import { CourseForm } from "../../components/CourseForm";
// import { updateCourse } from "@/lib/api/courses";
// import { useCourses } from "@/hooks/useCourses";
// import { useAuth } from "@/context/authContext";
// import { Button } from "@/components/ui/button";
// import CoursesLoading from "./loading";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   Plus,
//   GraduationCap,
//   AlertTriangle,
//   RefreshCw,
//   Lock,
// } from "lucide-react";
// import { toast } from "sonner";
// import { Course, CreateCourseInput } from "@/types";

// export default function CoursesPage() {
//   const { courses, loading, error, refresh, create, remove } = useCourses();
//   const { canWrite } = useAuth();
//   const hasWriteAccess = canWrite("courses");

//   const [isDialogOpen, setIsDialogOpen] = useState(false);

//   const handleCreateCourse = async (courseData: CreateCourseInput) => {
//     try {
//       await create(courseData);
//       setIsDialogOpen(false);
//     } catch {
//       // Toast notification is handled inside useCourses
//     }
//   };

//   const handleUpdateActive = async (courseToUpdate: Course) => {
//     const updatedStatus = !courseToUpdate.is_active;
//     try {
//       await updateCourse(courseToUpdate.id, { is_active: updatedStatus });
//       await refresh();
//       toast.success(`Course set to ${updatedStatus ? "active" : "inactive"}`);
//     } catch (err: any) {
//       toast.error(err.message || "Failed to update course status");
//     }
//   };

//   if (loading) {
//     return <CoursesLoading />;
//   }

//   if (error) {
//     return (
//       <div className="space-y-6 max-w-7xl mx-auto pb-10">
//         <div className="flex flex-col items-center justify-center p-12 rounded-2xl border border-red-200 bg-red-50 text-red-900 dark:bg-red-950/20 dark:border-red-800/50 dark:text-red-200 text-center mt-6">
//           <AlertTriangle className="h-10 w-10 text-red-500 mb-3" />
//           <h3 className="text-lg font-bold">Failed to load courses</h3>
//           <p className="font-medium text-sm text-red-600 dark:text-red-400 mt-1">
//             {error}
//           </p>
//           <Button
//             onClick={refresh}
//             variant="outline"
//             className="mt-5 gap-2 border-red-300 text-red-700 hover:bg-red-100 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-900/40"
//           >
//             <RefreshCw className="h-4 w-4" />
//             Retry Request
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 max-w-7xl mx-auto pb-10">
//       {/* Header section */}
//       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
//         <div className="flex items-center gap-3.5">
//           <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
//             <GraduationCap className="h-6 w-6" />
//           </div>
//           <div>
//             <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
//               Courses Management
//             </h2>
//             <p className="text-xs text-slate-500 dark:text-slate-400">
//               Overview of active training modules, tracks, and session counts.
//             </p>
//           </div>
//         </div>

//         {/* Dialog & Permission-Guarded Trigger Button */}
//         {hasWriteAccess ? (
//           <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//             <DialogTrigger asChild>
//               <Button className="gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/10 transition-all active:scale-[0.99]">
//                 <Plus className="h-4 w-4" />
//                 Create Course
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden rounded-2xl border-slate-200 dark:border-slate-800">
//               <DialogHeader className="sr-only">
//                 <DialogTitle>Add New Course</DialogTitle>
//                 <DialogDescription>
//                   Fill in the details below to create a new course track.
//                 </DialogDescription>
//               </DialogHeader>
//               <CourseForm addCourse={handleCreateCourse} />
//             </DialogContent>
//           </Dialog>
//         ) : (
//           <Button
//             disabled
//             className="gap-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
//           >
//             <Lock className="h-3.5 w-3.5" />
//             Create Course (Read-only)
//           </Button>
//         )}
//       </div>

//       {/* Course List Component */}
//       <CourseCard
//         courses={courses}
//         onDelete={remove}
//         onUpdate={handleUpdateActive}
//       />
//     </div>
//   );
// }
