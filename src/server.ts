// src/server.ts
import app from "./app";
import { connectDB } from "./config/database";
import { redis } from "./config/redis";
import { env } from "./config/env";
import { startGraphQL } from "./graphql/server";

async function bootstrap() {
    try {
        await connectDB();

        await startGraphQL(app);

        const server = app.listen(env.PORT || 5000, () => {
            console.log(`Server: http://localhost:${env.PORT}`);
            console.log(`GraphQL: http://localhost:${env.PORT}/graphql`);
            console.log(`Redis status: ${redis.status}`);
          });

        process.on("SIGTERM", () => {
            console.log("SIGTERM received. Closing server...");
            server.close(() => {
                redis.disconnect();
                process.exit(0);
            });
        });

    } catch (error) {
        console.error("Bootstrap Error:", error);
        process.exit(1);
    }
}

bootstrap();