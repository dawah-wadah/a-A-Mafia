import React from "react";
import { Switch } from "react-router-dom";
import PropRoute from "../proproutes.jsx";
import Lobby from "./lobby.jsx";
import LiveGame from "./live_game.jsx";

export default class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			started: false
		};
	}

	startGame() {
		this.setState({
			started: true
		});
		this.props.history.push(`/game/${this.props.match.params.id}/game`);
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
					<div className="btn start" onClick={this.startGame.bind(this)}>
						Start Game
					</div>
				)}
			</div>
		);
	}
}
