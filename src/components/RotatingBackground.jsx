import './RotatingBackground.css';

const RotatingBackground = () => {
  return (
    <div className="rotating-bg" aria-hidden="true">
      <span className="rotating-bg__text">Salma</span>
      <span className="rotating-bg__text rotating-bg__text--reverse">Salma</span>
    </div>
  );
};

export default RotatingBackground;
