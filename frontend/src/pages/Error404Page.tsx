import { Link } from "react-router-dom";

export default function Error404Page() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 px-4">
      <div className="bg-white/90 rounded-2xl shadow-2xl p-8 md:p-16 flex flex-col items-center">
        <div className="text-7xl md:text-9xl font-extrabold text-[#2A73FF] mb-2 animate-bounce">404</div>
        <div className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Page Not Found</div>
        <div className="text-gray-600 mb-6 text-center max-w-md">
          Oops! The page you are looking for does not exist or has been moved.<br />
          Try going back to the homepage or start a new code session.
        </div>
        <div className="flex gap-4">
          <Link
            to="/"
            className="px-6 py-2 bg-[#2A73FF] text-white rounded-md font-medium shadow hover:bg-blue-600 transition"
          >
            Go Home
          </Link>
        </div>
        </div>
      </div>
  )
}