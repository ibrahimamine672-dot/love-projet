import './OceanWaves.css';

const OceanWaves = () => {
  return (
    <div className="ocean-waves" aria-hidden="true">
      {/* Layer 1 — slow, deep wave */}
      <svg
        className="ocean-waves__svg ocean-waves__svg--slow"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
      >
        <path
          className="ocean-waves__path--dark"
          d="M0,60 C360,120 720,0 1080,60 C1260,90 1350,50 1440,60 L1440,120 L0,120 Z"
        />
      </svg>

      {/* Layer 2 — medium, main wave */}
      <svg
        className="ocean-waves__svg"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
      >
        <path
          className="ocean-waves__path"
          d="M0,70 C240,20 480,110 720,70 C960,30 1200,100 1440,70 L1440,120 L0,120 Z"
        />
      </svg>

      {/* Layer 3 — fast, light wave */}
      <svg
        className="ocean-waves__svg ocean-waves__svg--fast"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
      >
        <path
          className="ocean-waves__path--light"
          d="M0,80 C180,40 360,100 540,80 C720,60 900,110 1080,80 C1260,50 1350,90 1440,80 L1440,120 L0,120 Z"
        />
      </svg>
    </div>
  );
};

export default OceanWaves;
