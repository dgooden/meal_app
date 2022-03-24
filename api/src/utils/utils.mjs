export function isEmptyString(str)
{
    return typeof str === "string" && !str.trim() || typeof str === "undefined" || str == null;
}

export function isEmptyObject(obj)
{
    return ! Object.keys(obj).length;
}