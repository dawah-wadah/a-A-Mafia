import React from "react";
import { values } from "lodash";
import Promise from "es6-promise";
import * as Util from "../utility.js";
import Role from "../roles/role.js";

import { app, base } from "../base.jsx";

const userRef = (location, uid) =>
	app.database().ref("/gamerooms/" + location + "/players/" + uid + "/role");

export default class Lobby extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			location: this.props.match.params.id,
			players: this.props.players,
			leader: this.props.leader,
			start: this.props.start
		};
		this.getGameLeader = this.getGameLeader.bind(this);
		this.startGame = this.startGame.bind(this);
		// this.checkforGameStarted = this.checkforGameStarted.bind(this);
	}

	componentDidMount() {
		this.getGameLeader(this.state.location);
		// this.checkforGameStarted();
	}

	componentWillReceiveProps(nextProps) {
		if (this.state.start !== nextProps.start && nextProps.start) {
			this.setState({
				start: nextProps.uid
			});
		}
	}

	checkforGameStarted() {
		if (this.state.start) {
			this.props.history.push(`/game/${this.props.match.params.id}/game`);
		}
	}

	componentWillUpdate(nextProps, nextState) {
		if (nextProps.start === true || this.state.start === true) {
			this.props.history.push(`/game/${this.props.match.params.id}/game`);
		}
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
		const possibleRoles = [
			"Sheriff",
			"Doctor",
			"Investigator",
			"Godfather",
			"Mafioso",
			"Killer",
			"Vigilante",
			"Jester"
		];
		let location = this.props.match.params.id;
		let allPlayers = values(players);
		Util.shuffle(allPlayers);
		allPlayers.forEach(player => {
			let roleType = possibleRoles.shift();
			base.post(`gamerooms/${location}/players/${player.uid}/role`, {
				data: roleType
			});
			base.post(`gamerooms/${location}/players/${player.uid}/stats`, {
				data: new Role({
					name: player.name,
					roleType
				})
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
		this.props.startGame();
		this.assignRoles(this.props.players);
		this.props.history.push(`/game/${this.props.match.params.id}/game`);
	}

	render() {
		let activePlayers = [];
		let inactivePlayers = [];
		let playersWhoLeft = [];
		values(this.props.players).forEach(player => {
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
				) : (
					<div className="buttons">
						<div
							className="btn leave"
							onClick={() => this.leaveGame(this.props.uid)}
						>
							Leave Game
						</div>
					</div>
				)}
			</div>
		);
	}
}
