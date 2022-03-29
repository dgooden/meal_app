import React from "react";
import {useLocation,useNavigate,Link} from "react-router-dom";
import {convertOuncesToGrams,convertGramsToOunces } from "../conversion.js";
import {deleteDish} from "../fetchData.js";
import "../style.css";

import { getDish, updateDish } from "../fetchData.js";

export default function UpdateDish()
{
    const location = useLocation();
    const navigate = useNavigate();
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

    function onHandleSubmit(event)
    {
        event.preventDefault();
        updateDishData(dishData);
    }

    async function onHandleDelete()
    {
        await deleteDish(state.id);
        navigate("/dish");
    }

    function DishIngredientListItem(props)
    {
        const { name, number_servings, calories_per_serving, id} = props.data;
        return (
            <li>
                <Link to="/editDishIngredient" state={{"ingredientID": id, "dishID":state.id, "from":"/updateDish"}}>
                    {name}
                </Link>
            </li>
        )
    }

    const ingredientList = dishData.ingredients.map(ingredient => {
        total_calories += ( ingredient.calories_per_serving * ingredient.number_servings );
        return (
            <DishIngredientListItem key={ingredient.id} data={ingredient}/>
        )
    });

    return (
        <div className="main-container">
            <h1 className="main-header">Edit Dish</h1>
            <Link to="/dishDetails" state={{"id":state.id}}>Back</Link>
            <div className="error">{errorData.code > 200 ? errorData.errorMessage  : ""}</div>      
            <form className="dish-update-form" onSubmit={onHandleSubmit}>
                <div className="dish-update-label">
                    <label htmlFor="name">Name</label>
                </div>
                <div className="dish-update-details">
                    <input type="text" id="name" name="name" value={dishData.name} placeholder="Name" onChange={onHandleChange}/>
                </div>
                <div className="dish-update-label">
                    <label htmlFor="total_weight">Total weight</label>
                </div>
                <div className="dish-update-details">
                    <input type="text" id="porion" name="total_weight" value={dishData.total_weight} placeholder="Total weight" onChange={onHandleChange}/>
                    <select id="total_weight_unit" name="total_weight_unit" value={dishData.total_weight_unit} onChange={onHandleChange}>
                        <option value="gram">Grams</option>
                        <option value="ounce">Ounces</option>
                    </select>
                </div>
                <div className="dish-update-label">                
                    <label htmlFor="calories">Total calories</label>
                </div>
                <div className="dish-update-details">
                    <input disabled readOnly type="text" id="calories" value={Math.trunc(total_calories)}/>
                </div>
                <div className="dish-update-full-width">
                    <button type="submit">Update</button>
                    <button onClick={onHandleDelete}>Delete</button>               
                </div>
            </form>
            <Link to="/addDishIngredient" state={{"id":state.id}}>
                <button type="button">Add Ingredient</button>
            </Link>
            <h3>Ingredients</h3>
            <ul className="ingredient-list">
                {ingredientList}
            </ul>
        </div>
    )
}