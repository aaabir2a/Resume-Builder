"use client";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/protected-route";
import { useAuth } from "@/context/auth-context";
import { useCV } from "@/context/cv-context";

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { cv, loading: cvLoading } = useCV();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleCreateCV = () => {
    router.push("/cv/edit");
  };

  const handleEditCV = () => {
    router.push("/cv/edit");
  };

  const handleViewCV = () => {
    router.push("/cv/view");
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg p-6 bg-white">
              <h2 className="text-2xl font-semibold mb-4">Your CV</h2>

              {cvLoading ? (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : cv ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-lg font-medium">
                      {cv.personalInfo?.fullName || "Your CV"}
                    </h3>
                    <p className="text-gray-500">
                      {cv.personalInfo?.email || "No email provided"}
                    </p>
                    <p className="text-gray-500">
                      Last updated:{" "}
                      {new Date(cv.updatedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={handleEditCV}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Edit CV
                    </button>
                    <button
                      onClick={handleViewCV}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      View CV
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">
                    You haven't created a CV yet.
                  </p>
                  <button
                    onClick={handleCreateCV}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Create CV
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
