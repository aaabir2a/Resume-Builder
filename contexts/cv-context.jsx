"use client";

import { createContext, useContext, useState, useRef } from "react";

const CVContext = createContext(undefined);

export function CVProvider({ children }) {
  const [cv, setCV] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchInProgress = useRef(false);
  const saveInProgress = useRef(false);

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

  const saveCV = async (cvData) => {
    if (saveInProgress.current || !cv?._id) return false;

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
      return true;
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
      return false;
    } finally {
      setLoading(false);
      saveInProgress.current = false;
    }
  };

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

  const updateCV = (cvData) => {
    if (!cv) return;

    // Update the CV state locally without saving to the server
    setCV((prevCV) => ({
      ...prevCV,
      ...cvData,
    }));
  };

  return (
    <CVContext.Provider
      value={{
        cv,
        loading,
        error,
        fetchCV,
        saveCV,
        createCV,
        updateCV,
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
