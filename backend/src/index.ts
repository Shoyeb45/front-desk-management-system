import { app } from "./app";
import { errorHandler } from "./middlewares/error.middleware";
import { logger } from "./utils/logger";
import { config } from "./config/app.config";


import { router } from "./v1/routes/index";

app.use("/api/v1", router);

app.listen(config.port, () => {
    logger.info(`Server running on port ${config.port}`);
});

app.use(errorHandler);