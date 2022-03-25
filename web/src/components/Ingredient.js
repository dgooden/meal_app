import React from "react";
import { Link } from "react-router-dom";
import SearchForm from "./SearchForm.js"
import IngredientListItem from "./IngredientListItem.js";
import { deleteIngredient, getIngredients, searchIngredients } from "../fetchData.js";

export default function Ingredient(props)
{
    const [ ingredientData, setIngredientData ] = React.useState([]);
    
    async function onHandleSearchSubmit(searchData)
    {
        const data = await searchIngredients(searchData);
        setIngredientData(data);
    }

    async function onHandleDelete(ingredientID)
    {
        // delete ingredient from dishes
        await deleteIngredient(ingredientID);
        const ingredients = await getIngredients();
        setIngredientData(ingredients.data);
    }

    React.useEffect( () => {
        async function getIngredientData()
        {
            const ingredients = await getIngredients();
            setIngredientData(ingredients.data)
        }
        getIngredientData();
    }, []);

    const ingredientList = ingredientData.map(ingredient => (
        <IngredientListItem
            key={ingredient.id}
            data={ingredient}
            onDelete={onHandleDelete}
        />
    ));

    return (
        <div>
            <SearchForm
                onHandleSubmit={onHandleSearchSubmit}
            />
            <Link to="/addIngredient">
                <button type="button">Add Ingredient</button>
            </Link>
            {ingredientList}
        </div>
    )
}