export function isEmptyString(str)
{
    return typeof str === "string" && !str.trim() || typeof str === "undefined" || str == null;
}