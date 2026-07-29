// Centralized error handling middleware
export const errorHandler = (err, req, res, next) => {
    console.error("Error:", err.stack);
  
    const statusCode = err.statusCode || 500;
    const message =
      err.message || "An unexpected error occurred on the server.";
  
    res.status(statusCode).json({
      success: false,
      error: message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  };
  