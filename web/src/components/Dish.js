import React from "react";
import { Link } from "react-router-dom";
import DishListItem from "./DishListItem";
import SearchForm from "./SearchForm";

import { getDishes, deleteDish, searchDishes } from "../fetchData.js";

export default function Dish(props)
{
    const [dishData, setDishData] = React.useState([]);

    async function onHandleSearchSubmit(searchData)
    {
        const dishes = await searchDishes(searchData);
        setDishData(dishes.data);
    }

    async function onHandleDelete(dishID)
    {
        await deleteDish(dishID);
        const dishes = await getDishes();
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

    const dishList = dishData.map( dish => {
        return (
            <DishListItem
                key={dish.id}
                data={dish}
                onDelete={onHandleDelete}
            />
        )});

    return (
        <div>
            <SearchForm
                onHandleSubmit={onHandleSearchSubmit}
            />
            <Link to="/addDish">
                <button type="button">Add Dish</button>
            </Link>
            {dishList}
        </div>
    )
}