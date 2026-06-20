import { createServer } from "http";
import { env } from "./config/env";
import { createApp } from "./app";

const BRAND = "EliteBet";

const app = createApp(env);
const server = createServer(app);

server.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[${BRAND}] API listening on port ${env.PORT} (${env.NODE_ENV})`);
});
