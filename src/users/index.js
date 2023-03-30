import Express from "express";
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
        attributes: ["reviewId"],
      },
    });
    res.send({ numberOfUsers: count, users: rows });
  } catch (error) {
    next(error);
  }
});

// UsersRouter.get("/:id", async (req, res, next) => {
//   try {
//     res.send();
//   } catch (error) {
//     next(error);
//   }
// });

// UsersRouter.put("/:id", async (req, res, next) => {
//   try {
//     res.send();
//   } catch (error) {
//     next(error);
//   }
// });

// UsersRouter.delete("/:id", async (req, res, next) => {
//   try {
//     res.status(204).send();
//   } catch (error) {
//     next(error);
//   }
// });

export default UsersRouter;
