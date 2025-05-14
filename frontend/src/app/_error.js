import Link from "next/link";
import React from "react";

const ErrorPage = ({ statusCode }) => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>
        {statusCode
          ? `Error ${statusCode}`
          : "An unexpected error has occurred"}
      </h1>
      <p style={styles.message}>
        {statusCode
          ? "We're sorry, something went wrong on our end."
          : "We couldn't load the page you were looking for."}
      </p>
   
      <Link href="/about" style={styles.link}>
        Go to the about page
      </Link>
    </div>
  );
};

// Styling for the error page
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f4f4f4",
    fontFamily: "Arial, sans-serif",
    color: "#333",
  },
  heading: {
    fontSize: "3rem",
    marginBottom: "1rem",
  },
  message: {
    fontSize: "1.2rem",
    marginBottom: "2rem",
  },
  link: {
    fontSize: "1rem",
    color: "#0070f3",
    textDecoration: "none",
  },
};

// Capture the HTTP status code for rendering
ErrorPage.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default ErrorPage;
