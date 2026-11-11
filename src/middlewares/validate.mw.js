const createError = require("http-errors");

const validate =
  (schema, source = "body") =>
  async (req, res, next) => {
    try {
      const value = await schema.validate(req[source] ?? {}, {
        abortEarly: false,
        stripUnknown: true,
      });
      if (source === "query") {
        req.validatedQuery = value;
      } else {
        req[source] = value;
      }
      next();
    } catch (error) {
      if (error.name === "ValidationError") {
        return next(createError(400, "Validation failed", { details: error.errors }));
      }
      next(error);
    }
  };

module.exports = validate;
