import "./Card.css";

function Card({
  children,
  title,
  description,
  icon,
  className = "",
}) {
  return (
    <div className={`custom-card ${className}`}>
      {icon && <div className="custom-card-icon">{icon}</div>}

      {title && <h3 className="custom-card-title">{title}</h3>}

      {description && (
        <p className="custom-card-description">
          {description}
        </p>
      )}

      {children}
    </div>
  );
}

export default Card;