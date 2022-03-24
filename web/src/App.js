import { Route, Routes, NavLink, BrowserRouter } from "react-router-dom";
import Main from "./components/Main.js";
import Ingredient from "./components/Ingredient.js";
import AddIngredient from "./components/AddIngredient.js";
import UpdateIngredient from "./components/UpdateIngredient.js";
import Dish from "./components/Dish.js";
import AddDish from "./components/AddDish.js";
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
            <li><NavLink to="/">Main</NavLink></li>
            <li><NavLink to="/dish">Dish</NavLink></li>
            <li><NavLink to="/ingredient">Ingredients</NavLink></li>
          </ul>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Main />}/>
            
            <Route path="/dish" element={<Dish />}/>
            <Route path="/addDish" element={<AddDish/>}/>
            <Route path="/updateDish" element={<UpdateDish/>}/>
            <Route path="/addDishIngredient" element={<AddDishIngredient/>}/>
            <Route path="/editDishIngredient" element={<EditDishIngredient/>}/>

            <Route path="/ingredient" element={<Ingredient />}/>
            <Route path="/addIngredient" element={<AddIngredient/>}/>
            <Route path="/updateIngredient" element={<UpdateIngredient/>}/>
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
