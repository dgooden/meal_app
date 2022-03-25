import React from "react";
import { Link } from "react-router-dom";
import "../style.css";

export default function DishListItem(props)
{
    const { name, ingredients, total_weight, total_weight_unit, id } = props.data;

    const unit = total_weight > 1 ? total_weight_unit + 's' : total_weight_unit;
    let total_calories = 0;
    
    const ingredientList = ingredients.map( ingredient => {
        let ingredient_calories = ( ingredient.calories_per_serving * ingredient.number_servings );
        total_calories += ingredient_calories;
        return (
            <li key={ingredient.id}>{ingredient.name} {Math.trunc(ingredient_calories)} calories</li>
        )
    });

    return (
        <ul className="dishItem">
            <li>
                <Link to="/dishDetails" state={{"id":id}}>
                    {name}
                </Link>
                {`${Math.trunc(total_calories)} calories`}
                <button type="button" onClick={()=> props.onDelete(id)}>Delete</button>
                <ul className="dishIngredientItem">
                    {ingredientList}
                </ul>
            </li>
        </ul>
    )
}