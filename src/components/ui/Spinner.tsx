import React from "react";

const Spinner: React.FC = () => {
  return (
    <div className="spinner" role="status" aria-live="polite">
      <span className="sr-only">Loading...</span> {/* For screen readers */}
    </div>
  );
};

export default Spinner;
