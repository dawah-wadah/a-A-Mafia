import React from "react";
import Util from "../utility.js";
import { NotificationManager } from "react-notifications";
import "react-notifications/lib/notifications.css";
import { base, app } from "../base.jsx";
import Promise from "es6-promise";

export default class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: "",
			gameId: "",
			uid: this.props.uid
		};

		this._validGameId = this._validGameId.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.uid !== nextProps.uid) {
			this.setState({
				uid: nextProps.uid
			});
		}
	}

	_makeGame() {
		if (this._userHasAName()) {
			let id = Util.makeId(8);
			base
				.post(`gamerooms/${id}`, {
					data: {
						start: false,
						players: {
							[this.state.uid]: {
								name: this.state.name,
								uid: this.state.uid,
								active: true,
								leftGame: false,
								role: null
							}
						},
						phase: "day",
						game_over: false,
						leader: this.props.uid
					}
				})
				.then(this.props.history.push(`/game/${id}`));
		}
	}

	_userHasAName() {
		if (this.state.name !== "" && this.state.name.length > 3) {
			return true;
		} else {
			NotificationManager.error("Please Enter a Valid Name", "Error", 2000);
			return false;
		}
	}

	_validGameId() {
		let id = this.state.gameId;
		return new Promise(function(resolve, reject) {
			app
				.database()
				.ref(`gamerooms/`)
				.once("value", snapshot => {
					snapshot.hasChild(id) ? resolve() : reject();
				});
		});
	}

	_joinGame() {
		if (this.state.gameId !== "") {
			this._validGameId().then(
				() => {
					if (this._userHasAName()) {
						let reference = app
							.database()
							.ref(`gamerooms/${this.state.gameId}/players/`);
						if (
							new Promise(function(resolve, reject) {
								reference.hasChild(this.state.uid) ? resolve() : reject();
							})
						) {
							base
								.update(
									`gamerooms/${this.state.gameId}/players/${this.state.uid}`,
									{
										data: {
											name: this.state.name,
											uid: this.state.uid,
											active: true,
											leftGame: false,
											role: null
										}
									}
								)
								.then(this.props.history.push(`/game/${this.state.gameId}`));
						} else {
							base
								.post(
									`gamerooms/${this.state.gameId}/players/${this.state.uid}`,
									{
										data: {
											name: this.state.name,
											uid: this.state.uid,
											active: true,
											leftGame: false,
											role: null
										}
									}
								)
								.then(this.props.history.push(`/game/${this.state.gameId}`));
						}
					}
				},
				() => {
					NotificationManager.error("Enter a Valid Game", "Error", 2000);
				}
			);
		} else {
			NotificationManager.error("Enter a Valid Game", "Error", 2000);
		}
	}

	_handleChange(e, field) {
		this.setState({
			[field]: e.currentTarget.value
		});
	}

	render() {
		return (
			<div className="container">
				<h1>Welcome to aA Mafia</h1>
				<div className="input-container">
					<div className="name-container">
						<label>
							<input
								className="text-input"
								type="text"
								onChange={e => this._handleChange(e, "name")}
								placeholder="Whats Your Name"
							/>
						</label>
						<label>
							<input
								className="text-input"
								onChange={e => this._handleChange(e, "gameId")}
								placeholder="Enter Gameroom ID"
							/>
						</label>
					</div>
					<div className="buttons">
						<div
							className="mui-btn mui-btn--primary new-game"
							onClick={this._makeGame.bind(this)}
						>
							New Game
						</div>
						<div
							className="mui-btn mui-btn--primary join-game"
							onClick={this._joinGame.bind(this)}
						>
							Join a Game
						</div>
					</div>
				</div>
			</div>
		);
	}
}
