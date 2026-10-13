// Handles requests to routes that do not exist
const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Route not found: ${req.method} ${req.originalUrl}`));
};

// Central error handler: converts known error types to clean JSON responses
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || 'Server error';

  // Mongoose validation errors -> 400 with the first readable message
  if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  }

  // Invalid ObjectId in a URL parameter
  if (err.name === 'CastError') {
    status = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Duplicate key (e.g. email already registered)
  if (err.code === 11000) {
    status = 409;
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    message = `${field} already exists`;
  }

  // Malformed JSON body
  if (err.type === 'entity.parse.failed') {
    status = 400;
    message = 'Invalid JSON in request body';
  }

  if (status === 500 && process.env.NODE_ENV !== 'test') console.error(err);

  res.status(status).json({
    message: status === 500 && process.env.NODE_ENV === 'production' ? 'Server error' : message,
  });
};

module.exports = { notFound, errorHandler };
