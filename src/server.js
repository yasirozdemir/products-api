import Express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import {
  badRequestHandler,
  genericErrorHandler,
  notFoundHandler,
} from "./errorHandlers.js";
import { pgConnect } from "./dbConfig.js";
import ProductsRouter from "./products/index.js";
import CategoriesRouter from "./categories/index.js";
import UsersRouter from "./users/index.js";
import ReviewsRouter from "./reviews/index.js";

const server = Express();
const port = process.env.PORT || 3001;

server.use(cors());
server.use(Express.json());

server.use("/products", ProductsRouter);
server.use("/categories", CategoriesRouter);
server.use("/users", UsersRouter);
server.use("/products", ReviewsRouter);

server.use(badRequestHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

await pgConnect();

server.listen(port, () => {
  console.table(listEndpoints(server));
});
