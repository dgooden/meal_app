import logger from "./utils/logger.mjs";

import { create as createIngredient, list as listIngredients, find as findIngredient, remove as removeIngredient, update as updateIngredient } from "./controller/ingredientController.mjs";
import { create as createDish,
         list as listDishes,
         find as findDish,
         remove as removeDish,
         update as updateDish,
         getIngredients as getDishIngredients,
         getIngredient as getDishIngredient,
         addIngredient as addDishIngredient,
         removeIngredient as removeDishIngredient } from "./controller/dishController.mjs";
//import https from "https";
//import fs from "fs";
import express from "express";
import cors from "cors";
import bodyparser from "body-parser";

logger.init("meal_api");

const app = express();
app.use(bodyparser.json());
app.use(cors());

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
app.get(   "/ingredient", (request,response) => listIngredients(request,response));
app.post(  "/ingredient", (request,response) => createIngredient(request,response));
app.get(   "/ingredient/:ingredient_id", (request,response) => findIngredient(request,response));
app.put(   "/ingredient/:ingredient_id", (request,response) => updateIngredient(request,response));
app.delete("/ingredient/:ingredient_id", (request,response) => removeIngredient(request,response));

app.get(   "/dish", (request, response) => listDishes(request,response));
app.post(  "/dish", (request, response) => createDish(request,response));
app.get(   "/dish/:dish_id", (request,response) => findDish(request,response));
app.put(   "/dish/:dish_id", (request,response) => updateDish(request,response));
app.delete("/dish/:dish_id", (request,response) => removeDish(request,response));

app.get(   "/dish/:dish_id/ingredient", (request,response) => getDishIngredients(request,response));
app.get(   "/dish/:dish_id/ingredient/:ingredient_id", (request,response) => getDishIngredient(request,response));
app.post(  "/dish/:dish_id/ingredient", (request,response) => addDishIngredient(request,response));
app.delete("/dish/:dish_id/ingredient/:ingredient_id", (request,response) => removeDishIngredient(request,response));

//const httpsServer = https.createServer( { "key": fs.readFileSync("../cert/server.key"), "cert": fs.readFileSync("../cert/server.cert") },app);
app.listen(8080, () => logger.info("listening on port 8080"));