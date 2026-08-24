"use client";

import { useState, useEffect, useCallback } from "react";
import { Homework } from "@/types";
import {
  fetchHomework,
  createHomework,
  updateHomeworkStatus,
  deleteHomework,
} from "@/lib/api/homework";
import { toast } from "sonner";

type HomeworkStatus = "pending" | "submitted" | "reviewed";

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export function useHomework(courseId?: string) {
  const [homework, setHomework] = useState<Homework[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHomework = useCallback(async () => {
    if (!courseId) {
      setHomework([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchHomework(courseId);
      setHomework(data);
    } catch (error: unknown) {
      const message = getErrorMessage(
        error,
        "Failed to load homework assignments",
      );

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    loadHomework();
  }, [loadHomework]);

  const addHomework = async (data: {
    course_id: string;
    student_id: string;
    title: string;
    due_date: string;
    status?: HomeworkStatus;
  }) => {
    try {
      const newItem = await createHomework(data);

      setHomework((prev) => [newItem, ...prev]);

      toast.success("Homework assigned successfully");

      return newItem;
    } catch (error: unknown) {
      const message = getErrorMessage(error, "Failed to assign homework");

      toast.error(message);
      throw error;
    }
  };

  const changeStatus = async (id: string, status: HomeworkStatus) => {
    try {
      const updated = await updateHomeworkStatus(id, status);

      setHomework((prev) =>
        prev.map((item) => (item.id === id ? updated : item)),
      );

      toast.success("Status updated");

      return updated;
    } catch (error: unknown) {
      const message = getErrorMessage(
        error,
        "Failed to update homework status",
      );

      toast.error(message);
      throw error;
    }
  };

  const removeHomework = async (id: string) => {
    try {
      await deleteHomework(id);

      setHomework((prev) => prev.filter((item) => item.id !== id));

      toast.success("Homework assignment removed");
    } catch (error: unknown) {
      const message = getErrorMessage(
        error,
        "Failed to delete homework assignment",
      );

      toast.error(message);
      throw error;
    }
  };

  return {
    homework,
    loading,
    error,
    refresh: loadHomework,
    addHomework,
    changeStatus,
    removeHomework,
  };
}
// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { Homework } from "@/types";
// import {
//   fetchHomework,
//   createHomework,
//   updateHomeworkStatus,
//   deleteHomework,
// } from "@/lib/api/homework";
// import { toast } from "sonner";

// export function useHomework(courseId?: string) {
//   const [homework, setHomework] = useState<Homework[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const loadHomework = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const data = await fetchHomework(courseId);
//       console.log("courseId:", courseId);
//       setHomework(data);
//     } catch (err: any) {
//       setError(err.message || "Failed to load homework assignments");
//     } finally {
//       setLoading(false);
//     }
//   }, [courseId]);

//   useEffect(() => {
//     loadHomework();
//   }, [loadHomework]);

//   const addHomework = async (data: {
//     course_id: string;
//     student_id: string;
//     title: string;
//     due_date: string;
//     status?: "pending" | "submitted" | "reviewed";
//   }) => {
//     try {
//       const newItem = await createHomework(data);
//       setHomework((prev) => [newItem, ...prev]);
//       toast.success("Homework assigned successfully");
//       return newItem;
//     } catch (err: any) {
//       toast.error(err.message || "Failed to assign homework");
//       throw err;
//     }
//   };

//   const changeStatus = async (
//     id: string,
//     status: "pending" | "submitted" | "reviewed",
//   ) => {
//     try {
//       const updated = await updateHomeworkStatus(id, status);
//       setHomework((prev) =>
//         prev.map((item) => (item.id === id ? updated : item)),
//       );
//       toast.success("Status updated");
//     } catch (err: any) {
//       toast.error(err.message || "Failed to update status");
//     }
//   };

//   const removeHomework = async (id: string) => {
//     try {
//       await deleteHomework(id);
//       setHomework((prev) => prev.filter((item) => item.id !== id));
//       toast.success("Homework assignment removed");
//     } catch (err: any) {
//       toast.error(err.message || "Failed to delete assignment");
//     }
//   };

//   return {
//     homework,
//     loading,
//     error,
//     refresh: loadHomework,
//     addHomework,
//     changeStatus,
//     removeHomework,
//   };
// }
