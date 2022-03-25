import logger from "../utils/logger.mjs";
import db from "../utils/db.mjs";
import { convertOuncesToGrams } from "../utils/utils.mjs";

import SQLBuilder from "../utils/SQLBuilder.mjs";

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

function calculateServingSizeInGrams(serving_size,serving_unit)
{
    switch(serving_unit) {
        case "teaspoon":
        case "tablespoon":
            return 0;
        case "gram":
            return serving_size;
        case "ounce":
            return convertOuncesToGrams(serving_size);
    }
    return 0;
}

export async function create(data)
{
    const funcName = "ingredientService.create";
    logger.funcStart(funcName,data);
    try {
        const sql = "INSERT INTO ingredient (name,serving_size,serving_unit,calories_per_serving) VALUES (?,?,?,?)";
        const result = await db.write(sql,[data.name,data.serving_size,data.serving_unit,data.calories_per_serving]);
        const ingredientID = result[0].insertId;
        const output = await find(ingredientID);
        logger.funcEnd(funcName,output);
        return output;
    } catch(err) {
        logger.error(funcName + " error: ", err.stack);
        logger.funcEnd(funcName,err);
        throw err;
    }
}

export async function update(ingredientID,data)
{
    const funcName = "ingredientService.update";
    logger.funcStart(funcName,[ingredientID,data]);
    try {
        const sql = "UPDATE ingredient SET name = ?, serving_size = ?, serving_unit = ?, calories_per_serving = ? WHERE id = ?";
        await db.write(sql,[data.name,data.serving_size,data.serving_unit,data.calories_per_serving,ingredientID]);
        const output = await find(ingredientID);
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
    const funcName = "ingredientService.list";
    logger.funcStart(funcName,[limit,offset,sort,name]);
    try {
        sort = handleSort(sort);
        const sb = new SQLBuilder("FROM `ingredient`");        
        sb.setQuery("SELECT *");
        sb.setCountQuery("SELECT count(*) as total");        

        if ( typeof name !== "undefined" && name != null ) {
            sb.appendAnd("`name` LIKE '%" + name + "%'");
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
        const rows = await db.select(sql);
        const pageCount = rows.length;
        let output = {
            "totalCount": totalCount,
            "currentCount": pageCount,
            "data": []
        };
        for ( const row of rows ) {

            row.serving_size_in_grams = calculateServingSizeInGrams(row.serving_size,row.serving_unit);
            output.data.push(row);
        }
        return output;
    } catch(err) {
        logger.error(funcName + " error: ", err.stack);
        logger.funcEnd(funcName,err);
        throw err;
    }
}

export async function find(ingredientID)
{
    const funcName = "ingredientService.find";
    logger.funcStart(funcName,ingredientID);
    try {
        let output = {};
        const sql = "SELECT * FROM ingredient WHERE id = ?";
        const rows = await db.select(sql,[ingredientID]);
        if ( rows.length ) {
            output = rows[0];
            output.serving_size_in_grams = calculateServingSizeInGrams(output.serving_size,output.serving_unit);

        }
        return output;
    } catch(err) {
        logger.error(funcName + " error: ", err.stack);
        logger.funcEnd(funcName,err);
        throw err;
    }
}

export async function remove(ingredientID)
{
    const funcName = "ingredientService.remove";
    logger.funcStart(funcName,ingredientID);
    try {
        const sql = "DELETE FROM ingredient WHERE id = ?";
        await db.write(sql,[ingredientID]);
        logger.funcEnd(funcName);
    } catch(err) {
        logger.error(funcName + " error: ", err.stack);
        logger.funcEnd(funcName,err);
        throw err;
    }
}