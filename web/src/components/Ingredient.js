import React from "react";
import { Link } from "react-router-dom";
import SearchForm from "./SearchForm.js"
import { getIngredients, searchIngredients } from "../fetchData.js";

export default function Ingredient(props)
{
    const [ ingredientData, setIngredientData ] = React.useState([]);
    
    async function onHandleSearchSubmit(searchData)
    {
        const data = await searchIngredients(searchData);
        setIngredientData(data);
    }

    React.useEffect( () => {
        async function getIngredientData()
        {
            const ingredients = await getIngredients();
            setIngredientData(ingredients.data)
        }
        getIngredientData();
    }, []);

    function IngredientListItem(props)
    {
        const { name, id } = props.data;

        return (
            <li>
                <Link to="/updateIngredient" state={{"id": id}}>
                    {name}
                </Link>         
            </li>
        );
    }

    const ingredientList = ingredientData.map(ingredient => (
        <IngredientListItem
            key={ingredient.id}
            data={ingredient}
        />
    ));

    return (
        <div className="main-container">
            <h1 className="main-header">Ingredients</h1>
            <SearchForm
                onHandleSubmit={onHandleSearchSubmit}
            />
            <Link to="/addIngredient">
                <button type="button">Add Ingredient</button>
            </Link>
            <ul className="ingredient-list">   
                {ingredientList}
            </ul>
        </div>
    )
}