import React from "react";
import { Switch } from "react-router-dom";
import PropRoute from "../proproutes.jsx";
import Lobby from "./lobby.jsx";
import LiveGame from "./live_game.jsx";
import { app, base } from "../base.jsx";
import "../css/lobby.css";
import Modal from "../modal.jsx";
import SignInModal from "./sign_in_modal.jsx";
import Invite from "./invite.jsx";
import Promise from "es6-promise";

const userRef = (location, uid) =>
	app.database().ref("/gamerooms/" + location + "/players/" + uid);

export default class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			uid: this.props.uid,
			open: false,
			invite: false,
			location: this.props.match.params.id,
			leader: null,
			game: {
				players: {},
				phase: "",
				start: null,
				leader: null,
				game_over: null,
				daylogs: null
			}
		};
		this.enableDisconnect = this.enableDisconnect.bind(this);
		this.fetchGame = this.fetchGame.bind(this);
		this.signalStart = this.signalStart.bind(this);
	}

	fetchGame(location) {
		console.log("fetching game");
		if (location) {
			app
				.database()
				.ref("gamerooms/" + location)
				.on("value", snapshot => {
					this.setState({
						game: snapshot.val(),
						leader: snapshot.val().leader
					});
				});
		}
	}

	componentDidMount() {
		if (this.state.uid) {
			this.reconnect(this.state.uid);
			this.enableDisconnect(this.state.uid);
		}
		this.fetchGame(this.state.location);
	}

	componentWillReceiveProps(nextProps) {
		if (this.state.uid !== nextProps.uid && nextProps.uid) {
			this.setState({
				uid: nextProps.uid
			});
			this.reconnect(nextProps.uid);
			this.enableDisconnect(nextProps.uid);
			this.fetchGame(nextProps.match.params.id);
		}
	}

	signalStart() {
		base.post(`gamerooms/${this.props.match.params.id}/start`, {
			data: true
		});
	}

	reconnect(playerId) {
		console.log("reconnecting...");
		if (playerId) {
			userRef(this.state.location, playerId).on("value", snapshot => {
				if (snapshot.exists() && !snapshot.val().leftGame) {
					userRef(this.state.location, playerId).update({
						active: true,
						leftGame: false
					});
				} else {
					console.log("not logged in");
					this.setState({
						open: true
					});
				}
			});
		}
	}

	enableDisconnect(playerId) {
		console.log("setting up disconnect");
		if (playerId) {
			let location = this.state.location;
			app
				.database()
				.ref(`gamerooms/${this.state.location}/`)
				.on("value", function(snapshot) {
					if (snapshot.exists()) {
						userRef(location, playerId)
							.onDisconnect()
							.update({
								active: false
							});
					}
				});
		}
	}

	leaveGame(playerId) {
		let id = this.state.location;
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

	sendInvite() {
		this.setState({
			open: true,
			invite: true
		});
	}

	closeModal() {
		this.setState({
			open: false,
			invite: false
		});
	}

	render() {
		return (
			<div className="game-view">
				<div className="buttons">
					<div
						className="btn red"
						onClick={() => this.leaveGame(this.props.uid)}
					>
						Leave Game
					</div>
					<div className="btn blue" onClick={() => this.sendInvite()}>
						Invite
					</div>
				</div>
				<div className="container">
					{this.state.open ? (
						<Modal
							open={true}
							component={
								<SignInModal
									close={this.closeModal.bind(this)}
									location={this.state.location}
								/>
							}
						/>
					) : null}
					{this.state.open && this.state.invite ? (
						<Modal
							open={true}
							component={<Invite close={this.closeModal.bind(this)} />}
						/>
					) : null}
					<Switch>
						<PropRoute
							exact
							path="/game/:id/"
							component={Lobby}
							uid={this.state.uid}
							leader={this.state.game.leader}
							start={this.state.game.start}
							players={this.state.game.players}
							startGame={() => this.signalStart()}
						/>
						<PropRoute
							exact
							path="/game/:id/game"
							component={LiveGame}
							uid={this.state.uid}
							leader={this.state.leader}
							start={this.state.game.start}
							players={this.state.game.players}
							daylogs={this.state.game.daylogs}
						/>
					</Switch>
				</div>
			</div>
		);
	}
}
