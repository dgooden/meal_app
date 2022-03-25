import React from "react"
import { Link } from "react-router-dom";
import "../style.css";

export default function IngredientListItem(props)
{
    const {name, serving_size, serving_unit, calories_per_serving, id } = props.data;

    const unit = serving_size > 1 ? serving_unit + 's' : serving_unit;
    const servingData = `${serving_size} ${unit}`

    return (
        <ul className="ingredientList">
            <li>
            <Link to="/updateIngredient" state={{"id": id}}>
                {name}
            </Link>
            {servingData} {calories_per_serving} calories            
            <button type="button" onClick={() => props.onDelete(id)}>Delete</button></li>
        </ul>
    )
}