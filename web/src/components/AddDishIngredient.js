import React from "react";
import {useLocation, Link} from "react-router-dom";
import SearchForm from "./SearchForm";

import { getDish, getIngredients, searchIngredients } from "../fetchData.js";


export default function AddDishIngredient()
{
    const location = useLocation();
    const state = location.state;
    console.log("addDishIngredient state:",state);
    
    const [ ingredientData, setIngredientData] = React.useState([]);
    const [ dishData, setDishData] = React.useState({});

    const getDishData = React.useCallback( async () => {
        const data = await getDish(state.uuid);
        setDishData(data);
    }, [state.uuid]);

    React.useEffect( () => {
        async function getIngredientData() {
            const data = await getIngredients();
            setIngredientData(data);
        }
        getIngredientData();
        getDishData();
    }, [getDishData]);

    async function onHandleSearchSubmit(searchData)
    {
        const data = await searchIngredients(searchData);
        setIngredientData(data);
    }

    function isIngredientInDish(ingredientUUID)
    {
        if ( typeof dishData.ingredients == "undefined" ) {
            return false;
        }
        for ( const ingredient of dishData.ingredients) {
            if ( ingredient.uuid === ingredientUUID ) {
                return true;
            }
        }
        return false;
    }

    function AddButton(props)
    {
        const ingredientUUID = props.uuid;
        return (
            <Link to="/editDishIngredient" state={{"ingredientUUID": ingredientUUID, "dishUUID":state.uuid}}>
                <button type="button">Add</button>
            </Link>
        )
    }

    function DishIngredientListItem(props)
    {
        const { name, number_servings, uuid } = props.data;
        return (
            <ul className="ingredientItem">
                <li>
                    {name} {number_servings} <AddButton uuid={uuid}/>
                </li>
            </ul>
        )
    }
   const ingredientList = ingredientData.map(ingredient => {
        console.log(ingredient.uuid);
        return (
            isIngredientInDish(ingredient.uuid) ? "" : <DishIngredientListItem key={ingredient.uuid} data={ingredient}/>
        )
    });
    
    return (
        <div>
            <h1>List Ingredients</h1>
            <SearchForm
                onHandleSubmit={onHandleSearchSubmit}
            />
            {ingredientList}
        </div>
    )
}