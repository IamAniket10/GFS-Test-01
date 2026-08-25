"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { fetchWins, saveDayWins, deleteWin } from "@/lib/api/wins";
import { DayWinsGroup, SaveDayWinsInput, WinEntry } from "@/types";
import { useAuth } from "@/context/authContext";
import { toast } from "sonner";

export interface MonthInfo {
  key: string; // "YYYY-MM"
  label: string; // "August 2026"
  year: number;
  monthIndex: number; // 0-11
  isCurrentMonth: boolean;
  isRegistrationMonth: boolean;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const SHORT_MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Format a Date object into "YYYY-MM-DD" in local time.
 */
export function formatToISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Format "YYYY-MM-DD" into "Sat, 22 Aug'26"
 */
export function formatDisplayDate(dateStr: string): string {
  const [yStr, mStr, dStr] = dateStr.split("-");
  const y = parseInt(yStr, 10);
  const m = parseInt(mStr, 10) - 1;
  const d = parseInt(dStr, 10);

  const dateObj = new Date(y, m, d);
  const dayName = DAY_NAMES[dateObj.getDay()];
  const shortMonth = SHORT_MONTH_NAMES[m];
  const shortYear = String(y).slice(-2);

  return `${dayName}, ${d} ${shortMonth}'${shortYear}`;
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}

export function useWins() {
  const { user } = useAuth();
  const [wins, setWins] = useState<WinEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Today's date benchmark
  const today = useMemo(() => new Date(), []);
  const todayStr = useMemo(() => formatToISODate(today), [today]);
  const currentMonthKey = useMemo(
    () => `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`,
    [today],
  );

  // Registration date benchmark
  const registrationDate = useMemo(() => {
    if (user?.created_at) {
      const parsed = new Date(user.created_at);
      if (!isNaN(parsed.getTime())) {
        return parsed;
      }
    }
    // Fallback: If user registration date is unavailable, default to start of current month or today
    return today;
  }, [user?.created_at, today]);

  const regMonthKey = useMemo(() => {
    return `${registrationDate.getFullYear()}-${String(registrationDate.getMonth() + 1).padStart(2, "0")}`;
  }, [registrationDate]);

  /**
   * 1. Compute dynamic list of months starting from registration month up to the active current month.
   * Auto-populates new calendar months dynamically as time progresses.
   * Ordered in reverse chronological order (newest month at the top).
   */
  const availableMonths = useMemo<MonthInfo[]>(() => {
    const months: MonthInfo[] = [];

    const startYear = registrationDate.getFullYear();
    const startMonth = registrationDate.getMonth();

    const endYear = today.getFullYear();
    const endMonth = today.getMonth();

    // Iterate backwards from current month down to registration month
    let curY = endYear;
    let curM = endMonth;

    while (
      curY > startYear ||
      (curY === startYear && curM >= startMonth)
    ) {
      const key = `${curY}-${String(curM + 1).padStart(2, "0")}`;
      const label = `${MONTH_NAMES[curM]} ${curY}`;
      const isCurrentMonth = key === currentMonthKey;
      const isRegistrationMonth = key === regMonthKey;

      months.push({
        key,
        label,
        year: curY,
        monthIndex: curM,
        isCurrentMonth,
        isRegistrationMonth,
      });

      curM--;
      if (curM < 0) {
        curM = 11;
        curY--;
      }
    }

    // Safety fallback: ensure at least current month is available
    if (months.length === 0) {
      months.push({
        key: currentMonthKey,
        label: `${MONTH_NAMES[today.getMonth()]} ${today.getFullYear()}`,
        year: today.getFullYear(),
        monthIndex: today.getMonth(),
        isCurrentMonth: true,
        isRegistrationMonth: true,
      });
    }

    return months;
  }, [registrationDate, today, currentMonthKey, regMonthKey]);

  /**
   * 2. Group wins by date string "YYYY-MM-DD"
   */
  const winsByDate = useMemo(() => {
    const map = new Map<string, WinEntry[]>();
    for (const win of wins) {
      const existing = map.get(win.date) || [];
      existing.push(win);
      map.set(win.date, existing);
    }
    return map;
  }, [wins]);

  /**
   * 3. Month-Based Date Generation Matrix:
   * Generates dynamic day entries for a given month in reverse chronological order (newest at top).
   *
   * Scenario A: Registration Month (Active Current) -> regDate to today.
   * Scenario B: Registration Month (Past) -> regDate to end of month.
   * Scenario C: Ongoing Subsequent Month (Active Current) -> Day 1 to today.
   * Scenario D: Full Past Month -> Day 1 to end of month.
   */
  const getDaysForMonth = useCallback(
    (monthKey: string): DayWinsGroup[] => {
      const [yearStr, monthStr] = monthKey.split("-");
      const year = parseInt(yearStr, 10);
      const monthNum = parseInt(monthStr, 10); // 1-indexed
      const monthIndex = monthNum - 1;

      const isCurrentMonth = monthKey === currentMonthKey;
      const isRegMonth = monthKey === regMonthKey;

      // Determine Start Day
      let startDayNum = 1;
      if (isRegMonth) {
        startDayNum = registrationDate.getDate();
      }

      // Determine End Day
      let endDayNum: number;
      if (isCurrentMonth) {
        endDayNum = today.getDate();
      } else {
        // Last day of that calendar month
        endDayNum = new Date(year, monthNum, 0).getDate();
      }

      const days: DayWinsGroup[] = [];

      // Generate in reverse chronological order (from endDay down to startDay)
      for (let d = endDayNum; d >= startDayNum; d--) {
        const dateStr = `${year}-${String(monthNum).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        const isThisToday = dateStr === todayStr;
        const entries = winsByDate.get(dateStr) || [];

        days.push({
          date: dateStr,
          formattedDate: formatDisplayDate(dateStr),
          isToday: isThisToday,
          entries,
        });
      }

      return days;
    },
    [currentMonthKey, regMonthKey, registrationDate, today, todayStr, winsByDate],
  );

  /**
   * 4. Fetch wins from server
   */
  const loadWins = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWins();
      setWins(data);
    } catch (err: unknown) {
      const msg = getErrorMessage(err, "Failed to load daily wins");
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWins();
  }, [loadWins]);

  /**
   * 5. Save/Reconcile wins for a specific date
   */
  const handleSaveDay = async (payload: SaveDayWinsInput) => {
    setSaving(true);
    try {
      const updatedEntries = await saveDayWins(payload);

      setWins((prev) => {
        // Remove old entries for this date and append new updated entries
        const filtered = prev.filter((w) => w.date !== payload.date);
        return [...updatedEntries, ...filtered];
      });

      toast.success("Wins updated successfully");
      return updatedEntries;
    } catch (err: unknown) {
      const msg = getErrorMessage(err, "Failed to save wins");
      toast.error(msg);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  /**
   * 6. Delete a single win item
   */
  const handleDeleteWin = async (id: string) => {
    try {
      await deleteWin(id);
      setWins((prev) => prev.filter((w) => w.id !== id));
      toast.success("Win entry deleted");
    } catch (err: unknown) {
      const msg = getErrorMessage(err, "Failed to delete win");
      toast.error(msg);
      throw err;
    }
  };

  return {
    wins,
    loading,
    saving,
    error,
    availableMonths,
    currentMonthKey,
    todayStr,
    winsByDate,
    getDaysForMonth,
    saveDay: handleSaveDay,
    deleteWin: handleDeleteWin,
    refresh: loadWins,
  };
}
