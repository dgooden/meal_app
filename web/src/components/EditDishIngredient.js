import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

import { getIngredient, 
         getDish, 
         getDishIngredient,
         addDishIngredient,
         updateDishIngredient,
         deleteDishIngredient } from "../fetchData";

export default function EditDishIngredient()
{
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state;
    const { dishID, ingredientID, from } = state;

    if ( from == "/addDishIngredient" ) {

    }

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

    async function onHandleRemoveIngredient()
    {
        const result = await getDishIngredient(dishID,ingredientID);
        if ( ! result.isError ) {
            await deleteDishIngredient(dishID,ingredientID);
        }
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
            let servingData = {
                "number_servings": data.number_servings,
                "portion_size": calculatePortionSize(data.serving_size,data.number_servings)
            }
            setIngredientServings(servingData);
        }
        getIngredientData();
    }, []);

    function showServingSize()
    {
        let unit = ingredientData.serving_unit;
        unit += (ingredientData.serving_size > 1 ) ? "s" : "";
        return `${ingredientData.serving_size} ${unit}`;
    }

    function showRemoveButton()
    {
        if ( from != "/addDishIngredient") {
            return (
                <button type="button" onClick={onHandleRemoveIngredient}>Remove</button>
            )
        }
        return;
    }

    return (
        <div className="main-container">
            <h1 className="main-header">Edit Dish Ingredient</h1>
            <Link to={from} state={{"id":dishID}}>Back</Link>
            <form className="edit-dish-ingredient-form" onSubmit={onHandleSubmit}>
                <div className="edit-dish-ingredient-label">
                    Name:
                </div>
                <div className="edit-dish-ingredient-details">
                    {ingredientData.name}
                </div>
                <div className="edit-dish-ingredient-label">
                    Serving Size:
                </div>
                <div className="edit-dish-ingredient-details">
                    {showServingSize()}
                </div>
                <div className="edit-dish-ingredient-label">
                    Calories:
                </div>
                <div className="edit-dish-ingredient-details">
                    {ingredientData.calories_per_serving}
                </div>
                <div className="edit-dish-ingredient-label">
                    <label htmlFor="number_servings">Number of servings</label>
                </div>
                <div className="edit-dish-ingredient-details">
                    <input className="input-ninechar-width" type="text" id="number_servings" name="number_servings" value={ingredientServings.number_servings} placeholder="0" onChange={onHandleChange}/>
                </div>
                <div className="edit-dish-ingredient-label">
                    <label htmlFor="portion_size">Portion size</label>
                </div>
                <div className="edit-dish-ingredient-details">
                    <input className="input-ninechar-width" type="text" id="portion_size" name="portion_size" value={ingredientServings.portion_size} placeholder="0" onChange={onHandleChange}/>                
                    <select id="serving_unit" onChange={onHandleChange} name="serving_unit" value={ingredientData.serving_unit}>
                        <option value="gram">Grams</option>
                        <option value="ounce">Ounces</option>
                    </select>                
                </div>
                <div className="edit-dish-ingredient-full-width">
                    <button type="submit">{ ( from == "/addDishIngredient" ) ? "Add" : "Update"}</button>
                    {showRemoveButton()}
                </div>
            </form>
        </div>
    )
}