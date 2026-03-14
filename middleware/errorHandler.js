const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  console.error(err);

  if (err.name === 'CastError') {
    return res.status(404).json({ success: false, message: `Resource not found` });
  }

  if (err.code === 11000) {
    return res.status(400).json({ success: false, message: 'Duplicate field value entered' });
  }

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({ success: false, message: 'Validation Error', errors: messages });
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error'
  });
};

module.exports = errorHandler;
