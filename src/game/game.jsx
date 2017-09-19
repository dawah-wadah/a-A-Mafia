import React from "react";
import { Switch } from "react-router-dom";
import PropRoute from "../proproutes.jsx";
import Lobby from "./lobby.jsx";
import LiveGame from "./live_game.jsx";
import { app } from "../base.jsx";
import "../css/lobby.css";
import Modal from "../modal.jsx";
import SignInModal from "./sign_in_modal.jsx";

const userRef = (location, uid) =>
	app.database().ref("/gamerooms/" + location + "/players/" + uid);

export default class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			uid: this.props.uid,
			open: false
		};
		this.enableDisconnect = this.enableDisconnect.bind(this);
	}

	componentDidMount() {
		console.log("Game Room Mounting");
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
			</div>
		);
	}
}
