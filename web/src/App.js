import { Route, Routes, NavLink, BrowserRouter, Navigate } from "react-router-dom";
import Ingredient from "./components/Ingredient.js";
import AddIngredient from "./components/AddIngredient.js";
import UpdateIngredient from "./components/UpdateIngredient.js";
import Dish from "./components/Dish.js";
import AddDish from "./components/AddDish.js";
import DishDetails from "./components/DishDetails.js";
import UpdateDish from "./components/UpdateDish.js";
import AddDishIngredient from "./components/AddDishIngredient.js";
import EditDishIngredient from "./components/EditDishIngredient.js";

function App() {
  return (
    <BrowserRouter>
      <div>
        <header>
          <h1>Meal</h1>
          <ul>
            <li><NavLink to="/dish">Dish</NavLink></li>
            <li><NavLink to="/ingredient">Ingredients</NavLink></li>
          </ul>
        </header>
        <main>
          <Routes>
            <Route path="/dish" element={<Dish />}/>
            <Route path="/addDish" element={<AddDish/>}/>
            <Route path="/dishDetails" element={<DishDetails/>}/>
            <Route path="/updateDish" element={<UpdateDish/>}/>
            <Route path="/addDishIngredient" element={<AddDishIngredient/>}/>
            <Route path="/editDishIngredient" element={<EditDishIngredient/>}/>

            <Route path="/ingredient" element={<Ingredient />}/>
            <Route path="/addIngredient" element={<AddIngredient/>}/>
            <Route path="/updateIngredient" element={<UpdateIngredient/>}/>
            <Route path="/" element={<Navigate replace to="/dish"/>}/>
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
