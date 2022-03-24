
export default class SQLBuilder
{
    constructor(sql,needWhere,useAnd,needOrder)
    {
        this.useAnd = false;
        this.needWhere = true;
        this.needOrder = true;
        if ( typeof needWhere !== "undefined" ) {
            this.needWhere = needWhere;
        }
        if ( typeof useAnd !== "undefined" ) {
            this.useAnd = useAnd;
        }
        if ( typeof needOrder !== "undefined" ) {
            this.needOrder = needOrder;
        }
        this.curSQL = sql;
        this.limit = null;
        this.order = null;
        this.query = "SELECT *";
        this.countQuery = "SELECT count(*) as total";
    }

    append(sql)
    {
        this.curSQL += sql;
    }

    appendSpace(sql)
    {
        this.curSQL += " " + sql;
    }

    appendAnd(sql)
    {
        if ( this.needWhere ) {
            this.curSQL += " WHERE";
            this.needWhere = false;
        }
        if ( this.useAnd ) {
            this.curSQL += " AND " + sql;
        } else {
            this.appendSpace(sql);
            this.useAnd = true;
        }
    }

    prepend(sql)
    {
        this.curSQL = sql + this.curSQL;
    }

    prependSpace(sql)
    {
        this.curSQL = sql + " " + this.curSQL;
    }

    appendOrder(column,direction)
    {
        if ( this.needOrder ) {
            this.order = " ORDER BY ";
            this.needOrder = false;
            this.order += column + " " + direction;
        } else {
            this.order += ", " + column + " " + direction;
        }
    }

    appendLimit(limit,offset)
    {
        if ( typeof offset !== "undefined" ) {
            this.limit = " LIMIT " + offset + ", " + limit;
        } else {
            this.limit = " LIMIT " + limit;
        }
    }

    setQuery(query)
    {
        this.query = query;
    }

    setCountQuery(query)
    {
        this.countQuery = query;
    }

    get()
    {
        let output = this.query + " ";
        output += this.curSQL;
        if ( this.order !== null ) {
            output += this.order;
        }
        if ( this.limit !== null ) {
            output += this.limit;
        }
        return output;
    }

    getCount()
    {
        return this.countQuery + " " + this.curSQL;
    }
}