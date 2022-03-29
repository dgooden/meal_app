const BASEURL = "http://localhost:8080";

export async function getDishIngredient(dishID,ingredientID)
{
    let output = {
        "isError": false,
        "result": {}
    };
    try {
        const response = await fetch(`${BASEURL}/dish/${dishID}/ingredient/${ingredientID}`);
        if ( ! response.ok ) {
            output.isError = true;
            output.result = {
                "code": response.status,
                "errorMessage": response.statusText
            }
        } else {
            const result = await response.json();
            output.result = result;
        }
        return output;
    } catch(err) {
        console.log("Fetch error");
        output.isError = true;
        output.result = {
            "code": 500,
            "errorMessage": "A network error has occurred"
        };
        return output;
    }
}

export async function addDishIngredient(dishID,data)
{
    let output = {
        "isError": false,
        "result": {}
    };
    try {
        const response = await fetch(`${BASEURL}/dish/${dishID}/ingredient`, {
            "method": "POST",
            "cache": "no-cache",
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify(data)
        });        
        if ( ! response.ok ) {
            output.isError = true;
            output.result = {
                "code": response.status,
                "errorMessage": response.statusText
            }
        } else {
            const result = await response.json();
            output.result = result;
        }
        return output;
    } catch(err) {
        console.log("Fetch error");
        output.isError = true;
        output.result = {
            "code": 500,
            "errorMessage": "A network error has occurred"
        };
        return output;
    }
}

export async function updateDishIngredient(dishID,ingredientID,data)
{
    let output = {
        "isError": false,
        "result": {}
    };
    try {
        const response = await fetch(`${BASEURL}/dish/${dishID}/ingredient/${ingredientID}`, {
            "method": "PUT",
            "cache": "no-cache",
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify(data)
        });        
        if ( ! response.ok ) {
            output.isError = true;
            output.result = {
                "code": response.status,
                "errorMessage": response.statusText
            }
        } else {
            const result = await response.json();
            output.result = result;
        }
        return output;
    } catch(err) {
        console.log("Fetch error");
        output.isError = true;
        output.result = {
            "code": 500,
            "errorMessage": "A network error has occurred"
        };
        return output;
    }
}

export async function deleteDishIngredient(dishID,ingredientID)
{
    let output = {
        "isError": false,
        "result": {}
    };
    try {
        const response = await fetch(`${BASEURL}/dish/${dishID}/ingredient/${ingredientID}`, {
            "method": "DELETE",
            "cache": "no-cache"
        });        
        if ( ! response.ok ) {
            output.isError = true;
            output.result = {
                "code": response.status,
                "errorMessage": response.statusText
            }
        }
    } catch(err) {
        console.log("Fetch error");
        output.isError = true;
        output.result = {
            "code": 500,
            "errorMessage": "A network error has occurred"
        };
        return output;
    }
}


export async function getDish(id)
{
    const response = await fetch(`${BASEURL}/dish/${id}`);
    let data = await response.json();
    return data;
}

export async function getDishes(limit,offset)
{
    if ( typeof limit == "undefined" ) {
        limit = 100;
    }
    if ( typeof offset == "undefined" ) {
        offset = 0;       
    }    
    const response = await fetch(`${BASEURL}/dish?limit=${limit}&offset=${offset}`);
    const dishes = await response.json();
    return dishes;
}

export async function searchDishes(searchData)
{
    let param = "";
    if ( searchData !== "" ) {
        param = "?name=" + searchData;
    }
    const response = await fetch(`${BASEURL}/dish${param}`);
    const dishes = await response.json();
    return dishes;  
}

export async function createDish(dishData)
{
    let output = {
        "isError": false,
        "result": {}
    };   
    try {
        const response = await fetch(`${BASEURL}/dish`, {
            "method": "POST",
            "cache": "no-cache",
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify(dishData)
        });
        if ( ! response.ok ) {
            output.isError = true;
            output.result = {
                "code": response.status,
                "errorMessage": response.statusText
            };
            return output;
        } else {
            const result = await response.json();
            output.result = result;
            return output;
        }
    } catch(err) {
        console.log("Fetch error");
        output.isError = true;
        output.result = {
            "code": 500,
            "errorMessage": "A network error has occurred"
        };
        return output;
    }
}

export async function updateDish(dishData)
{
    let output = {
        "isError": false,
        "result": {}
    };
    try {
        const response = await fetch(`${BASEURL}/dish/${dishData.id}`, {
            "method": "PUT",
            "cache": "no-cache",
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify(dishData)
        });
        if ( ! response.ok ) {
            output.isError = true;
            output.result = {
                "code": response.status,
                "errorMessage": response.statusText
            };
        } else {
            const result = await response.json();
            output.result = result;
        }
        return output;
    } catch(err) {
        output.isError = true;
        output.result = {
            "code": 500,
            "errorMessage": "A network error has occurred"
        };
        return output;
    }
}

export async function deleteDish(id)
{
    await fetch(`${BASEURL}/dish/${id}`, { "method": "DELETE"});
    // FIXME handle errors
}

export async function getIngredient(id)
{
    const response = await fetch(`${BASEURL}/ingredient/${id}`);
    const data = await response.json();
    return data;
}

export async function getIngredients(limit,offset) 
{
    if ( typeof limit == "undefined" ) {
        limit = 100;
    }
    if ( typeof offset == "undefined" ) {
        offset = 0;       
    }
    const response = await fetch(`${BASEURL}/ingredient?limit=${limit}&offset=${offset}`);
    const data = await response.json();
    return data;
}    

export async function searchIngredients(searchData) 
{
    let param = "";
    if ( searchData !== "" ) {
        param = "?name=" + searchData;
    }
    const response = await fetch(`${BASEURL}/ingredient${param}`);
    const data = await response.json();
    return data;
}

export async function createIngredient(ingredientData)
{
    let output = {
        "isError": false,
        "result": {}
    };
    try {
        const response = await fetch(`${BASEURL}/ingredient`, {
            "method": "POST",
            "cache": "no-cache",
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify(ingredientData)
        });
        if ( ! response.ok ) {
            output.isError = true;
            output.result = {
                "code": response.status,
                "errorMessage": response.statusText
            };
        } else {
            const result = await response.json();
            output.result = result;
        }
        return output;
    } catch(err) {
        console.log("Fetch error");
        output.isError = true;
        output.result = {
            "code": 500,
            "errorMessage": "A network error has occurred"
        };
        return output;
    }  
}

export async function updateIngredient(ingredientData)
{
    let output = {
        "isError": false,
        "result": {}
    };    
    try {
        const response = await fetch(`${BASEURL}/ingredient/${ingredientData.id}`, {
            "method": "PUT",
            "cache": "no-cache",
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify(ingredientData)
        });
        if ( ! response.ok ) {
            output.isError = true;
            output.result = {
                "code": response.status,
                "errorMessage": response.statusText
            };
        } else {
            const result = await response.json();
            output.result = result;
        }
        return output;
    } catch(err) {
        console.log("Fetch error");
        output.isError = true;
        output.result = {
            "code": 500,
            "errorMessage": "A network error has occurred"
        };
        return output; 
    }
}

export async function deleteIngredient(id)
{
    await fetch(`${BASEURL}/ingredient/${id}`, { "method": "DELETE"});
}