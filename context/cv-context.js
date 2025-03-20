"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./auth-context";

const CVContext = createContext();

export function CVProvider({ children }) {
  const { user } = useAuth();
  const [cv, setCV] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCV();
    } else {
      setCV(null);
    }
  }, [user]);

  const fetchCV = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch("/api/cv", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCV(data);
      } else if (response.status !== 404) {
        // 404 is expected if user doesn't have a CV yet
        console.error("Error fetching CV");
      }
    } catch (error) {
      console.error("Fetch CV error:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveCV = async (cvData) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch("/api/cv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cvData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save CV");
      }

      // Update local state
      setCV({ ...cvData, _id: data.cvId });
      return data;
    } catch (error) {
      console.error("Save CV error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <CVContext.Provider value={{ cv, loading, fetchCV, saveCV }}>
      {children}
    </CVContext.Provider>
  );
}

export function useCV() {
  return useContext(CVContext);
}



