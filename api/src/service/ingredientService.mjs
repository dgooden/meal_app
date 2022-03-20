import logger from "../utils/logger.mjs";
import { insert as mongoInsert, list as mongoList, find as mongoFind, remove as mongoRemove, update as mongoUpdate } from "../utils/mongo.mjs";

export async function create(data)
{
    const funcName = "ingredientService.create";
    logger.funcStart(funcName,data);
    try {
        await mongoInsert("ingredients",data);
    } catch(err) {
        logger.error(funcName + " error: ", err.stack);
        logger.funcEnd(funcName,err);
        throw err;
    }
}

export async function update(filter,data)
{
    const funcName = "ingredientService.update";
    logger.funcStart(funcName,[filter,data]);
    try {
        await mongoUpdate("ingredients",filter,data);
    } catch(err) {
        logger.error(funcName + " error: ", err.stack);
        logger.funcEnd(funcName,err);
        throw err;
    }
}

export async function list(limit,offset)
{
    const funcName = "ingredientService.list";
    logger.funcStart(funcName,[limit,offset]);
    try {
        return await mongoList("ingredients",{},limit,offset);
    } catch(err) {
        logger.error(funcName + " error: ", err.stack);
        logger.funcEnd(funcName,err);
        throw err;
    }
}

export async function find(filter)
{
    const funcName = "ingredientService.find";
    logger.funcStart(funcName,filter);
    try {
        return await mongoFind("ingredients",filter);
    } catch(err) {
        logger.error(funcName + " error: ", err.stack);
        logger.funcEnd(funcName,err);
        throw err;
    }
}

export async function remove(filter)
{
    const funcName = "ingredientService.remove";
    logger.funcStart(funcName,filter);
    try {
        return await mongoRemove("ingredients",filter);
    } catch(err) {
        logger.error(funcName + " error: ", err.stack);
        logger.funcEnd(funcName,err);
        throw err;
    }
}