import { ValidationError } from "sequelize";

export const badRequestHandler = (err, req, res, next) => {
  if (err.status === 400) {
    res.status(400).send({
      message: err.message,
    });
  } else if (err instanceof ValidationError) {
    res.status(400).send({ message: err.errors.map((e) => e.message) });
  } else next(err);
};

export const notFoundHandler = (err, req, res, next) => {
  if (err.status === 404) {
    res.status(404).send({
      message: err.message,
    });
  } else next(err);
};

export const genericErrorHandler = (err, req, res, next) => {
  console.log("ERROR: ", err.message, err);
  res.status(500).send({
    message: "A problem occured caused by the server!",
  });
};
