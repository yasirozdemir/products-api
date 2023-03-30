import Express from "express";
import CategoriesModel from "./model.js";

const CategoriesRouter = Express.Router();

CategoriesRouter.post("/", async (req, res, next) => {
  try {
    const { categoryId } = await CategoriesModel.create(req.body);
    res.status(201).send({ categoryId });
  } catch (error) {
    next(error);
  }
});

CategoriesRouter.get("/", async (req, res, next) => {
  try {
    const categories = await CategoriesModel.findAll({
      attributes: ["categoryId", "name"],
    });
    res.send(categories);
  } catch (error) {
    next(error);
  }
});

// CategoriesRouter.get("/:categoryId", async (req, res, next) => {
//   try {
//     res.send();
//   } catch (error) {
//     next(error);
//   }
// });

// CategoriesRouter.put("/:categoryId", async (req, res, next) => {
//   try {
//     res.send();
//   } catch (error) {
//     next(error);
//   }
// });

// CategoriesRouter.delete("/:categoryId", async (req, res, next) => {
//   try {
//     res.status(204).send();
//   } catch (error) {
//     next(error);
//   }
// });

export default CategoriesRouter;
