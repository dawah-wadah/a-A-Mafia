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
		this.enableDisconnect();
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.uid !== nextProps.uid) {
			this.reconnect();
			this.enableDisconnect();
		}
	}

	reconnect() {
		if (this.props.uid) {
			userRef(
				this.props.match.params.id,
				this.props.uid
			).on("value", snapshot => {
				if (snapshot.exists()) {
					userRef(this.props.match.params.id, this.props.uid).update({
						active: true
					});
				} else {
					this.setState({
						open: true
					});
				}
			});
		}
	}

	enableDisconnect() {
		if (this.props.uid) {
			let location = this.props.match.params.id;
			let uid = this.props.uid;
			app
				.database()
				.ref(`gamerooms/${this.props.match.params.id}/`)
				.on("value", function(snapshot) {
					if (snapshot.exists()) {
						userRef(location, uid)
							.onDisconnect()
							.update({
								active: false
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
						<div className="btn leave" onClick={this.leaveGame.bind(this)}>
							Leave Game
						</div>
					</div>
				)}
			</div>
		);
	}
}
