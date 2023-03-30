import Express from "express";
import createHttpError from "http-errors";
import ReviewsModel from "../reviews/model.js";
import UsersModel from "./model.js";

const UsersRouter = Express.Router();

UsersRouter.post("/", async (req, res, next) => {
  try {
    const { userId } = await UsersModel.create(req.body);
    res.status(201).send({ userId });
  } catch (error) {
    next(error);
  }
});

UsersRouter.get("/", async (req, res, next) => {
  try {
    const { count, rows } = await UsersModel.findAndCountAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: {
        model: ReviewsModel,
        attributes: ["reviewId", "content"],
      },
    });
    res.send({ numberOfUsers: count, users: rows });
  } catch (error) {
    next(error);
  }
});

UsersRouter.get("/:userId", async (req, res, next) => {
  try {
    const user = await UsersModel.findByPk(req.params.userId, {
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: {
        model: ReviewsModel,
        attributes: ["reviewId", "content"],
      },
    });
    if (user) res.send(user);
    else
      next(
        createHttpError(404, `User with id ${req.params.userId} not found!`)
      );
  } catch (error) {
    next(error);
  }
});

UsersRouter.put("/:userId", async (req, res, next) => {
  try {
    const [numberOfUpdatedRows, updatedRecords] = await UsersModel.update(
      req.body,
      { where: { userId: req.params.userId }, returning: true }
    );
    if (numberOfUpdatedRows !== 0) res.send(updatedRecords[0]);
    else
      next(
        createHttpError(404, `User with id ${req.params.userId} not found!`)
      );
  } catch (error) {
    next(error);
  }
});

UsersRouter.delete("/:userId", async (req, res, next) => {
  try {
    const numberOfDeletedUsers = await UsersModel.destroy({
      where: { userId: req.params.userId },
    });
    if (numberOfDeletedUsers !== 0) res.status(204).send();
    else
      next(
        createHttpError(404, `User with id ${req.params.userId} not found!`)
      );
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default UsersRouter;
