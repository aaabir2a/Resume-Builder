import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">CV Builder</h1>
        </div>
      </header>

      <main>
        <div className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
          <div className="px-4 py-10 sm:px-0">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="text-center">
                  <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                    Create Your Professional CV
                  </h2>
                  <p className="mt-4 text-lg text-gray-500">
                    Build a professional CV in minutes. Easy to use,
                    customizable templates, and downloadable as PDF.
                  </p>
                  <div className="mt-8 flex justify-center">
                    <div className="inline-flex rounded-md shadow">
                      <Link
                        href="/register"
                        className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Get Started
                      </Link>
                    </div>
                    <div className="ml-3 inline-flex">
                      <Link
                        href="/login"
                        className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50"
                      >
                        Login
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900">
                      Easy to Use
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Our intuitive interface makes it simple to create a
                      professional CV in minutes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900">
                      Save Your Progress
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Work on your CV at your own pace. Your progress is
                      automatically saved.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900">
                      Download as PDF
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Export your CV as a professional PDF document ready to
                      share with employers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="mt-8 border-t border-gray-200 pt-8 md:flex md:items-center md:justify-between">
            <div className="mt-8 md:mt-0 md:order-1">
              <p className="text-center text-base text-gray-400">
                &copy; 2023 CV Builder. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
