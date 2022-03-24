import React from "react";
import { Link } from "react-router-dom";
import "../style.css";

export default function ComponentListItem(props)
{
    const { name, ingredients, portion, portion_unit, uuid } = props.data;

    const unit = portion > 1 ? portion_unit + 's' : portion_unit;
    let calories = 0;
    
    const ingredientList = ingredients.map( ingredient => {
        calories += ( ingredient.calories_per_serving * ingredient.serving_size );
        return (
            <li key={ingredient.uuid}>{ingredient.name} Servings: {ingredient.serving_size}</li>
        )
    });

    return (
        <ul className="dishItem">
            <li>
            <Link to="/updateDish" state={{"uuid":uuid}}>
                {name}
            </Link>
            {portion} {unit} {`${Math.trunc(calories)} calories`}
            <ul className="dishIngredientItem">
                {ingredientList}
            </ul>
            </li>
        </ul>
    )
}