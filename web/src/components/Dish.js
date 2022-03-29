import React from "react";
import { Link } from "react-router-dom";
import SearchForm from "./SearchForm";

import { getDishes, deleteDish, searchDishes } from "../fetchData.js";

/*
    [   ] [search] [clear]  or [magnifing glass] [X (clear)]     [Add dish] or [+]
    
    list of dish names, linkName
*/

export default function Dish(props)
{
    const [dishData, setDishData] = React.useState([]);

    async function onHandleSearchSubmit(searchData)
    {
        const dishes = await searchDishes(searchData);
        setDishData(dishes.data);
    }



    React.useEffect( () => {
        async function getDishData()
        {
            const dishes = await getDishes();
            setDishData(dishes.data);
        }
        getDishData();
    }, []);


    function DishListItem(props)
    {
        const { id, name } = props.data;
        return (
            <li>
                <Link to="/dishDetails" state={{"id":id}}>
                    {name}
                </Link>
            </li>
        )
    }

    const dishList = dishData.map( dish => {
        return (
            <DishListItem
                key={dish.id}
                data={dish}
            />
        )});

    return (
        <div className="main-container">
            <h1 className="main-header">Dishes</h1>
            <SearchForm
                onHandleSubmit={onHandleSearchSubmit}
            />
            <Link to="/addDish">
                <button className="add-button" type="button">Add Dish</button>
            </Link>
            <ul className="dish-items">            
                {dishList}
            </ul>
        </div>
    )
}