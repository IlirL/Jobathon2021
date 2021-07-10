import React, { useRef, useState } from 'react'
import SearchIcon from '@material-ui/icons/Search';
import './Search.css'
import axios from 'axios'

function Search(){
    
    const [hidden, setHidden] = useState(true);
    const [text, setText] =useState('')
    const [finalText, setFinalText] = useState('');
    const [photo, setPhoto] = useState('');
    // const resultString = useRef('Result');
    const [resultString, setResultString] = useState('Result')
    // const analyzeTex
    const [color, setColor] = useState('white');
    const [coin, setCoin] = useState('');
    const analyzeLink = (e)=>{
        
        e.preventDefault();
        if(text.length == 0)
        {
            setHidden(true);
            return;
        }
        console.log(`text = ${text}`)
        axios.post('/analyze_link',{text})
        .then(response=>{
            // console.log(response);
            //ok now we get the response
            console.log(response);
            // resultString.current = response.data;
            setResultString(response.data.result);
            setCoin(response.data.coin)
            setPhoto(response.data.imgURL);
            if(response.data.result.localeCompare('positive') == 0 )
            {
                setColor('green')
            }
            else if(response.data.result.localeCompare( 'negative')==0)
            {
                setColor('red')
            }
        })
        .catch(()=>{
            console.log('Failed')
        })
        setFinalText(text);
        setHidden(false);
        setText('')
    }
    console.log('result = ', resultString)

    
    return(
        <div className = "search_container">
            <form onSubmit = {analyzeLink}>
                <SearchIcon/>
                <input type="text" placeholder = 'Insert article link here' onChange = {(e)=>{
                    setText(e.target.value);
                }} value = {text}/>
            
            <button>
                Analyze
            </button>
            </form>
            
            {!hidden && <div>
            <div className="firstRow">
            <h3>Coin</h3>
            <h3>Image</h3>
            <h3>Link</h3>
            <h3>Result</h3>
            </div>
            <div className="secondRow">
                <h1>{coin}</h1>
                <img src={photo} alt="slika" height = '100px' width = '100px'/>
                <h5 className = "link">{finalText}</h5>
                <button style = {{backgroundColor: `${color}`, padding:'15px'}}>{resultString}</button>
            </div>

        </div>
}
        </div>

    )
}

export default Search;