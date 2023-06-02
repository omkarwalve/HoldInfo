import React from "react";
import { Link,Routes,Route } from "react-router-dom";

function Header(props){
  

    const handleClick =(para)=>{
        
        props.setpath(para)
    }
    return (
    <div className="row"> 
    
    <div className="col-md-4 cold-sm-12">
      <img src="https://hodlinfo.com/static/media/HODLINFO.8f78fc06.png" alt="holdinfoicon" />
    </div>

    <div className="col-md-4 col-sm-12 middle-row">  
      <div class="dropdown">
      <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        {props.record.name}
      </button>
      <ul class="dropdown-menu">
      { props.namelist.map((res)=>{return (<li><a onClick={()=>handleClick(`${res.slice(0,3)+"-"+res.slice(4,7)}`)} >{res}</a></li>)})}
      </ul>
    </div>
    <h1 className="best-price">{props.record.BestPriceToTrade}</h1>
       <h6 className="price-under">Best price to trade </h6>
    </div>

    <div className="col-md-4 col-sm-12 middle-row">
        {props.name} 
        <h1 className="seconds">{props.count}</h1>
    </div>
</div>
)
}


export default Header