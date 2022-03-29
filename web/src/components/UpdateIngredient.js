import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

import { getIngredient, updateIngredient, deleteIngredient } from "../fetchData.js";

export default function UpdateIngredient()
{
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state;
    
    const [ ingredientData, setIngredientData ] = React.useState(
        {
            "name": "",
            "serving_size": 0,
            "serving_unit": "gram",
            "calories_per_serving": 0
        }
    );

    const [ errorData, setErrorData ] = React.useState(
        {
            "code": 0,
            "errorMessage": ""
        }
    );

    React.useEffect( () => {
        async function getIngredientData()
        {
            const data = await getIngredient(state.id);
            setIngredientData(data);
        }
        getIngredientData();
    }, [state.id]);

    
    function onHandleChange(event)
    {
        const { name, value } = event.target;
        setIngredientData(prevIngredientData => {
            return {
                ...prevIngredientData,
                [name]: value
            }
        });
    }

    function onHandleSubmit(event)
    {
        event.preventDefault();
        const output = updateIngredient(ingredientData);
        if ( output.isError ) {
            setErrorData( () => {
                return output.result;
            });
        } else {
            navigate("/ingredient");
        }
    }

    async function onHandleDelete()
    {
        // delete ingredient from dishes
        await deleteIngredient(state.id);
        navigate("/ingredient");
    }

    return (
        <div className="main-container">
            <h1 className="main-header">Edit Ingredient</h1>
            <Link to="/ingredient"> Back</Link>
            <form className="edit-ingredient-form" onSubmit={onHandleSubmit}>
                <div className="edit-ingredient-label">
                    <label htmlFor="name">Name</label>
                </div>
                <div className="edit-ingredient-details">
                    <input type="text" id="name" placeholder="Name" onChange={onHandleChange} name="name" value={ingredientData.name}/>
                </div>
                <div className="edit-ingredient-label">                
                    <label htmlFor="serving_size">Serving size</label>
                </div>
                <div className="edit-ingredient-details">
                    <input type="text" id="serving_size" placeholder="0" onChange={onHandleChange} name="serving_size" value={ingredientData.serving_size}/>
                </div>
                <div className="edit-ingredient-label">
                    <label htmlFor="serving_unit">Serving type</label>
                </div>
                <div className="edit-ingredient-details">
                    <select id="serving_unit" onChange={onHandleChange} name="serving_unit" value={ingredientData.serving_unit}>
                        <option value="gram">Grams</option>
                        <option value="ounce">Ounces</option>
                        <option value="teaspoon">Teaspoons</option>
                        <option value="tablespoon">Tablespoons</option>
                    </select>
                </div>
                <div className="edit-ingredient-label">
                    <label htmlFor="calories_per_serving">Calories per serving</label>
                </div>
                <div className="edit-ingredient-details">
                    <input type="text" id="calories_per_serving" placeholder="0" onChange={onHandleChange} name="calories_per_serving" value={ingredientData.calories_per_serving}/>
                </div>
                <div className="edit-ingredient-full-width">                
                    <button type="submit">Update</button>
                    <button type="button" onClick={onHandleDelete}>Delete</button>
                </div>
            </form>
            <div className="error">{ errorData.code > 200 ? errorData.errorMessage : ""}</div>
        </div>   
    )
}