import React from "react";
import {useLocation,Link} from "react-router-dom";

import { getDish, updateDish } from "../fetchData.js";

export default function UpdateDish()
{
    const location = useLocation();
    const state = location.state;

    let calories = 0;

    const [ dishData, setDishData ] = React.useState(
        {
            "name": "",
            "portion": 0,
            "portion_unit": "gram",
            "ingredients": []
        }
    );

    const [ errorData, setErrorData ] = React.useState(
        {
            "code": 0,
            "errorMessage": ""
        }
    );

    const getDishData = React.useCallback( async () => {
        const data = await getDish(state.uuid);
        setDishData(data);
    }, [state.uuid]);

    React.useEffect( () => {
        getDishData();
    }, [getDishData]);

    async function updateDishData(data)
    {
        const output = await updateDish(data);
        console.log("updateDishData output:",output);
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
        console.log("dish update submit");
        updateDishData(dishData);
    }

    async function onHandleRemoveIngredient(uuid)
    {
        console.log("remove ingredient",uuid);
        let newDishData = {...dishData};
        newDishData.ingredients = dishData.ingredients.filter( element => element.uuid !== uuid );
        console.log(newDishData.ingredients);
        updateDishData(newDishData);
        setDishData(newDishData);
    }

    function RemoveButton(props)
    {
        const uuid = props.uuid;
        return (
            <button type="button" onClick={ async () => await onHandleRemoveIngredient(uuid)}>Remove</button>
        )
    }

    function EditButton(props)
    {
        const uuid = props.uuid;
        return (
            <Link to="/editDishIngredient" state={{"ingredientUUID": uuid, "dishUUID":state.uuid}}>
            <button type="button">Edit</button>
            </Link>
        )        
    }

    function DishIngredientListItem(props)
    {
        const { name, number_servings, uuid} = props.data;
        let servingText = number_servings > 1 ? "servings": "serving"
        return (
            <ul className="ingredientItem">
                <li>
                    {name} {number_servings} {servingText} <EditButton uuid={uuid}/> <RemoveButton uuid={uuid}/>
                </li>
            </ul>
        )
    }

    const ingredientList = dishData.ingredients.map(ingredient => {
        calories += ( ingredient.calories_per_serving * ingredient.number_servings );
        return (
            <DishIngredientListItem key={ingredient.uuid} data={ingredient}/>
        )
    });

    return (
        <div>
            <h1>Update Dish</h1>
            <div className="error">{errorData.code > 200 ? errorData.errorMessage  : ""}</div>            
            <form onSubmit={onHandleSubmit}>
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" value={dishData.name} placeholder="Name" onChange={onHandleChange}/>
                <label htmlFor="portion">Portion</label>
                <input type="text" id="porion" name="portion" value={dishData.portion} placeholder="Portion" onChange={onHandleChange}/>
                <select id="portion_unit" name="portion_unit" value={dishData.portion_unit} onChange={onHandleChange}>
                    <option value="gram">Grams</option>
                    <option value="ounce">Ounces</option>
                </select>
                <label htmlFor="calories">Calories</label>
                <input readOnly type="text" id="calories" value={Math.trunc(calories)}/>
                <button type="submit">Update Dish</button>
            </form>
            <Link to="/addDishIngredient" state={{"uuid":state.uuid}}>
                <button type="button">Add Ingredient</button>
            </Link>
            {ingredientList}
        </div>
    )
}