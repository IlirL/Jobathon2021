import express from 'express';
import fetch from 'node-fetch'
import goodWords from './databaseGoodWords.js';
import badWords from './databasebadWords.js';
import coinsAndAbbr from './databaseCoins.js'
const coins = coinsAndAbbr.coins
const abbr = coinsAndAbbr.abbr
const photos = coinsAndAbbr.photos

// console.log(coins);
const app = express();
const port = process.env.PORT || 9000;

const count = (wholeString, word) =>{
    return wholeString.split(word).length - 1;
}

const findCoin = (str)=>{
    for(var i = 0; i<coins.length; i++)
    {
         if(str.includes(coins[i]))
         {
             return abbr[i];
         }
    }
}

const getImageSRC = (str)=>{
  for(var i = 0; i<coins.length; i++)
  {
       if(str.includes(coins[i]))
       {
           return photos[i];
       }
  }
}

app.use(express.json());
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

app.post('/analyze_link', (req, res)=> {
    // console.log(req.body);
    // res.status(201).send('hello world'); 
    // res.status(201).send('ok')  
    fetch(req.body.text)
  .then(response => response.text())
  .then(data => {
  	// Do something with your data
      //we have to check how many positive and how many negative words we have
    //   console.log(typeof(data))
//    console.log(count('ilir is ilir', 'ilir'))
      var positiveWords = 0, negativeWords = 0;
      for(let i = 0; i<goodWords.length; i++)
      {
        positiveWords+=count(data, goodWords[i]);
      }

      for(let i = 0; i<badWords.length; i++)
      {
        negativeWords+=count(data, badWords[i]);
      }
    //   console.log(`positiveWords = ${positiveWords}, negativeWords = ${negativeWords}`);
  	// console.log(data);

      //ok now we know if its negative or positive,
      //we need the link again which is in req.body.text
      //we need a image, we will see that later on
      //we need the coin

      //lets get the coin
      //first of all lets see the api of coins

      //lets try and get the image src
    //   console.log("data =  ", data)


    var result = '';
    var coinType = findCoin(data);
    var imgURL = getImageSRC(data)
      console.log(getImageSRC(data))
      if(negativeWords > positiveWords)
        // res.status(200).send('negative');
        result = 'negative'
    else
        // res.status(200).send('positive');
        result = 'positive';

        var finalResult = {
            result:result,
            coin:coinType,
            imgURL:imgURL
        }
        res.status(200).send(finalResult);
  });
})

app.listen(port, () => console.log('Server Listening on port ', port))