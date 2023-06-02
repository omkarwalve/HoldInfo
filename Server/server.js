const express = require('express');
const axios = require('axios');
const cors = require("cors")
const { Pool } = require('pg');
require('dotenv').config()

const app = express();
app.use(cors());
const port = 5000;

// PostgreSQL database configuration
const pool = new Pool({
  user: process.env.USER,
  host: 'localhost',
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: 5432,
});

app.get("/",async (req,res)=>{
   
    res.redirect('/Home/BTC-INR')
    //send data back in json 
      
    // setInterval(fetchDataAndStoreInDB,6000);
})

// Fetch data from the API and store in the database
const fetchDataAndStoreInDB = async () => {
    
  try {
    const response = await axios.get('https://api.wazirx.com/api/v2/tickers');
    const data = response.data;
    let arrayoftickers = []
    // Filter the top 10 results
    const top10Results = Object.values(data).slice(0, 10);

    // console.log(top10Results); // successfully sliced top 10 results

//     Insert the data into the database
    await Promise.all(
      top10Results.map(async (result) => {
        const { name, last, buy, sell, volume, base_unit } = result;
        arrayoftickers.push(name);
        
      

        await pool.query(
          'INSERT INTO ticker_data (name, last, buy, sell, volume, base_unit) VALUES ($1, $2, $3, $4, $5, $6)',
          [name, last, buy, sell, volume, base_unit]
        );
      })
    );

    console.log('Data stored successfully.');
    console.log(arrayoftickers)
    return arrayoftickers
   
  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
}
// Fetch data and store in the database every 1 minute



//change the value of the tokens according to route
app.get("/Home/:rname",async (req,res)=>{
    await pool.query('DELETE FROM ticker_data').then(()=>console.log("data deleted successfully"))

    // let empty = await pool.query('SELECT COUNT(*) FROM ticker_data')
    // empty = empty.rows[0].count
    // if(empty == 0){
    //      await fetchDataAndStoreInDB()
        
    // }
    let arrayoftickers = await fetchDataAndStoreInDB()
    let rname = req.params.rname
    rname = rname.slice(0,3)+"/"+rname.slice(4,7)
    console.log(rname)
    

    const query = {
        // give the query a unique name
        name: 'fetch-ticker',
        text: 'SELECT * FROM ticker_data WHERE name = $1',
        values: [rname],
      }
    const data =  await pool.query(query)
    let { name , last , buy , sell, volume , base_unit }= data.rows[0]
    
    let BestPriceToTrade = last
    let Savings =(BestPriceToTrade - sell).toFixed(2)
    const Difference = ((Savings/BestPriceToTrade)*100).toFixed(2) 
    Savings = Math.abs(Savings)
    Savings = Savings.toLocaleString()
    last =  last.toLocaleString()
    buy = buy.toLocaleString()
    sell = sell.toLocaleString()
    BestPriceToTrade= BestPriceToTrade.toLocaleString()
    
    console.log("Best Price to Trade = "+BestPriceToTrade)
    console.log("Savings = "+Savings)
    console.log("Difference ="+Difference+"%")

    const objectresult=  {name,last,buy,sell,volume,base_unit,BestPriceToTrade,Savings,Difference,arrayoftickers}

    res.json(objectresult);
    
})
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
