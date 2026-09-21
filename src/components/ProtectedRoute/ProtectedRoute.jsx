import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../../services/auth/authService";

function ProtectedRoute({ children }) {
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] =
    useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        if (!currentUser) {
          setUser(null);
          setIsAdmin(false);
          setCheckingAuth(false);
          return;
        }

        try {
          const tokenResult =
            await currentUser.getIdTokenResult();

          setUser(currentUser);
          setIsAdmin(tokenResult.claims.admin === true);
        } catch (error) {
          console.error(
            "Admin claim check error:",
            error
          );

          setUser(null);
          setIsAdmin(false);
        } finally {
          setCheckingAuth(false);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  if (checkingAuth) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Arial, sans-serif",
          fontSize: "16px",
        }}
      >
        Checking authentication...
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  return children;
}

export default ProtectedRoute;