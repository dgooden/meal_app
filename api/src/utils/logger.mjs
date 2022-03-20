import os from "os";

import safeStringify from "fast-safe-stringify";

class Logger 
{
    constructor()
    {
        this._applicationName = "Unknown";
        this._hostName = os.hostname();
    }

    init(applicationName)
    {
        this._applicationName = applicationName;
    }

    _log(logObj)
    {
        let line = {
            "timestamp": new Date(Date.now()).toISOString(),
            "level": logObj.level.toUpperCase(),
            "message": logObj.message,
            "data": {},
            "hostname": this._hostName,
            "application": this._applicationName
        }
        if ( typeof logObj.data !== "undefined" ) {
            line.data = logObj.data;
        }
        console.log(safeStringify(line));
    }

    /**
     * @param {string} name
     */
    set applicationName(name)
    {
        this.applicationName = name;
    }

    info(message,data)
    {
        this._log({"level": "info", "message": message, "data": data});
    }

    error(message,data)
    {
        this._log({"level": "error", "message": message, "data": data});
    }

    funcStart(functionName,args)
    {
        if ( typeof args === "undefined" ) {
            args = [];
        }
        this.info("ENTER " + functionName);
        this.info("PARAMS " + functionName, args);
    }

    funcEnd(functionName,data)
    {
        if ( typeof data === "undefined" ) {
            data = {};
        }
        this.info("RESPONSE " + functionName, data);
        this.info("EXIT " + functionName);
    }
}

export default new Logger();