import React from "react";
import Util from "../utility.js";

const { firebase } = window;

export default class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: "",
			gameId: ""
		};
	}

	_makeGame() {
		let id = Util.makeId(8);
		let playerID = Util.makeId(3);
		const game = firebase.database().ref("gamerooms/");
		game
			.child(id)
			.set({
				start: false,
				players: {
					[playerID]: {
						name: this.state.name,
						id: playerID
					}
				},
				phase: "day",
				game_over: false
			})
			.then(this.props.history.push(`/game/${id}`));
	}

	_joinGame() {
    let playerID = Util.makeId(3);

    const game = firebase.database().ref("gamerooms/");
    game
      .child(this.state.gameId).child('players').child(playerID).set({
          name: this.state.name,
          id: playerID
      }).then(this.props.history.push(`/game/${this.state.gameId}`));
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
					<div className="btn join-game" onClick={() => this._joinGame(this.state.gameId)}>
						<label>
              Join a Game
							<input onChange={e => this._handleChange(e, "gameId")} />
						</label>
					</div>
				</div>
			</div>
		);
	}
}
