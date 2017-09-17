import React, { Component } from "react";
import { Switch, HashRouter } from "react-router-dom";
import Home from "./game/splash_page.jsx";
import './App.css';
import Game from './game/game.jsx';
import PropsRoute from './proproutes.jsx';
import { app } from "./base.jsx";

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			uid: null
		};
    this.signIn = this.signIn.bind(this);
	}

  componentDidMount() {
    this.signIn();
  }

	signIn() {
		app.auth().onAuthStateChanged(user => {
			if (user) {
				this.setState({
					uid: user.uid
				});
			} else {
				app
					.auth()
					.signInAnonymously()
					.then(() => this.signIn());
			}
		});
	}

	render() {
		return (
			<HashRouter>
				<div className="App">
					<Switch>
						<PropsRoute exact path ='/' component={Home} uid={this.state.uid}/>
						<PropsRoute path='/game/:id' component={Game} uid={this.state.uid} />
					</Switch>
				</div>
			</HashRouter>
		);
	}
}

export default App;
