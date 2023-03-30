import Express from "express";
import createHttpError from "http-errors";
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
      attributes: { exclude: ["userId"] },
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

ReviewsRouter.get("/:productId/reviews/:reviewId", async (req, res, next) => {
  try {
    const review = await ReviewsModel.findByPk(req.params.reviewId, {
      attributes: { exclude: ["userId"] },
      include: [
        {
          model: UsersModel,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
    });
    if (review) res.send({ review });
    else
      next(
        createHttpError(404, `Review with id ${req.params.reviewId} not found!`)
      );
  } catch (error) {
    next(error);
  }
});

ReviewsRouter.put("/:productId/reviews/:reviewId", async (req, res, next) => {
  try {
    const [numberOfUpdatedRows, updatedRecords] = await ReviewsModel.update(
      req.body,
      { where: { reviewId: req.params.reviewId }, returning: true }
    );
    if (numberOfUpdatedRows !== 0) res.send(updatedRecords[0]);
    else
      next(
        createHttpError(404, `Review with id ${req.params.reviewId} not found!`)
      );
  } catch (error) {
    next(error);
  }
});

ReviewsRouter.delete(
  "/:productId/reviews/:reviewId",
  async (req, res, next) => {
    try {
      const numberOfDeletedReviews = await ReviewsModel.destroy({
        where: { reviewId: req.params.reviewId },
      });
      if (numberOfDeletedReviews !== 0) res.status(204).send();
      else
        next(
          createHttpError(
            404,
            `Review with id ${req.params.reviewId} not found!`
          )
        );
    } catch (error) {
      next(error);
    }
  }
);

export default ReviewsRouter;
