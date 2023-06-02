import React, {useEffect,useState} from "react";

 
// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";


 
// We import all the components we need in our app
import Header from "./components/Header";
import Footer from "./components/Footer";
import List from "./components/List";

const App = () => {

  const [record,setrecord]=useState({})
  let [count,setcount]=useState(59)
  let [namelist, setnamelist]=useState([])
  let [path,setpath]=useState("BTC-INR")
  let getData = async ()=>{
    try {
      let response = await fetch(`http://localhost:5000/HOME/`+path);
      
      const data = await response.json();
      const {name,last,buy,sell,volume,base_unit,BestPriceToTrade,Savings,Difference,arrayoftickers} = data
      setrecord({name,last,buy,sell,volume,base_unit,BestPriceToTrade,Savings,Difference,arrayoftickers})
      setnamelist(arrayoftickers)

      console.log("Data fetched successfully "+data.name)

   
     
  }catch(e){
    console.log("Error Fetching data :" + e.message)
  }
  
  }
  


  useEffect(() => {
    getData();
    
    const interval = setInterval(getData,60000)

    const secondsinterval = setInterval(() => {
      setcount(count => {
       if (count === 0) {
        return 59;
      } else {
        return count - 1;
      }});
    }, 1000);
    
   

    return()=> {clearInterval(interval); clearInterval(secondsinterval)}; 
    },[path]);
      
 
    
  
 return (
   <div className="container-fluid">
     <Header record = {record} namelist={namelist} count={count} setpath={setpath}/>
     <List record={record} />
     <Footer />
   </div>
 );
};

export default App;