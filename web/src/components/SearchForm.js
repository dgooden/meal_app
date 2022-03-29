import React from "react"

export default function SearchForm(props)
{
    const [ searchData, setSearchData ] = React.useState("");

    function onHandleSubmit(event) {
        event.preventDefault();
        props.onHandleSubmit(searchData);
    }

    function onHandleChange(event)
    {
        const { value } = event.target;
        setSearchData(() => {
            return value;
        });
        if ( value.length == 0 ) {
            props.onHandleSubmit("");
        }
    }

    return (
                <form className="search-form-container" onSubmit={onHandleSubmit}>
                    <input className="search-form-input" type="search" placeholder="Search..." onChange={onHandleChange} name="search" value={searchData}/>
                    <button className="search-form-button" type="submit">Search</button>
                </form>
    )
}