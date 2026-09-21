import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../../services/auth/authService";

function StudentProtectedRoute({ children }) {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  if (checkingAuth) {
    return <div>Checking student login...</div>;
  }

  if (!user) {
    return (
      <Navigate
        to="/student/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return children;
}

export default StudentProtectedRoute;
