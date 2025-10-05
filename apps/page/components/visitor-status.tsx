import { useState } from "react";
import { useVisitorAuth } from "../hooks/useVisitorAuth";
import VisitorAuthModal from "./visitor-auth-modal";

interface VisitorStatusProps {
  onAuthRequired?: () => void;
  showEmail?: boolean;
}

export default function VisitorStatus({
  onAuthRequired,
  showEmail = true,
}: VisitorStatusProps) {
  const { visitor, isLoading, isAuthenticated, logout } = useVisitorAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSignIn = () => {
    if (onAuthRequired) {
      onAuthRequired();
    } else {
      setShowAuthModal(true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
        <div className="w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-600 animate-pulse"></div>
        <span>Loading...</span>
      </div>
    );
  }

  if (isAuthenticated && visitor) {
    return (
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          {showEmail && (
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {visitor.email}
            </span>
          )}
        </div>
        <button
          onClick={logout}
          className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={handleSignIn}
        className="inline-flex items-center space-x-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
      >
        <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500"></div>
        <span>Sign in</span>
      </button>

      <VisitorAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}