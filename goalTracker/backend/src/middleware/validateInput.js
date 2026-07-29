// middleware/validateInput.js
export const validateInput = (requiredFields = []) => {
    return (req, res, next) => {
      const missing = requiredFields.filter(field => !req.body[field]);
      if (missing.length > 0) {
        return res.status(400).json({
          message: `Missing required fields: ${missing.join(', ')}`,
        });
      }
      next();
    };
  };
  