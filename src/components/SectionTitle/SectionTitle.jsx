import "./SectionTitle.css";

function SectionTitle({
  label,
  title,
  description,
  align = "center",
}) {
  return (
    <div className={`section-title-wrapper section-title-${align}`}>
      {label && <span className="section-title-label">{label}</span>}

      {title && <h2 className="section-title-heading">{title}</h2>}

      {description && (
        <p className="section-title-description">
          {description}
        </p>
      )}
    </div>
  );
}

export default SectionTitle;