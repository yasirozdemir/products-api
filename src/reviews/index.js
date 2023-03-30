import Express from "express";
import UsersModel from "../users/model.js";
import ReviewsModel from "./model.js";

const ReviewsRouter = Express.Router();

ReviewsRouter.post("/:productId/reviews", async (req, res, next) => {
  try {
    const { reviewId } = await ReviewsModel.create({
      ...req.body,
      productId: req.params.productId,
    });
    res.status(201).send({ reviewId });
  } catch (error) {
    next(error);
  }
});

ReviewsRouter.get("/:productId/reviews", async (req, res, next) => {
  try {
    const { count, rows } = await ReviewsModel.findAndCountAll({
      where: {
        productId: req.params.productId,
      },
      include: [
        {
          model: UsersModel,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
    });
    res.send({ numberOfReviews: count, reviews: rows });
  } catch (error) {
    next(error);
  }
});

// ReviewsRouter.get("/:id", async (req, res, next) => {
//   try {
//     res.send();
//   } catch (error) {
//     next(error);
//   }
// });

// ReviewsRouter.put("/:id", async (req, res, next) => {
//   try {
//     res.send();
//   } catch (error) {
//     next(error);
//   }
// });

// ReviewsRouter.delete("/:id", async (req, res, next) => {
//   try {
//     res.status(204).send();
//   } catch (error) {
//     next(error);
//   }
// });

export default ReviewsRouter;
