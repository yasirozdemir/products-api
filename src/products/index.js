import Express from "express";
import createHttpError from "http-errors";
import ProductsModel from "./model.js";
import { filterProductsMw } from "../lib/middlewares.js";

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
ProductsRouter.get("/", filterProductsMw, async (req, res, next) => {
  try {
    const { count, rows } = await ProductsModel.findAndCountAll({
      where: { ...res.searchQuery },
      limit: req.query.limit,
      offset: req.query.offset,
      order: [
        [
          req.query.orderby ? req.query.orderby : "createdAt",
          req.query.direction ? req.query.direction.toUpperCase() : "ASC",
        ],
      ],
    });
    let response = {
      numberOfProducts: count,
      products: rows,
    };
    const fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
    if (req.query.limit) {
      const links = {};
      if (req.query.offset) {
        if (parseInt(req.query.offset) !== 0) {
          if (parseInt(req.query.offset) - parseInt(req.query.limit) < 0) {
            links.prev = fullUrl.replace(
              `offset=${req.query.offset}`,
              "offset=0"
            );
          } else {
            links.prev = fullUrl.replace(
              `offset=${req.query.offset}`,
              `offset=${parseInt(req.query.offset) - parseInt(req.query.limit)}`
            );
          }
        }
        links.next = fullUrl.replace(
          `offset=${req.query.offset}`,
          `offset=${parseInt(req.query.offset) + parseInt(req.query.limit)}`
        );
      } else {
        links.next = `${fullUrl}&offset=${parseInt(req.query.limit)}`;
      }
      response = {
        numberOfPages: Math.ceil(count / req.query.limit),
        links,
        ...response,
      };
    } else if (req.query.offset) {
      response = {
        links: {
          prev: fullUrl.replace(`offset=${req.query.offset}`, "offset=0"),
        },
        ...response,
      };
    }
    res.send(response);
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
