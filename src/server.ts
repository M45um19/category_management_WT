import app from "./app";
import { connectDB } from "./config/database";
import { redis } from "./config/redis";
import { env } from "./config/env";

const PORT = env.PORT || 5000;

async function start() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Redis status: ${redis.status}`);
});
}

start();