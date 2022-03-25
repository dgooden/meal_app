const OUNCE_IN_GRAMS = 28.35;

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