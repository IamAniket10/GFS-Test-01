"use client";

import { useState, useEffect, useCallback } from "react";
import {
  fetchCourses,
  createCourse,
  deleteCourse,
  updateCourse,
} from "@/lib/api/courses";
import { toast } from "sonner";
import { Course, CreateCourseInput } from "@/types";

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCourses = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchCourses();
      setCourses(data);
    } catch (error: unknown) {
      const message = getErrorMessage(error, "Failed to load courses");

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const handleCreate = async (courseData: CreateCourseInput) => {
    try {
      const newCourse = await createCourse(courseData);

      setCourses((prev) => [newCourse, ...prev]);

      toast.success("Course created successfully");

      return newCourse;
    } catch (error: unknown) {
      const message = getErrorMessage(error, "Failed to create course");

      toast.error(message);
      throw error;
    }
  };

  const handleUpdate = async (id: string, data: Partial<Course>) => {
    try {
      const updatedCourse = await updateCourse(id, data);

      setCourses((prev) =>
        prev.map((course) => (course.id === id ? updatedCourse : course)),
      );

      toast.success("Course updated successfully");

      return updatedCourse;
    } catch (error: unknown) {
      const message = getErrorMessage(error, "Failed to update course");

      toast.error(message);
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCourse(id);

      setCourses((prev) => prev.filter((course) => course.id !== id));

      toast.success("Course deleted successfully");
    } catch (error: unknown) {
      const message = getErrorMessage(error, "Failed to delete course");

      toast.error(message);
      throw error;
    }
  };

  return {
    courses,
    loading,
    error,
    refresh: loadCourses,
    create: handleCreate,
    update: handleUpdate,
    remove: handleDelete,
  };
}
// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { fetchCourses, createCourse, deleteCourse } from "@/lib/api/courses";
// import { toast } from "sonner";
// import { Course, CreateCourseInput } from "@/types";

// function getErrorMessage(error: unknown, fallback: string) {
//   if (error instanceof Error) {
//     return error.message;
//   }

//   return fallback;
// }

// export function useCourses() {
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const loadCourses = useCallback(async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const data = await fetchCourses();
//       setCourses(data);
//     } catch (error: unknown) {
//       const message = getErrorMessage(error, "Failed to load courses");

//       setError(message);
//       toast.error(message);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     loadCourses();
//   }, [loadCourses]);

//   const handleCreate = async (courseData: CreateCourseInput) => {
//     try {
//       const newCourse = await createCourse(courseData);

//       setCourses((prev) => [newCourse, ...prev]);

//       toast.success("Course created successfully");

//       return newCourse;
//     } catch (error: unknown) {
//       const message = getErrorMessage(error, "Failed to create course");

//       toast.error(message);
//       throw error;
//     }
//   };

//   const handleDelete = async (id: string) => {
//     try {
//       await deleteCourse(id);

//       setCourses((prev) => prev.filter((course) => course.id !== id));

//       toast.success("Course deleted successfully");
//     } catch (error: unknown) {
//       const message = getErrorMessage(error, "Failed to delete course");

//       toast.error(message);
//       throw error;
//     }
//   };

//   return {
//     courses,
//     loading,
//     error,
//     refresh: loadCourses,
//     create: handleCreate,
//     remove: handleDelete,
//   };
// }
