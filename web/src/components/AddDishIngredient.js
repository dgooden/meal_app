import React from "react";
import {useLocation, Link} from "react-router-dom";
import SearchForm from "./SearchForm";

import { getDish, getIngredients, searchIngredients } from "../fetchData.js";

export default function AddDishIngredient()
{
    const location = useLocation();
    const state = location.state;
    
    const [ ingredientData, setIngredientData] = React.useState([]);
    const [ dishData, setDishData] = React.useState({});

    React.useEffect( () => {
        async function getIngredientData() {
            const ingredients = await getIngredients();
            setIngredientData(ingredients.data);
        }
        getIngredientData();
        async function getDishData() {
            const data = await getDish(state.id);
            setDishData(data);
        }
        getDishData();
    }, [state.id]);

    async function onHandleSearchSubmit(searchData)
    {
        const data = await searchIngredients(searchData);
        setIngredientData(data);
    }

    function isIngredientInDish(ingredientID)
    {
        if ( typeof dishData.ingredients == "undefined" ) {
            return false;
        }
        for ( const ingredient of dishData.ingredients) {
            if ( ingredient.id === ingredientID ) {
                return true;
            }
        }
        return false;
    }

    function AddButton(props)
    {
        const ingredientID = props.id;
        return (
            <Link to="/editDishIngredient" state={{"ingredientID": ingredientID, "dishID":state.id, "from":"/addDishIngredient"}}>
                <button type="button">Add</button>
            </Link>
        )
    }

    function DishIngredientListItem(props)
    {
        const { name, number_servings, id } = props.data;
        return (
            <ul className="add-dish-ingredient-list">
                <li>
                    {name} {number_servings} <AddButton id={id}/>
                </li>
            </ul>
        )
    }
   const ingredientList = ingredientData.map(ingredient => {
        return (
            isIngredientInDish(ingredient.id) ? "" : <DishIngredientListItem key={ingredient.id} data={ingredient}/>
        )
    });
    
    return (
        <div className="main-container">
            <h1 className="main-header">List Ingredients</h1>
            <Link to="/updateDish" state={{"id":state.id}}>Back</Link>
            <SearchForm
                onHandleSubmit={onHandleSearchSubmit}
            />
            {ingredientList}
        </div>
    )
}