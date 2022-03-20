import logger from "./logger.mjs";
import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://mongoroot:mongopass@localhost:27017")

export async function insert(collectionName,document)
{
    const funcName = "mongo.insert";
    logger.funcStart(funcName,[collectionName,document]);

    try {
        await client.connect();
        const db = client.db("mealdb");
        const collection = db.collection(collectionName);
        const result = await collection.insertOne(document);
        logger.info("insert result:", result);
        logger.funcEnd(funcName,result);        
        return result;
    } catch(err) {
        logger.error(funcName + " error: ",err.stack);
        logger.funcEnd(funcName,err);
        throw err;
    } finally {
        client.close();
    }
}

export async function update(collectionName,filter,document)
{
    const funcName = "mongo.update";
    logger.funcStart(funcName,[collectionName,filter,document]);

    try {
        await client.connect();
        const db = client.db("mealdb");
        const collection = db.collection(collectionName);
        const result = await collection.replaceOne(filter,document);
        logger.info("update result:", result);
        logger.funcEnd(funcName,result);        
        return result;
    } catch(err) {
        logger.error(funcName + " error: ",err.stack);
        logger.funcEnd(funcName,err);
        throw err;
    } finally {
        client.close();
    }  
}

export async function list(collectionName,filter,limit,offset)
{
    const funcName = "mongo.list";
    logger.funcStart(funcName,[collectionName,filter,limit,offset]);

    try {
        await client.connect();
        const db = client.db("mealdb");
        const collection = db.collection(collectionName);
        const cursor = await collection.find(filter).limit(limit).skip(offset);
        let output = [];
        for await ( const doc of cursor) {
            output.push(doc);
        }
        logger.info("find result:", output);
        logger.funcEnd(funcName,output);        
        return output;
    } catch(err) {
        logger.error(funcName + " error: ",err.stack);
        logger.funcEnd(funcName,err);
        throw err;
    } finally {
        client.close();
    }   
}

export async function find(collectionName,filter)
{
    const funcName = "mongo.find";
    logger.funcStart(funcName,[collectionName,filter]);

    try {
        await client.connect();
        const db = client.db("mealdb");
        const collection = db.collection(collectionName);
        const result = await collection.findOne(filter);
        logger.info("find result:", result);
        logger.funcEnd(funcName,result);
        return result;
    } catch(err) {
        logger.error(funcName + " error: ",err.stack);
        logger.funcEnd(funcName,err);
        throw err;
    } finally {
        client.close();
    }   
}

export async function remove(collectionName,filter)
{
    const funcName = "mongo.remove";
    logger.funcStart(funcName,[collectionName,filter]);

    try {
        await client.connect();
        const db = client.db("mealdb");
        const collection = db.collection(collectionName);
        const result = await collection.findOneAndDelete(filter);
        logger.info("delete result:", result);
        logger.funcEnd(funcName,result);        
        return result;
    } catch(err) {
        logger.error(funcName + " error: ",err.stack);
        logger.funcEnd(funcName,err);
        throw err;
    } finally {
        client.close();
    }    
}