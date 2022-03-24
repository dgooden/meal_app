import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { getIngredient, getDish, updateDish } from "../fetchData";

export default function EditDishIngredient()
{
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state;
    const { dishUUID, ingredientUUID } = state;

    console.log("dishUUID:",dishUUID);
    console.log("ingredientUUID:",ingredientUUID);

    const [ ingredientData, setIngredientData ] = React.useState({});
    const [ dishData, setDishData ] = React.useState({});
    const [ ingredientServings, setIngredientServings ] = React.useState(0);

    function onHandleChange(event)
    {
        const { name, value } = event.target;
        if ( name == "number_servings" ) {
            setIngredientServings(value);
        }
    }

    async function updateDishIngredient(ingredientUUID)
    {
        let found = false;
        const newDishData = {...dishData};
        for ( let i=0; i<newDishData.ingredients.length; i++) {
            if ( newDishData.ingredients[i].uuid == ingredientUUID ) {
                found = true;
                newDishData.ingredients[i].number_servings = ingredientServings;
            }
        }
        if ( ! found ) {
            newDishData.ingredients.push({"uuid":ingredientUUID,"number_servings": ingredientServings});
        }
        await updateDish(newDishData);
    }

    function getDishIngredientServing(dish,uuid)
    {
        for ( const ingredient of dish.ingredients ) {
            if ( ingredient.uuid == uuid ) {
                return ingredient.number_servings;
            }
        }
        return 0;
    }

    async function onHandleSubmit(event)
    {
        event.preventDefault();
        await updateDishIngredient(ingredientUUID);
        navigate("/updateDish", { "state": { "uuid": dishUUID}});
    }

    React.useEffect( () => {
        async function getIngredientData()
        {
            const ingredient = await getIngredient(ingredientUUID);
            setIngredientData(ingredient);
        }

        async function getDishData()
        {
            const dish = await getDish(dishUUID);
            setDishData(dish);
            const servings = getDishIngredientServing(dish,ingredientUUID);
            setIngredientServings(servings);
        }
        getIngredientData();
        getDishData();
    }, []);

    return (
        <div>
            <h1>Edit Dish Ingredient</h1>
            <form onSubmit={onHandleSubmit}>
                {ingredientData.name}
                {ingredientData.serving_size} 
                {ingredientData.serving_unit}
                {ingredientData.calories_per_serving}
                <label htmlFor="number_servings">Number of servings</label>
                <input type="text" id="number_servings" name="number_servings" value={ingredientServings} placeholder="0" onChange={onHandleChange}></input>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}