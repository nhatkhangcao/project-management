import './App.css';
import { BrowserRouter } from 'react-router-dom';
import Routing from './router/Routing';
import axios from 'axios';

function App() {
 
  return (
    <div className="App">

    <BrowserRouter>
        <Routing>
        </Routing>
      </BrowserRouter> 


    </div>
  );
}

export default App;
