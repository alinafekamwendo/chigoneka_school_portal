import React from "react";

const Spinner = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-20 w-20 animate-spin rounded-full border-b-4 border-t-4 border-blue-500"></div>
    </div>
  );
};

export default Spinner;
