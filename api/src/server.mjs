import logger from "./utils/logger.mjs";

import { create as createIngredient, list as listIngredients, find as findIngredient, remove as removeIngredient, update as updateIngredient } from "./controller/ingredientController.mjs";

import express from "express";
import bodyparser from "body-parser";

logger.init("meal_api");

const app = express();
app.use(bodyparser.json());

process.on("SIGINT", signalHandler);
process.on("SIGTERM", signalHandler);

process.on("uncaughtException", err => logger.error(`Exception: ${err.stack}`));

function signalHandler(signal,value)
{
    logger.info("received signal: ",signal);
    closeProcess(128+value);
}

async function closeProcess(exitCode)
{
    process.exit(exitCode);
}

// routes
app.get( "/ingredient", (request,response) => listIngredients(request,response));
app.post("/ingredient", (request,response) => createIngredient(request,response));

app.get(   "/ingredient/:ingredient_uuid", (request,response) => findIngredient(request,response));
app.put(   "/ingredient/:ingredient_uuid", (request,response) => updateIngredient(request,response));
app.delete("/ingredient/:ingredient_uuid", (request,response) => removeIngredient(request,response));

app.listen(8080, () => logger.info("listening on port 8080"));