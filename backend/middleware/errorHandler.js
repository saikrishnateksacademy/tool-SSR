// backend/middleware/errorHandler.js
import Joi from "joi";
const { ValidationError } = Joi;

export const errorHandler = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    return res.status(400).json({ error: err.details[0].message });
  }
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
};