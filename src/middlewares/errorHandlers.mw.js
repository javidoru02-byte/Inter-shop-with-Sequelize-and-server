const createError = require("http-errors");
const {
  ValidationError,
  UniqueConstraintError,
  ForeignKeyConstraintError,
  DatabaseError,
} = require("sequelize");

const notFound = (req, res, next) => {
  next(createError(404, `Route ${req.method} ${req.originalUrl} not found`));
};

const sequelizeErrorHandler = (err, req, res, next) => {
  if (err instanceof UniqueConstraintError) {
    return next(
      createError(409, "Unique constraint violation", {
        details: err.errors.length
          ? err.errors.map((e) => e.message)
          : [err.parent?.detail || err.message],
      }),
    );
  }
  if (err instanceof ValidationError) {
    return next(
      createError(422, "Database validation failed", {
        details: err.errors.map((e) => e.message),
      }),
    );
  }
  if (err instanceof ForeignKeyConstraintError) {
    return next(
      createError(409, "Foreign key constraint violation", {
        details: [err.parent?.detail || err.message],
      }),
    );
  }
  if (err instanceof DatabaseError) {
    return next(createError(400, "Database error", { details: [err.message] }));
  }
  next(err);
};

const errorHandler = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({
    error: {
      status,
      message: status >= 500 ? "Internal server error" : err.message,
      ...(err.details && { details: err.details }),
    },
  });
};

module.exports = { notFound, sequelizeErrorHandler, errorHandler };
