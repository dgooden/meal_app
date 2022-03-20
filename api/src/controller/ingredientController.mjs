import logger from "../utils/logger.mjs";
import {create as createIngredient, list as listIngredients, find as findIngredient, remove as removeIngredient, update as updateIngredient } from "../service/ingredientService.mjs";

import Joi from "joi";
import { v4 as uuidv4 } from "uuid";

const LIMIT_MAX = 50;

function restError(response,httpCode,message,funcName)
{
    if ( typeof httpCode === "undefined" ) {
        httpCode = 500;
    }
    logger.funcEnd(funcName,message);
    response.status(httpCode).json(message);
}

function formatValidationError(details)
{
    let output = {
        "error": "The following validation error(s) occurred:",
        "details": []
    }
    for ( const detail of details ) {
        output.details.push(detail.message);
    }
    return output;
}

function handleError(response,funcName,err)
{
    if ( err.name === "ValidationError" ) {
        const errorMessage = formatValidationError(err.details);
        restError(response,400,errorMessage,funcName);
        return;
    }
    logger.error(funcName + " error: ",err.stack);        
    restError(response,500,err.stack,funcName);    
}

async function doValidation(schema,data)
{
    const options = {
        "errors": {
            "wrap": {
                "label": ""
            }
        }
    };
    return await schema.validateAsync(data,options);
}

export async function create(request,response)
{
    const funcName = "ingredient.create";
    logger.funcStart(funcName,[request.body]);
    const schema = Joi.object({
        name: Joi.string().min(1).required(),
        description: Joi.string().default(""),
        serving_size: Joi.number().min(0).required(),
        serving_unit: Joi.any().valid("gram","ounce","teaspoon","tablespoon").required(),
        calories_per_serving: Joi.number().min(0).required()
    });

    try {
        let body = await doValidation(schema,request.body);
        body.uuid = uuidv4();
        logger.info("body:",body);
        await createIngredient(body);
        logger.funcEnd(funcName,body);
        response.status(201).json(body);
    } catch(err) {
        handleError(response,funcName,err);
    }
}

export async function update(request,response)
{
    const funcName = "ingredient.update";
    logger.funcStart(funcName,[request.body,request.params]);
    const schema = Joi.object({
        name: Joi.string().min(1).required(),
        description: Joi.string().default(""),
        serving_size: Joi.number().min(0).required(),
        serving_unit: Joi.any().valid("gram","ounce","teaspoon","tablespoon").required(),
        calories_per_serving: Joi.number().min(0).required()
    });

    const paramsSchema = Joi.object({
        "ingredient_uuid": Joi.string().uuid().required()
    });

    try {
        let params = await doValidation(paramsSchema,request.params);
        let body = await doValidation(schema,request.body);
        body.uuid = params.ingredient_uuid;
        logger.info("body:",body);
        await updateIngredient({"uuid": params.ingredient_uuid},body);
        logger.funcEnd(funcName,body);
        response.status(201).json(body);
    } catch(err) {
        handleError(response,funcName,err);
    }
}

export async function list(request,response)
{
    const funcName = "ingredientController.list";
    logger.funcStart(funcName, [request.query]);
    const schema = Joi.object({
            "limit": Joi.number().integer().default(LIMIT_MAX),
            "offset": Joi.number().integer().greater(-1).default(0)
    });
    try {
        const query = await doValidation(schema,request.query);
        if ( query.limit > LIMIT_MAX ) {
            query.limit = LIMIT_MAX;
        }
        logger.info("query:",query);
        const output = await listIngredients(query.limit,query.offset);
        logger.funcEnd(funcName,output);
        response.status(200).json(output);
    } catch(err) {
        handleError(response,funcName,err);
    }
}

export async function find(request,response)
{
    const funcName = "ingredientController.find";
    logger.funcStart(funcName, [request.params]);
    const schema = Joi.object({
            "ingredient_uuid": Joi.string().uuid().required()
    });
    try {
        const params = await doValidation(schema,request.params);
        logger.info("params:",params);
        const output = await findIngredient({uuid: params.ingredient_uuid});
        logger.funcEnd(funcName,output);
        response.status(200).json(output);
    } catch(err) {
        handleError(response,funcName,err);
    }
}

export async function remove(request,response)
{
    const funcName = "ingredientController.remove";
    logger.funcStart(funcName, [request.params]);
    const schema = Joi.object({
        "ingredient_uuid": Joi.string().uuid().required()
    });
    try {
        const params = await doValidation(schema,request.params);
        logger.info("params:",params);
        const output = await removeIngredient({uuid: params.ingredient_uuid});
        logger.funcEnd(funcName,output);
        response.status(204).end();
    } catch(err) {
        handleError(response,funcName,err);
    }
}