import environtment from "./loadEnvironment.js";
import debugCreator from "debug";
import chalk from "chalk";
import app from "./server/app.js";
import startServer from "./server/index.js";
import connectDb from "./database/index.js";

const debug = debugCreator("items:root");

const { port, mongoDbUrl } = environtment;

try {
  // eslint-disable-next-line no-implicit-coercion
  await startServer(app, +port);
  debug(chalk.green(`Server listening on http://localhost:${port}`));
  await connectDb(mongoDbUrl);
  debug(chalk.green(`Database connection success`));
} catch (error: unknown) {
  debug(chalk.red("Error starting the API: ", (error as Error).message));
}
