import Express from "express";

const ProductsRouter = Express.Router();

ProductsRouter.post("/", async (req, res, next) => {
  try {
    res.status(201).send();
  } catch (error) {
    next(error);
  }
});

ProductsRouter.get("/", async (req, res, next) => {
  try {
    res.send();
  } catch (error) {
    next(error);
  }
});

ProductsRouter.get("/:productId", async (req, res, next) => {
  try {
    res.send();
  } catch (error) {
    next(error);
  }
});

ProductsRouter.put("/:productId", async (req, res, next) => {
  try {
    res.send();
  } catch (error) {
    next(error);
  }
});

ProductsRouter.delete("/:productId", async (req, res, next) => {
  try {
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default ProductsRouter;
