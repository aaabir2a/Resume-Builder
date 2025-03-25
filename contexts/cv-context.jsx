"use client";

import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
} from "react";

const CVContext = createContext(undefined);

export function CVProvider({ children }) {
  const [cv, setCV] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchInProgress = useRef(false);
  const saveInProgress = useRef(false);
  const lastSavedCV = useRef(null);

  const fetchCV = async (id) => {
    if (fetchInProgress.current) return;

    setLoading(true);
    setError(null);
    fetchInProgress.current = true;

    try {
      const res = await fetch(`/api/cv/${id}`);

      if (!res.ok) {
        throw new Error("Failed to fetch CV");
      }

      const data = await res.json();
      setCV(data.cv);
      lastSavedCV.current = JSON.stringify(data.cv);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
      fetchInProgress.current = false;
    }
  };

  const saveCV = useCallback(
    async (cvData) => {
      if (saveInProgress.current) return;
      if (!cv?._id) return;

      // Check if there are actual changes to save
      const newCVString = JSON.stringify({ ...cv, ...cvData });
      if (newCVString === lastSavedCV.current) return;

      saveInProgress.current = true;
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/cv/${cv._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...cv,
            ...cvData,
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to save CV");
        }

        const data = await res.json();
        setCV(data.cv);
        lastSavedCV.current = JSON.stringify(data.cv);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
        saveInProgress.current = false;
      }
    },
    [cv]
  );

  const createCV = async (cvData) => {
    if (saveInProgress.current) return null;

    saveInProgress.current = true;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/cv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cvData),
      });

      if (!res.ok) {
        throw new Error("Failed to create CV");
      }

      const data = await res.json();
      setCV(data.cv);
      lastSavedCV.current = JSON.stringify(data.cv);
      return data.cv._id;
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
      return null;
    } finally {
      setLoading(false);
      saveInProgress.current = false;
    }
  };

  const updateProgress = useCallback(
    async (progress) => {
      if (!cv || saveInProgress.current) return;
      if (cv.progress === progress) return;

      await saveCV({ ...cv, progress });
    },
    [cv, saveCV]
  );

  return (
    <CVContext.Provider
      value={{
        cv,
        loading,
        error,
        fetchCV,
        saveCV,
        createCV,
        updateProgress,
      }}
    >
      {children}
    </CVContext.Provider>
  );
}

export function useCV() {
  const context = useContext(CVContext);

  if (context === undefined) {
    throw new Error("useCV must be used within a CVProvider");
  }

  return context;
}
