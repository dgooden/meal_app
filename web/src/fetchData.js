const BASEURL = "http://localhost:8080";

async function getDishIngredients(dishData)
{
    for ( let i=0; i<dishData.ingredients.length; i++ ) {
        const ingredient = dishData.ingredients[i];
        const ingredientResponse = await fetch(`${BASEURL}/ingredient/${ingredient.uuid}`);
        const ingredientData = await ingredientResponse.json();
        dishData.ingredients[i] = {
            ...ingredient,
            ...ingredientData
        }
    }
    return dishData;
}

export async function getDish(uuid)
{
    const response = await fetch(`${BASEURL}/dish/${uuid}`);
    let data = await response.json();
    data = await getDishIngredients(data);
    console.log("getDish:",data);
    return data;
}

export async function getDishes()
{
    const response = await fetch(`${BASEURL}/dish`);
    let dishes = await response.json();
    for ( let i=0; i<dishes.length; i++ ) {
        dishes[i] = await getDishIngredients(dishes[i]);
    }
    return dishes;
}

export async function searchDishes(searchData)
{
    let param = "";
    if ( searchData !== "" ) {
        param = "?name=" + searchData;
    }
    const response = await fetch(`${BASEURL}/dish${param}`);
    let dishes = await response.json();
    for ( let i=0; i<dishes[i]; i++ ) {
        dishes[i] = await getDishIngredients(dishes[i]);
    }
    return dishes;  
}

export async function createDish(dishData)
{
    let output = {
        "isError": false,
        "result": {}
    };
    console.log("updateDish:",dishData);    
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
    console.log("updateDish:",dishData);

    try {
        const response = await fetch(`${BASEURL}/dish/${dishData.uuid}`, {
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
            return output;
        } else {
            const result = await response.json();
            output.result = result;
            return output;
        }
    } catch(err) {
        output.isError = true;
        output.result = {
            "code": 500,
            "errorMessage": "A network error has occurred"
        };
        return output;
    }
}

export async function deleteDish(uuid)
{
    await fetch(`${BASEURL}/dish/${uuid}`, { "method": "DELETE"});
    // FIXME handle errors
}

export async function getIngredient(uuid)
{
    const response = await fetch(`${BASEURL}/ingredient/${uuid}`);
    const data = await response.json();
    return data;
}

export async function getIngredients() 
{
    const response = await fetch(`${BASEURL}/ingredient`);
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
            console.log("Not added");
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

export async function updateIngredient(ingredientData)
{
    let output = {
        "isError": false,
        "result": {}
    };    
    try {
        const response = await fetch(`${BASEURL}/ingredient/${ingredientData.uuid}`, {
            "method": "PUT",
            "cache": "no-cache",
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify(ingredientData)
        });
        if ( ! response.ok ) {
            console.log("Not added");
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

export async function deleteIngredient(uuid)
{
    await fetch(`${BASEURL}/ingredient/${uuid}`, { "method": "DELETE"});
}