const OUNCE_IN_GRAMS = 28.35;

export function isEmptyString(str)
{
    return typeof str === "string" && !str.trim() || typeof str === "undefined" || str == null;
}

export function isEmptyObject(obj)
{
    return ! Object.keys(obj).length;
}

export function convertOuncesToGrams(ounces)
{
    let grams = (ounces*OUNCE_IN_GRAMS);
    return grams.toFixed(2);
}

export function convertGramsToOunces(grams)
{
    let ounces = (grams/OUNCE_IN_GRAMS);
    return ounces.toFixed(2);
}