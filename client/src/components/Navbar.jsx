import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-surface border-b border-border h-16 flex items-center px-6">

      {/* Brand */}
      <div className="flex-1">
        <Link
          to={isAuthenticated ? "/dashboard" : "/"}
          className="text-xl font-semibold text-text-primary tracking-tight"
        >
          TalentLens<span className="text-primary">AI</span>
        </Link>
      </div>

      {/* Nav items */}
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <Link
              to="/dashboard"
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              Dashboard
            </Link>

            <button
              onClick={handleLogout}
              className="text-sm font-medium px-4 py-2 rounded-md border border-border text-text-secondary hover:text-danger hover:border-danger transition-colors cursor-pointer"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="text-sm font-medium px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-hover transition-colors"
            >
              Register
            </Link>
          </>
        )}
      </div>

    </nav>
  );
};

export default Navbar;