import { Link } from "react-router-dom";
import "./Button.css";

function Button({
  children,
  to,
  type = "button",
  variant = "primary",
  size = "medium",
  onClick,
  disabled = false,
}) {
  const className = `custom-button custom-button-${variant} custom-button-${size}`;

  if (to) {
    return (
      <Link to={to} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;