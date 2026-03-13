import express, { Request, Response } from "express";
import { globalErrorHandler } from "./middlewares/error.middleware";
import helmet from "helmet";
import hpp from "hpp";
import cors from "cors";
import { generalLimiter } from "./middlewares/rateLimitter.middleware";
import rootRouter from "./routes";

const app = express();

app.use(helmet());
app.use(cors());
app.use(hpp());
app.use(generalLimiter)
app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "Api is running!",
    });
});

app.use("/api/v1", express.json(), rootRouter);
app.use(globalErrorHandler);

export default app;