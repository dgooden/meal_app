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

    async function onHandleDelete(ingredientUUID)
    {
        await deleteIngredient(ingredientUUID);
        const data = await getIngredients();
        setIngredientData(data);
    }

    React.useEffect( () => {
        async function getIngredientData()
        {
            const data = await getIngredients();
            setIngredientData(data)
        }
        getIngredientData();
    }, []);

    const ingredientList = ingredientData.map(ingredient => (
        <IngredientListItem
            key={ingredient.uuid}
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