import logo from './logo.svg';
import {BrowserRouter, Switch, Route, Link} from 'react-router-dom';
import Statistics from './Statistics';
import Home from "./Home";
import './App.css';

function App(props) {
  return (
    <BrowserRouter>
      <div>
        <nav>
          <li><Link to="/">List</Link></li>
          <li><Link to="/statistics">Statistics</Link></li>
        </nav>
        <Switch>
          <Route path="/statistics"><Statistics /></Route>
          <Route path="/"><Home client={props.client} /></Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
