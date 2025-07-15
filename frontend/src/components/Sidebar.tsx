import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <nav className="flex justify-between items-center px-6 md:px-10 py-6 z-10 relative">
      <h1 className="text-xl md:text-2xl font-bold text-[#0550C0]">
        <Link to="/">{`<CodeTogether/>`}</Link>
      </h1>
      <Link
        to="/how"
        className="text-sm md:text-base underline underline-offset-4 decoration-2 opacity-80 hover:opacity-80 hover:text-blue-600 transition font-medium"
      >
        How to use
      </Link>
    </nav>
  );
}
