import React from "react";
import Util from "../utility.js";
import {
	NotificationContainer,
	NotificationManager
} from "react-notifications";
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



	componentWillReceiveProps(nextProps){
		if (this.props.uid !== nextProps.uid){
			this.setState({
				uid: nextProps.uid
			});
		}
	}


	_makeGame() {
		if (this._userHasAName()) {
			let id = Util.makeId(8);
			let playerID = Util.makeId(3);
			base
				.post(`gamerooms/${id}`, {
					data: {
						start: false,
						players: {
							[playerID]: {
								name: this.state.name,
								id: playerID,
								uid: this.state.uid
							}
						},
						phase: "day",
						game_over: false
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

	_signIn() {}

	_joinGame() {
		this._validGameId().then(
			() => {
				if (this._userHasAName()) {
					let playerID = Util.makeId(3);

					base
						.post(`gamerooms/${this.state.gameId}/players/${playerID}`, {
							data: {
								name: this.state.name,
								id: playerID,
								uid: this.state.uid
							}
						})
						.then(this.props.history.push(`/game/${this.state.gameId}`));
				}
			},
			() => {
				NotificationManager.error("Enter a Valid Game", "Error", 2000);
			}
		);
	}

	_handleChange(e, field) {
		this.setState({
			[field]: e.currentTarget.value
		});
	}

	render() {
		return (
			<div className="sub-window">
				<h1>Welcome to aA Mafia</h1>
				<div>
					<div>
						<label>
							<input
								type="text"
								onChange={e => this._handleChange(e, "name")}
							/>
						</label>
					</div>
					<div className="btn new-game" onClick={this._makeGame.bind(this)}>
						New Game
					</div>
					<div className="btn join-game" onClick={this._joinGame.bind(this)}>
						Join a Game
					</div>
					<label>
						<input onChange={e => this._handleChange(e, "gameId")} />
					</label>
				</div>
				<NotificationContainer />
			</div>
		);
	}
}
