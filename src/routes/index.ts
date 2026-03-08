import { Router } from "express";
import categoryRoutes from "../modules/category/category.routes";

const rootRouter = Router();

const moduleRoutes = [
  {
    path: "/categories",
    route: categoryRoutes,
  },
];

moduleRoutes.forEach((route) => rootRouter.use(route.path, route.route));

export default rootRouter;