import React from "react"

export default function SearchForm(props)
{
    const [ searchData, setSearchData ] = React.useState("");

    /* 
        props.searchData
        props.onHandleSubmit()
    */
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
   }

   function onHandleClear()
   {
       setSearchData(() => {
           return "";
       });
       props.onHandleSubmit("");
   }

    return (
        <form onSubmit={onHandleSubmit}>
            <input type="text" placeholder="Search..." onChange={onHandleChange} name="search" value={searchData}/>
            <button>Search</button>
            <button type="button" onClick={onHandleClear}>Clear</button>
        </form>
    )
}