import SearchForm from "./SearchForm.js"

export default function Ingredient(props)
{
    function onHandleSearchSubmit(data)
    {
        console.log("submit:",data);
    }

    return (
        <div>
            <header></header>
            <main>
                <SearchForm 
                    onHandleSubmit={onHandleSearchSubmit}
                />
            </main>
        </div>
    )
}