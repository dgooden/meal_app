import logger from "./logger.mjs";
import mysql from "mysql2/promise";

class DB
{
    constructor()
    {
        this.handle = null;
    }

    getHandle()
    {
        if ( typeof this.handle === "undefined" ) {
            this.handle = null;
        }
        if ( this.handle == null) {
            this.handle = mysql.createPool( {
                "host": "localhost",//process.env.MYSQL_HOST,
                "user": "mealuser",//process.env.MYSQL_USER,
                "password": "mealpass",//process.env.MYSQL_PASS,
                "database": "meal"
            });
            this.handle.on("connection", () => {});
            this.handle.on("release", () => {});
        }
        return this.handle;
    }

    async cleanup()
    {
        this.handle.end();
    }

    async select(sql,vars)
    {
        const funcName = "db.select";
        try {
            const pool = this.getHandle();
            const result = await pool.query(sql,vars);
            // return rows (result[0])
            return result[0];
        } catch(err) {
            logger.error(`${funcName} error:`,err.stack);
            throw err;
        }
    }

    // result[0].affectedRows
    // result[0].insertID
    async write(sql,vars)
    {
        const funcName = "db.write";
        try {
            const pool = this.getHandle();
            return await pool.query(sql,vars);
        } catch(err) {
            logger.error(`${funcName} error:`,err.stack);
            throw err;
        }
    }
}

export default new DB();