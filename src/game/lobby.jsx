import React from "react";
import { sample, values } from "lodash";
import Promise from "es6-promise";

import { app, base } from "../base.jsx";

const userRef = (location, uid) =>
	app.database().ref("/gamerooms/" + location + "/players/" + uid + "/role");

export default class Lobby extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			id: this.props.match.params.id,
			players: {},
			leader: null
		};
		this.getGameLeader = this.getGameLeader.bind(this);
		this.startGame = this.startGame.bind(this);
	}

	componentDidMount() {
		base.syncState(`gamerooms/${this.state.id}/players`, {
			context: this,
			state: "players"
		});
		this.getGameLeader(this.state.id);
	}

	startGame() {
		this.assignRoles(this.state.players).then(
			this.props.history.push(`/game/${this.props.match.params.id}/game`)
		);
	}

	getGameLeader(gameId) {
		app
			.database()
			.ref(`gamerooms/${gameId}/leader`)
			.on("value", snapshot => {
				this.setState({
					leader: snapshot.val()
				});
			});
	}

	assignRoles(players) {
		const possibleRoles = ["Doctor", "Killer", "Investigator", "Mafioso"];
		let location = this.props.match.params.id;
		values(players).forEach(player => {
			base.post(`gamerooms/${location}/players/${player.uid}/role`, {
				data: sample(possibleRoles)
			});
		});
	}

	leaveGame(playerId) {
		let id = this.props.match.params.id;
		return new Promise((resolve, reject) => {
			userRef(id, playerId)
				.update({
					leftGame: true,
					active: false
				})
				.then(
					userRef(id, playerId)
						.onDisconnect()
						.cancel()
				);
		}).then(this.props.history.push("/"));
	}

	startGame() {
		this.setState({
			started: true
		});
		this.assignRoles(this.state.players);
		this.props.history.push(`/game/${this.props.match.params.id}/game`);
	}

	render() {
		let activePlayers = [];
		let inactivePlayers = [];
		let playersWhoLeft = [];
		values(this.state.players).forEach(player => {
			if (player) {
				if (player.active) {
					activePlayers.push(
						<div className="player-list-item" key={player.uid}>
							{player.name}
							{player.uid === this.props.uid ? " (You)" : null}
						</div>
					);
				} else if (!player.active && !player.leftGame) {
					inactivePlayers.push(
						<div className="player-list-item" key={player.uid}>
							{player.name} (Inactive )
						</div>
					);
				} else {
					playersWhoLeft.push(
						<div className="player-list-item" key={player.uid}>
							{player.name} (Gone But Not Forgotten )
						</div>
					);
				}
			} else {
				return;
			}
		});

		return (
			<div className="container">
				<h1>Here are all the players</h1>
				<div className="container">
					<h2>Active Players</h2>
					{activePlayers}
					<h2>Inactive Player</h2>
					{inactivePlayers}
					<h2>Players No Longer With Us (RIP)</h2>
					{playersWhoLeft}
				</div>
				{this.state.leader === this.props.uid ? (
					<div className="buttons">
						<div className="btn start" onClick={this.startGame.bind(this)}>
							Start Game
						</div>
						<div
							className="btn leave"
							onClick={() => this.leaveGame(this.props.uid)}
						>
							Leave Game
						</div>
					</div>
				) : null}
			</div>
		);
	}
}
