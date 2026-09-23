import { useLocation, useNavigate } from "react-router-dom";

import "./BackButton.css";

function BackButton({ fallbackPath = "/", variant = "public" }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleBack = () => {
    if (location.key !== "default") {
      navigate(-1);
      return;
    }

    navigate(fallbackPath, { replace: true });
  };

  return (
    <button
      type="button"
      className={`back-button back-button-${variant}`}
      onClick={handleBack}
      aria-label="Go back"
      title="Go back"
    >
      <span aria-hidden="true">←</span>
    </button>
  );
}

export default BackButton;
