import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

import { getIngredient, 
         getDish, 
         getDishIngredient,
         addDishIngredient,
         updateDishIngredient } from "../fetchData";

export default function EditDishIngredient()
{
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state;
    const { dishID, ingredientID, from } = state;

    const [ ingredientData, setIngredientData ] = React.useState({});
    const [ ingredientServings, setIngredientServings ] = React.useState({
        "number_servings": 0,
        "portion_size": 0
    });

    function calculateNumberServings(serving_size,portion_size)
    {
        return (portion_size/serving_size);
    }

    function calculatePortionSize(serving_size,number_servings)
    {
        return (number_servings*serving_size);
    }

    function onHandleChange(event)
    {
        const { name, value } = event.target;
        let data = {
            "number_servings": 0,
            "portion_size": 0
        };
        if ( name === "number_servings" ) {
            data.number_servings = value;
            data.portion_size = calculatePortionSize(ingredientData.serving_size,data.number_servings);
        }
        if ( name === "portion_size" ) {
            data.portion_size = value;
            data.number_servings = calculateNumberServings(ingredientData.serving_size,data.portion_size);
        }
        setIngredientServings(data);
    }

    async function addUpdateDishIngredient(updateIngredientID)
    {
        let newIngredientData = {
            "id": updateIngredientID,
            "number_servings": ingredientServings.number_servings
        };
        const data = await getDishIngredient(dishID,updateIngredientID);
        if ( data.isError && data.result.code == 404 ) {
            await addDishIngredient(dishID,newIngredientData);
        } else {
            await updateDishIngredient(dishID,updateIngredientID,newIngredientData);
        }
    }

    async function onHandleSubmit(event)
    {
        event.preventDefault();
        await addUpdateDishIngredient(ingredientID);
        navigate("/updateDish", { "state": { "id": dishID}});
    }

    React.useEffect( () => {
        async function getIngredientData()
        {
            let data = {};
            const dishIngredient = await getDishIngredient(dishID,ingredientID);
            if ( dishIngredient.isError ) {
                if ( dishIngredient.result.code == 404 ) {
                    data = await getIngredient(ingredientID);
                    data.number_servings = 0;
                }
            } else {
                data = dishIngredient.result;
            }
            setIngredientData(data);
            console.log(data);
            let servingData = {
                "number_servings": data.number_servings,
                "portion_size": calculatePortionSize(data.serving_size,data.number_servings)
            }
            setIngredientServings(servingData);
        }
        getIngredientData();
    }, []);

    return (
        <div>
            <h1>Edit Dish Ingredient</h1>
            <Link to={from} state={{"id":dishID}}>Back</Link>
            <form onSubmit={onHandleSubmit}>
                {ingredientData.name}
                {ingredientData.serving_size} 
                {ingredientData.serving_unit}
                {ingredientData.calories_per_serving} calories

                <label htmlFor="number_servings">Number of servings</label>
                <input type="text" id="number_servings" name="number_servings" value={ingredientServings.number_servings} placeholder="0" onChange={onHandleChange}/>
                <label htmlFor="portion_size">Portion size</label>
                <input type="text" id="portion_size" name="portion_size" value={ingredientServings.portion_size} placeholder="0" onChange={onHandleChange}/>                
                {ingredientData.serving_unit}
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}