import React from "react";
import { Switch } from "react-router-dom";
import PropRoute from "../proproutes.jsx";
import Lobby from "./lobby.jsx";
import LiveGame from "./live_game.jsx";
import { app } from "../base.jsx";
import Promise from "es6-promise";
import "../css/lobby.css";

const userRef = (location, uid) => (
	app.database().ref("/gamerooms/" + location + "/players/" + uid)
);

export default class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			started: false
		};
		this.leaveGame = this.leaveGame.bind(this);
		this.disconnect = this.disconnect.bind(this);
	}

	startGame() {
		this.setState({
			started: true
		});
		this.props.history.push(`/game/${this.props.match.params.id}/game`);
	}

	leaveGame() {
		console.log("clicked");
		let id = this.props.match.params.id;
		let uid = this.props.uid;
		new Promise(function(resolve, reject) {
			app
				.database()
				.ref(`/gamerooms/${id}/players/${uid}`)
				.remove();
		});
	}

	componentDidMount() {
		this.reconnect();
		this.disconnect();
	}

	reconnect() {
		userRef(
			this.props.match.params.id,
			this.props.uid
		).on("value", snapshot => {
			if (snapshot.exists()) {
				userRef(this.props.match.params.id, this.props.uid).update({
					active: true
				});
			}
		});
	}

	disconnect() {
		let location = this.props.match.params.id;
		let uid = this.props.uid;
		app
			.database()
			.ref(`gamerooms/${this.props.match.params.id}/`)
			.on("value", function(snapshot) {
				if (snapshot.val()) {
					userRef(location, uid).onDisconnect().update({
						active: false
					});
				}
			});
	}

	render() {
		return (
			<div className="game-view">
				<Switch>
					<PropRoute
						exact
						path="/game/:id/"
						component={Lobby}
						uid={this.props.uid}
					/>
					<PropRoute
						exact
						path="/game/:id/game"
						component={LiveGame}
						uid={this.props.uid}
					/>
				</Switch>
				{this.state.started ? null : (
					<div className="buttons">
						<div
							className="mui-btn mui-btn-primary start"
							onClick={this.startGame.bind(this)}
						>
							Start Game
						</div>
						<div
							className="mui-btn mui-btn-primary leave"
							onClick={this.leaveGame.bind(this)}
						>
							Leave Game
						</div>
					</div>
				)}
			</div>
		);
	}
}
