import "./Loader.css";

function Loader({ text = "Loading..." }) {
  return (
    <div className="loader-wrapper">
      <div className="loader-spinner"></div>

      {text && <p className="loader-text">{text}</p>}
    </div>
  );
}

export default Loader;