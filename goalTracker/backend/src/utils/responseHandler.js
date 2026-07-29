export const sendSuccess = (res, data, message = "Success", code = 200) => {
    return res.status(code).json({
      success: true,
      message,
      data,
    });
  };
  
  export const sendError = (res, message = "Server Error", code = 500) => {
    return res.status(code).json({
      success: false,
      message,
    });
  };
  