import Koa from "koa";
import { config } from "dotenv";
import KoaViews from "koa-views";
import { router } from "../routes";
import UptimeRobotService from "../services/uptimerobot";
import { join } from "path";
import { logger } from "../lib/logger";
import KoaStatic from "koa-static";
import { mountConfig } from "./config";
config();
const app = new Koa();

// mount service
app.context.services = {
  uptimerobot: new UptimeRobotService(process.env.UPTIME_ROBOT_API)
};

mountConfig(app);

// views
app.use(
  KoaViews(join(__dirname, "../../public/views"), {
    extension: "pug"
  })
);

app.use(KoaStatic(join(__dirname, "../../public/assets")));

// routes
app.use(router.routes());

// start server
const port = process.env.PAGE_PORT || 3000;
app.listen(port, function() {
  logger.info("Server start at", port);
});
