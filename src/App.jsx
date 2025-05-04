import LandingPage from './components/LandingPage';

function App(){
    const handleStart = () =>{
        alert("Journey Started!")
    }
    return <LandingPage onStart={handleStart}/>
}

export default App;