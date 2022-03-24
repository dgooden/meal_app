import logger from "../utils/logger.mjs";

export function restError(response,httpCode,message,funcName)
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

export function handleError(response,funcName,err)
{
    if ( err.name === "ValidationError" ) {
        const errorMessage = formatValidationError(err.details);
        restError(response,400,errorMessage,funcName);
        return;
    }
    logger.error(funcName + " error: ", err.stack);
    restError(response,500,err.stack,funcName);    
}

export async function doValidation(schema,data)
{
    const options = {
        "errors": {
            "wrap": {
                "label": ""
            }
        },
        "stripUnknown": true
    };
    return await schema.validateAsync(data,options);
}