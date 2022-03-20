import React from "react"

export default function SearchForm(props)
{
    const [ searchData, setSearchData ] = React.useState(
        {
            "search": ""
        }
    );


    /* 
        props.searchData
        props.onHandleSubmit()
    */
   function onHandleSubmit(event) {
       event.preventDefault();
       props.onHandleSubmit(searchData.search);
   }

   function onHandleChange(event)
   {
       const { name, value } = event.target;
       setSearchData(prevSearchData => {
           return {
               ...prevSearchData,
               [name]: value
           }
       });
   }

    return (
        <form onSubmit={onHandleSubmit}>
            <input type="text" placeholder="Search..." onChange={onHandleChange} name="search" value={searchData.search}/>
            <button>Search</button>
        </form>
    )
}