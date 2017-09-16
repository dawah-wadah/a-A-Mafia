import React, { Component } from 'react';
import {Switch, HashRouter, Route} from 'react-router-dom';
import Home from './game/home.jsx';
import Lobby from './game/lobby.jsx';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <HashRouter>

      <div className="App">
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/game/:id' component={Lobby} />
        </Switch>
      </div>
    </HashRouter>
    );
  }
}

export default App;
