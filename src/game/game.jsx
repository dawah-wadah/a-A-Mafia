import React from "react";
import { Switch } from "react-router-dom";
import PropRoute from "../proproutes.jsx";
import Lobby from "./lobby.jsx";
import LiveGame from "./live_game.jsx";
import { app } from "../base.jsx";
import Promise from "es6-promise";
import "../css/lobby.css";
import Modal from "../modal.jsx";
import SignInModal from "./sign_in_modal.jsx";

const userRef = (location, uid) =>
	app.database().ref("/gamerooms/" + location + "/players/" + uid);

export default class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			started: false,
			open: false
		};
		this.enableDisconnect = this.enableDisconnect.bind(this);
		this.leaveGame = this.leaveGame.bind(this);
	}

	startGame() {
		this.setState({
			started: true
		});
		this.props.history.push(`/game/${this.props.match.params.id}/game`);
	}

	leaveGame(playerId) {
		let id = this.props.match.params.id;
		return new Promise((resolve, reject) => {
				userRef(id, playerId).update({
					leftGame: true,
					active: false,
				})
				.then(
					userRef(id, playerId)
						.onDisconnect()
						.cancel()
				);
		}).then(this.props.history.push("/"));
	}

	componentDidMount() {
		console.log('Game Room Mounting');
		this.reconnect(this.props.uid);
		this.enableDisconnect(this.props.uid);
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.uid !== nextProps.uid) {
			this.reconnect(nextProps.uid);
			this.enableDisconnect(nextProps.uid);
		}
	}

	componentWillUnmount() {
		console.log("component shut down");
		// new Promise(function(resolve, reject) {
		// 	reject(this.reconnect(this.props.uid));
		// });
	}

	reconnect(playerId) {
		console.log("reconnecting...");
		if (playerId) {
			userRef(this.props.match.params.id, playerId).on("value", snapshot => {
				if (snapshot.exists() && !snapshot.val().leftGame) {
					userRef(this.props.match.params.id, playerId).update({
						active: true,
						leftGame: false
					});
				} else {
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
			let location = this.props.match.params.id;
			app
				.database()
				.ref(`gamerooms/${this.props.match.params.id}/`)
				.on("value", function(snapshot) {
					if (snapshot.exists()) {
						userRef(location, playerId)
							.onDisconnect()
							.update({
								active: false,
							});
					}
				});
		}
	}

	closeModal() {
		this.setState({
			open: false
		});
	}

	render() {
		return (
			<div className="game-view">
				{this.state.open ? (
					<Modal
						open={true}
						component={
							<SignInModal
								close={this.closeModal.bind(this)}
								location={this.props.match.params.id}
							/>
						}
					/>
				) : null}
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
				)}
			</div>
		);
	}
}
