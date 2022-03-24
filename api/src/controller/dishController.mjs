import logger from "../utils/logger.mjs";
import {create as createDish, 
        update as updateDish,
        list as listDishes,
        find as findDish,
        remove as removeDish,
        getIngredients as getDishIngredients,
        getIngredient as getDishIngredient,
        addIngredient as addDishIngredient,
        removeIngredient as removeDishIngredient } from "../service/dishService.mjs";
import {handleError,doValidation,restError} from "./controllerCommon.mjs";
import {isEmptyObject} from "../utils/utils.mjs";

import Joi from "joi";

const LIMIT_MAX = 50;

export async function create(request,response)
{
    const funcName = "dishController.create";
    logger.funcStart(funcName,[request.body]);
    const schema = Joi.object({
        "name": Joi.string().min(1).required(),
        "portion": Joi.number().min(0),
        "portion_unit": Joi.any().valid("gram","ounce").required(),
        "ingredients": Joi.array().items( Joi.object({
            "id": Joi.number().min(0).required(),
            "number_servings": Joi.number().min(0).required()
        }))
    });
    try {
        let body = await doValidation(schema,request.body);
        const output = await createDish(body);
        logger.funcEnd(funcName,output);
        response.status(201).json(output);
    } catch(err) {
        handleError(response,funcName,err);
    }
}

export async function update(request,response)
{
    const funcName = "dishController.update";
    logger.funcStart(funcName,[request.body,request.params]);
    const schema = Joi.object({
        "name": Joi.string().min(1).required(),
        "portion": Joi.number().min(0),
        "portion_unit": Joi.any().valid("gram","ounce").required()
    });
    const paramsSchema = Joi.object({
        "dish_id": Joi.number().min(0).required()
    });

    try {
        let params = await doValidation(paramsSchema,request.params);
        let body = await doValidation(schema,request.body);

        const output = await updateDish(params.dish_id,body);
        logger.funcEnd(funcName,output);
        response.status(200).json(output);
    } catch(err) {
        handleError(response,funcName,err);
    }
}

export async function list(request,response)
{
    const funcName = "dishController.list";
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
        const output = await listDishes(query.limit,query.offset,query.sort,query.name);
        logger.funcEnd(funcName,output);
        response.status(200).json(output);
    } catch(err) {
        handleError(response,funcName,err);
    }
}

export async function find(request,response)
{
    const funcName = "dishController.find";
    logger.funcStart(funcName, [request.params]);
    const schema = Joi.object({
        "dish_id": Joi.number().min(0).required()
    });
    try {
        const params = await doValidation(schema,request.params);
        const output = await findDish(params.dish_id);
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
    const funcName = "dishController.remove";
    logger.funcStart(funcName, [request.params]);
    const schema = Joi.object({
        "dish_id": Joi.number().min(0).required()
    });
    try {
        const params = await doValidation(schema,request.params);
        const output = await removeDish(params.dish_id);
        logger.funcEnd(funcName,output);
        response.status(204).end();
    } catch(err) {
        handleError(response,funcName,err);
    }
}

export async function getIngredients(request,response)
{
    const funcName = "dishController.getIngredients";
    logger.funcStart(funcName, [request.params]);
    const schema = Joi.object( {
        "dish_id": Joi.number().min(0).required()
    });
    try {
        const params = await doValidation(schema,request.params);
        const output = await getDishIngredients(params.dish_id);
        if ( output.length <= 0 ) {
            restError(response,404,"Not found",funcName);
            return;
        }
        logger.funcEnd(funcName,output);
        response.status(200).json(output);
    } catch(err) {
        handleError(response,funcName,err);
    }
}

export async function getIngredient(request,response)
{
    const funcName = "dishController.getIngredient";
    logger.funcStart(funcName, [request.params]);
    const schema = Joi.object( {
        "dish_id": Joi.number().min(0).required(),
        "ingredient_id": Joi.number().min(0).required()
    });
    try {
        const params = await doValidation(schema,request.params);
        const dish = await findDish(params.dish_id);
        if ( isEmptyObject(dish) ) {
            restError(response,404,"Not found",funcName);
            return;
        }
        const output = await getDishIngredient(params.dish_id,params.ingredient_id);
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

export async function addIngredient(request,response)
{
    const funcName = "dishController.addIngredient";    
    logger.funcStart(funcName, [request.params,request.body]);
    const schema = Joi.object( {
        "id": Joi.number().min(0).required(),
        "number_servings": Joi.number().min(0).required()
    });
    const paramsSchema = Joi.object( {
        "dish_id": Joi.number().min(0).required()
    });
    try {
        const params = await doValidation(paramsSchema,request.params);
        const body = await doValidation(schema,request.body);
        // make sure dish exists
        const dish = await findDish(params.dish_id);
        if ( isEmptyObject(dish) ) {
            restError(response,404,"Not found",funcName);
            return;
        }
        // make sure this doesn't already exist
        const ingredient = await getDishIngredient(params.dish_id,body.id);
        if ( ! isEmptyObject(ingredient) ) {
            restError(response,400,"Already exists",funcName);
            return;
        }
        const output = await addDishIngredient(params.dish_id,body);
        logger.funcEnd(funcName,output);
        response.status(200).json(output);
    } catch(err) {
        handleError(response,funcName,err)
    }    
}

export async function removeIngredient(request,response)
{
    const funcName = "dishController.removeIngredient";
    logger.funcStart(funcName, [request.params]);
    const schema = Joi.object( {
        "dish_id": Joi.number().min(0).required(),
        "ingredient_id": Joi.number().min(0).required()   
    });
    try {
        const params = await doValidation(schema,request.params);
        // make sure dish exists
        const dish = await findDish(params.dish_id);
        if ( isEmptyObject(dish) ) {
            restError(response,404,"Not found",funcName);
            return;
        }
        await removeDishIngredient(params.dish_id,params.ingredient_id);
        logger.funcEnd(funcName);        
        response.status(204).end();
    } catch(err) {
        handleError(response,funcName,err)
    }    
}