import React from "react";
import { PropagateLoader } from "react-spinners";

const Spinner = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      {/* <div className="h-20 w-20 animate-pulse rounded-full border-b-4 border-t-4 border-blue-500"></div> */}
      <PropagateLoader
        color="#3b82f6" // Tailwind CSS blue-500
        size={20} // Size of the spinner
        speedMultiplier={1} // Speed of the spinner
        className="flex justify-center items-center"
      />
    </div>
  );
};

export default Spinner;
