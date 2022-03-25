import React from "react";
import {useLocation,Link} from "react-router-dom";
import {convertOuncesToGrams,convertGramsToOunces } from "../conversion.js";
import "../style.css";

import { getDish, updateDish } from "../fetchData.js";

export default function UpdateDish()
{
    const location = useLocation();
    const state = location.state;

    let total_calories = 0;

    const [ dishData, setDishData ] = React.useState(
        {
            "name": "",
            "total_weight": 0,
            "total_weight_unit": "gram",
            "ingredients": []
        }
    );

    const [ portionData, setPortionData ] = React.useState(
        {
            "portion": 0,
            "portion_unit": "gram",
            "portion_calories": 0,
        }
    );

    const [ errorData, setErrorData ] = React.useState(
        {
            "code": 0,
            "errorMessage": ""
        }
    );

    React.useEffect( () => {
        async function getDishData()
        {
            const data = await getDish(state.id);
            setDishData(data);
        }
        getDishData();
    }, []);

    async function updateDishData(data)
    {
        const output = await updateDish(data);
        if ( output.isError ) {
            setErrorData(() => {
                return output.result;
            });
        }
    }

    function onHandleChange(event)
    {
        const { name, value } = event.target;
        setDishData(prevDishData => {
            return {
                ...prevDishData,
                [name]: value
            }
        });
    }

    function calculateDataFromPortion(data)
    {
        let portion_in_grams = data.portion;
        if ( data.portion_unit === "ounce" ) {
            portion_in_grams = convertOuncesToGrams(data.portion);
        }
        let cal_per_gram = (total_calories/dishData.total_weight_in_grams);
        data.portion_calories = Math.trunc(portion_in_grams * cal_per_gram);
        return data;
    }

    function calculateDataFromCalorie(data)
    {
        let gram_per_cal = (dishData.total_weight_in_grams/total_calories);
        data.portion = data.portion_calories * gram_per_cal;
        if ( data.portion_unit === "ounce" ) {
            data.portion = convertGramsToOunces(data.portion);
        }
        data.portion = Number(data.portion).toFixed(2);
        return data;
    }

    function onHandlePortionChange(event)
    {
        const { name, value } = event.target;
        let newPortionData = {
            ...portionData
        }
        if( name == "portion_unit" ) {
            if ( portionData.portion_unit !== value ) {
                if ( value == "ounce" ) {
                    newPortionData.portion = convertGramsToOunces(portionData.portion);
                }
                if ( value == "gram" ) {
                    newPortionData.portion = convertOuncesToGrams(portionData.portion);
                }
            }
            newPortionData.portion_unit = value;
        }
        if ( name === "portion" ) {
            newPortionData.portion = value;
            newPortionData = calculateDataFromPortion(newPortionData);
        }
        if ( name == "portion_calories" ) {
            newPortionData.portion_calories = value;
            newPortionData = calculateDataFromCalorie(newPortionData);
        }
        setPortionData(newPortionData);
    }

    function onHandleSubmit(event)
    {
        event.preventDefault();
        updateDishData(dishData);
    }

    async function onHandleRemoveIngredient(id)
    {
        let newDishData = {...dishData};
        newDishData.ingredients = dishData.ingredients.filter( element => element.id !== id );
        updateDishData(newDishData);
        setDishData(newDishData);
    }

    function RemoveButton(props)
    {
        const id = props.id;
        return (
            <button type="button" onClick={ async () => await onHandleRemoveIngredient(id)}>Remove</button>
        )
    }

    function DishIngredientListItem(props)
    {
        const { name, number_servings, calories_per_serving} = props.data;
        let calories = ( calories_per_serving * number_servings );
        return (
            <ul className="ingredientItem">
                <li>
                    {name}
                    {Math.trunc(calories)} calories
                </li>
            </ul>
        )
    }

    const ingredientList = dishData.ingredients.map(ingredient => {
        total_calories += ( ingredient.calories_per_serving * ingredient.number_servings );
        return (
            <DishIngredientListItem key={ingredient.id} data={ingredient} />
        )
    });

    return (
        <div>
            <h1>Dish Details</h1>
            <Link to="/dish">Back</Link>
            <div className="error">{errorData.code > 200 ? errorData.errorMessage  : ""}</div>
            Name: {dishData.name}
            Total weight: {dishData.total_weight} { dishData.total_weight_unit}
            Total calories: {Math.trunc(total_calories)}
            <Link to="/updateDish" state={{"id":state.id}}>
                <button type="button">Edit Dish</button>                
            </Link>
            <form>
                <label htmlFor="portion">Portion</label>
                <input type="text" id="portion" name="portion" value={portionData.portion} placeholder="0" onChange={onHandlePortionChange}/>
                <select id="portion_unit" name="portion_unit" value={portionData.portion_unit} onChange={onHandlePortionChange}>
                    <option value="gram">Grams</option>
                    <option value="ounce">Ounces</option>
                </select>
                <label htmlFor="portion_calories">Portion calories</label>
                <input type="text" id="portion_calories" name="portion_calories" value={portionData.portion_calories} placeholder="0" onChange={onHandlePortionChange}/>                         
            </form>
            {ingredientList}
        </div>
    )
}