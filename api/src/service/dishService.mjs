import logger from "../utils/logger.mjs";
import db from "../utils/db.mjs";
import SQLBuilder from "../utils/SQLBuilder.mjs";
import { convertOuncesToGrams } from "../utils/utils.mjs";


function handleSort(sort)
{
    let output = [];
    for ( const data of sort ) {
        if ( data[0] == "-"  ) {
            output.push({ "key": data.substr(1), "dir": "DESC" });
        } else {
            output.push({ "key": data, "dir": "ASC" });
        }
    }
    return output;
}

function calculateTotalWeightInGrams(total_weight,total_weight_unit)
{
    switch(total_weight_unit)
    {
        case "gram": 
            return total_weight;
        case "ounce":
            return convertOuncesToGrams(total_weight);
    }
    return 0;
}

async function getIngredientDataByID(ingredientID)
{
    const funcName = "dishService.getIngredientDataByID";
    logger.funcStart(funcName,[ingredientID]);    
    try {
        let output = {};
        const sql = "SELECT * FROM ingredient WHERE id = ?";
        const rows = await db.select(sql,[ingredientID]);
        if ( rows.length ) {
            const row = rows[0];
            output = row;
        }
        return output;
    } catch(err) {
        logger.error(funcName + " error: ", err.stack);
        logger.funcEnd(funcName,err);
        throw err;
    }
}

async function getIngredientsForDish(dishID)
{
    const funcName = "dishService.getIngredientsForDish";
    logger.funcStart(funcName,[dishID]);
    try {
        let output = [];
        let sql = "SELECT * from dish_ingredient WHERE dish_id = ?";
        let rows = await db.select(sql,dishID);
        for ( const row of rows ) {
            let ingredientData = await getIngredientDataByID(row.ingredient_id);
            ingredientData.number_servings = row.number_servings;
            output.push(ingredientData);
        }
        logger.funcEnd(funcName,output);
        return output;
    } catch(err) {
        logger.error(funcName + " error: ", err.stack);
        logger.funcEnd(funcName,err);
        throw err;
    }
}

export async function create(data)
{
    const funcName = "dishService.create";
    logger.funcStart(funcName,data);
    try {
        let sql = "INSERT INTO dish (name,total_weight,total_weight_unit) VALUES (?,?,?)";
        const result = await db.write(sql,[data.name,data.total_weight,data.total_weight_unit]);
        const dishID = result[0].insertId;
        for ( const ingredient of data.ingredients ) {
            sql = "INSERT INTO dish_ingredient (dish_id,ingredient_id,number_servings) VALUES (?,?,?)";
            await db.write(sql,[dishID,ingredient.id,ingredient.number_servings]);
        }
        const output = await find(dishID);
        logger.funcEnd(funcName,output);
        return output;
    } catch(err) {
        logger.error(funcName + " error: ", err.stack);
        logger.funcEnd(funcName,err);
        throw err;
    }
}

export async function update(dishID,data)
{
    const funcName = "dishService.update";
    logger.funcStart(funcName,[dishID,data]);
    try {
        const sql = "UPDATE dish SET name = ?, total_weight = ?, total_weight_unit = ? WHERE id = ?";
        await db.write(sql,[data.name,data.total_weight,data.total_weight_unit,dishID]);

        const output = await find(dishID);
        logger.funcEnd(funcName,output);
        return output;
    } catch(err) {
        logger.error(funcName + " error: ", err.stack);
        logger.funcEnd(funcName,err);
        throw err;
    }
}

export async function list(limit,offset,sort,name)
{
    const funcName = "dishService.list";
    logger.funcStart(funcName,[limit,offset,sort,name]);
    try {
        sort = handleSort(sort);
        const sb = new SQLBuilder("FROM `dish`");
        sb.setQuery("SELECT *");
        sb.setCountQuery("SELECT count(*) as total");

        if ( typeof name !== "undefined" && name != null ) {
            sb.appendAnd("`name` LIKE '%"+name+"%'");
        }
        for ( const sortItem of sort ) {
            sb.appendOrder(sortItem.key,sortItem.dir);
        }
        sb.appendLimit(limit,offset);
        const sql = sb.get();
        const countSQL = sb.getCount();
        console.log(sql);
        console.log(countSQL);

        const countRows = await db.select(countSQL);
        const totalCount = countRows[0].total;
        console.log("total count:",totalCount);
        const rows = await db.select(sql);
        const pageCount = rows.length;
        console.log("page count",pageCount);
        let output = {
            "totalCount": totalCount,
            "currentCount": pageCount,
            "data" : []
        };
        for ( const row of rows ) {
            row.ingredients = await getIngredientsForDish(row.id);
            row.total_weight_in_grams = calculateTotalWeightInGrams(row.total_weight,row.total_weight_unit);
            output.data.push(row);
        }
        logger.funcEnd(funcName,output);
        return output;        
    } catch(err) {
        logger.error(funcName + " error: ", err.stack);
        logger.funcEnd(funcName,err);
        throw err;
    }
}

export async function find(dishID)
{
    const funcName = "dishService.find";
    logger.funcStart(funcName,dishID);
    try {
        let output = {};
        const sql = "SELECT * FROM dish WHERE id = ?";
        const rows = await db.select(sql,[dishID]);
        if ( rows.length ) {
            let row = rows[0];
            row.ingredients = await getIngredientsForDish(dishID);
            row.total_weight_in_grams = calculateTotalWeightInGrams(row.total_weight,row.total_weight_unit);
            output = row;
        }
        return output;
    } catch(err) {
        logger.error(funcName + " error: ", err.stack);
        logger.funcEnd(funcName,err);
        throw err;
    }
}

export async function remove(dishID)
{
    const funcName = "dishService.remove";
    logger.funcStart(funcName,dishID);
    try {
        const sql = "DELETE FROM dish WHERE id = ?";
        await db.write(sql,[dishID]);
    } catch(err) {
        logger.error(funcName + " error: ", err.stack);
        logger.funcEnd(funcName,err);
        throw err;
    }
}

export async function getIngredients(dishID)
{
    const funcName = "dishService.getIngredients";
    logger.funcStart(funcName,dishID);
    try {
        const output = await getIngredientsForDish(dishID);
        logger.funcEnd(funcName,output);
        return output;
    } catch(err) {
        logger.error(funcName + " error: ", err.stack);
        logger.funcEnd(funcName,err);
        throw err;
    }    
}

export async function getIngredient(dishID,ingredientID)
{
    const funcName = "dishService.getIngredient";
    logger.funcStart(funcName,[dishID,ingredientID]);
    try {
        let output = {}
        const ingredients = await getIngredientsForDish(dishID);
        if ( ingredients.length > 0 ) {
            for ( const ingredient of ingredients ) {
                if ( ingredient.id == ingredientID ) {
                    output = ingredient;
                    break;
                }
            }
        }
        logger.funcEnd(funcName,output);
        return output;
    } catch(err) {
        logger.error(funcName + " error: ", err.stack);
        logger.funcEnd(funcName,err);
        throw err;
    }    
}

export async function addIngredient(dishID,data)
{
    const funcName = "dishService.addIngredient";
    logger.funcStart(funcName,[dishID,data]);
    try {
        const sql = "INSERT INTO dish_ingredient (dish_id,ingredient_id,number_servings) VALUES (?,?,?)";
        await db.write(sql,[dishID,data.id,data.number_servings]);
        const output = await find(dishID);
        logger.funcEnd(funcName,output);
        return output;
    } catch(err) {
        logger.error(funcName + " error: ", err.stack);
        logger.funcEnd(funcName,err);
        throw err;
    }   
}

export async function updateIngredient(dishID,ingredientID,number_servings)
{
    const funcName = "dishService.updateIngredient";
    logger.funcStart(funcName,[dishID,ingredientID,number_servings]);
    try {
        const sql = "UPDATE dish_ingredient SET number_servings = ? WHERE dish_id =? AND ingredient_id =?";
        await db.write(sql,[number_servings,dishID,ingredientID]);
        const output = await find(dishID);
        logger.funcEnd(funcName,output);
        return output;
    } catch(err) {
        logger.error(funcName + " error: ", err.stack);
        logger.funcEnd(funcName,err);
        throw err;
    }  
}

export async function removeIngredient(dishID,ingredientID)
{
    const funcName = "dishService.removeIngredient";
    logger.funcStart(funcName,[dishID,ingredientID]);
    try {
        const sql = "DELETE FROM dish_ingredient WHERE dish_id = ? AND ingredient_id = ?";
        await db.write(sql,[dishID,ingredientID]);
        logger.funcEnd(funcName);
    } catch(err) {
        logger.error(funcName + " error: ", err.stack);
        logger.funcEnd(funcName,err);
        throw err;
    }   
}