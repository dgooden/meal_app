import logger from "../utils/logger.mjs";
import {create as createIngredient, list as listIngredients, find as findIngredient, remove as removeIngredient, update as updateIngredient } from "../service/ingredientService.mjs";
import {handleError,doValidation,restError} from "./controllerCommon.mjs";
import {isEmptyObject} from "../utils/utils.mjs";
import Joi from "joi";

const LIMIT_MAX = 50;

export async function create(request,response)
{
    const funcName = "ingredient.create";
    logger.funcStart(funcName,[request.body]);
    const schema = Joi.object({
        "name": Joi.string().min(1).required(),
        "serving_size": Joi.number().min(0).required(),
        "serving_unit": Joi.any().valid("gram","ounce","teaspoon","tablespoon").required(),
        "calories_per_serving": Joi.number().min(0).required()
    });

    try {
        let body = await doValidation(schema,request.body);
        const output = await createIngredient(body);
        logger.funcEnd(funcName,output);
        response.status(201).json(output);
    } catch(err) {
        handleError(response,funcName,err);
    }
}

export async function update(request,response)
{
    const funcName = "ingredient.update";
    logger.funcStart(funcName,[request.body,request.params]);
    const schema = Joi.object({
        "name": Joi.string().min(1).required(),
        "serving_size": Joi.number().min(0).required(),
        "serving_unit": Joi.any().valid("gram","ounce","teaspoon","tablespoon").required(),
        "calories_per_serving": Joi.number().min(0).required()
    });

    const paramsSchema = Joi.object({
        "ingredient_id": Joi.number().min(0).required()
    });

    try {
        let params = await doValidation(paramsSchema,request.params);
        let body = await doValidation(schema,request.body);
        const output = await updateIngredient(params.ingredient_id,body);
        logger.funcEnd(funcName,output);
        response.status(200).json(output);
    } catch(err) {
        handleError(response,funcName,err);
    }
}

export async function list(request,response)
{
    const funcName = "ingredientController.list";
    logger.funcStart(funcName, [request.query]);

    if ( typeof request.query.sort === "undefined" ) {
        request.query.sort = "name";
    }
    request.query.sort = request.query.sort.toLowerCase();
    request.query.sort = request.query.sort.replace(/\s+/g,'');
    request.query.sort = request.query.sort.split(',');

    const regex = new RegExp('^[-]?[a-zA-Z0-9_]+');
    const schema = Joi.object({
        "limit": Joi.number().integer().default(LIMIT_MAX),
        "offset": Joi.number().integer().greater(-1).default(0),
        "name": Joi.string(),
        "sort": Joi.array().items(
            Joi.string().regex(regex).messages({ "string.base": `Sort item should be a string`, "string.pattern.base": `Sort item should contain letters, numbers or underscore. It may begin with a '-'`})
        ).single()
    });

    try {
        let query = await doValidation(schema,request.query);
        if ( query.limit > LIMIT_MAX ) {
            query.limit = LIMIT_MAX;
        }
        const output = await listIngredients(query.limit,query.offset,query.sort,query.name);
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
        "ingredient_id": Joi.number().min(0).required()
    });
    try {
        const params = await doValidation(schema,request.params);
        const output = await findIngredient(params.ingredient_id);
        if ( isEmptyObject(output) ) {
            restError(response,404,"Not found",funcName);
            return;
        }
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
        "ingredient_id": Joi.number().min(0).required()
    });
    try {
        const params = await doValidation(schema,request.params);
        const ingredient = await findIngredient(params.ingredient.id);
        if ( isEmptyObject(ingredient) ) {
            restError(response,404,"Not found",funcName);
            return;
        }
        await removeIngredient(params.ingredient_id);
        logger.funcEnd(funcName);
        response.status(204).end();
    } catch(err) {
        handleError(response,funcName,err);
    }
}