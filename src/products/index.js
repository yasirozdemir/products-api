import Express from "express";
import createHttpError from "http-errors";
import ProductsModel from "./model.js";
import { Op } from "sequelize";

const ProductsRouter = Express.Router();

ProductsRouter.post("/", async (req, res, next) => {
  try {
    const { productId } = await ProductsModel.create(req.body);
    res.status(201).send({ productId });
  } catch (error) {
    next(error);
  }
});

// // without search queries
// ProductsRouter.get("/", async (req, res, next) => {
//   try {
//     const { count, rows } = await ProductsModel.findAndCountAll();
//     res.send({ numberOfProducts: count, products: rows });
//   } catch (error) {
//     next(error);
//   }
// });

// with search queries
ProductsRouter.get("/", async (req, res, next) => {
  try {
    const searchQuery = {};
    if (req.query.minPrice || req.query.maxPrice) {
      const priceFilterArray = [];
      if (req.query.minPrice) {
        priceFilterArray.push(req.query.minPrice);
        searchQuery.price = { [Op.gte]: priceFilterArray };
      }
      if (req.query.maxPrice) {
        priceFilterArray.push(req.query.maxPrice);
        searchQuery.price = { [Op.lte]: priceFilterArray };
      }
      if (req.query.minPrice && req.query.maxPrice) {
        searchQuery.price = { [Op.between]: priceFilterArray };
      }
    }
    if (req.query.name) {
      searchQuery.name = { [Op.iLike]: `%${req.query.name}%` };
    }
    if (req.query.category) {
      searchQuery.category = { [Op.iLike]: req.query.category };
    }

    const { count, rows } = await ProductsModel.findAndCountAll({
      where: { ...searchQuery },
    });
    res.send({ numberOfProducts: count, products: rows });
  } catch (error) {
    next(error);
  }
});

ProductsRouter.get("/:productId", async (req, res, next) => {
  try {
    const product = await ProductsModel.findByPk(req.params.productId);
    // -> (...productId, { attributes: { exclude: ["createdAt", "updatedAt"] }) using attributes you can decide what to send or not to send as a response
    if (product) res.send(product);
    else
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found!`
        )
      );
  } catch (error) {
    next(error);
  }
});

ProductsRouter.put("/:productId", async (req, res, next) => {
  try {
    const [numberOfUpdatedRows, updatedRecords] = await ProductsModel.update(
      req.body,
      { where: { productId: req.params.productId }, returning: true }
    );
    if (numberOfUpdatedRows === 1) res.send(updatedRecords[0]);
    else
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found!`
        )
      );
  } catch (error) {
    next(error);
  }
});

ProductsRouter.delete("/:productId", async (req, res, next) => {
  try {
    const numberOfDeletedProducts = await ProductsModel.destroy({
      where: { productId: req.params.productId },
    });
    if (numberOfDeletedProducts) res.status(204).send();
    else
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found!`
        )
      );
  } catch (error) {
    next(error);
  }
});

export default ProductsRouter;
