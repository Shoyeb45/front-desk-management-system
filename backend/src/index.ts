import { app } from "./app";
import { errorHandler } from "./middlewares/error.middleware";
import { logger } from "./utils/logger";
import { config } from "./config/app.config";

app.listen(config.port, () => {
    logger.info(`Server running on port ${config.port}`);
});

app.use(errorHandler);