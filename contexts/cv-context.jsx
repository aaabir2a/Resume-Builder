"use client";
import { createContext, useContext, useState } from "react";

const CVContext = createContext(undefined)

export function CVProvider({
  children
}) {
  const [cv, setCV] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchCV = async (id) => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/cv/${id}`)

      if (!res.ok) {
        throw new Error("Failed to fetch CV")
      }

      const data = await res.json()
      setCV(data.cv)
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("An unknown error occurred")
      }
    } finally {
      setLoading(false)
    }
  }

  const saveCV = async (cvData) => {
    setLoading(true)
    setError(null)

    try {
      if (!cv?._id) {
        throw new Error("No CV to update")
      }

      const res = await fetch(`/api/cv/${cv._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...cv,
          ...cvData,
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to save CV")
      }

      const data = await res.json()
      setCV(data.cv)
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("An unknown error occurred")
      }
    } finally {
      setLoading(false)
    }
  }

  const createCV = async cvData => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/cv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cvData),
      })

      if (!res.ok) {
        throw new Error("Failed to create CV")
      }

      const data = await res.json()
      setCV(data.cv)
      return data.cv._id
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("An unknown error occurred")
      }
      return null
    } finally {
      setLoading(false)
    }
  }

  const updateProgress = async (progress) => {
    if (!cv) return

    await saveCV({ ...cv, progress })
  }

  return (
    (<CVContext.Provider
      value={{
        cv,
        loading,
        error,
        fetchCV,
        saveCV,
        createCV,
        updateProgress,
      }}>
      {children}
    </CVContext.Provider>)
  );
}

export function useCV() {
  const context = useContext(CVContext)

  if (context === undefined) {
    throw new Error("useCV must be used within a CVProvider")
  }

  return context
}

