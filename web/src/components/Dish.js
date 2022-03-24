import React from "react";
import { Link } from "react-router-dom";
import DishListItem from "./DishListItem";
import SearchForm from "./SearchForm";

import { getDishes, deleteDish, searchDishes } from "../fetchData.js";

export default function Dish(props)
{
    const [dishData, setDishData] = React.useState([]);

    function onHandleSearchSubmit(searchData)
    {
        console.log("search submit:",searchData);
        searchDishes(searchData);
    }

    async function onHandleDelete(dishUUID)
    {
        console.log("delete dish:",dishUUID);
        await deleteDish(dishUUID);
        const data = await getDishes();
        setDishData(data);
    }

    React.useEffect( () => {
        async function getDishData()
        {
            const data = await getDishes();
            setDishData(data);
        }
        getDishData();
    }, []);

    const dishList = dishData.map( dish => {
        return (
            <DishListItem
                key={dish.uuid}
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