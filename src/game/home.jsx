import React from "react";
import Util from "../utility.jsx";

const { firebase } = window;

export default class Home extends React.Component {
	constructor(props) {
		super(props);
	}

	_makeGame() {
		let id = Util.makeId(8);
		firebase.database.ref("gamerooms" + id).set({
			start: false,
			players: {},
			phase: "day",
			game_over: false
		}).then(
      this.props.history.push(`/game/${id}`)
    );
	}

	render() {
		return (
			<div className="sub-window">
				<h1>Welcome to aA Mafia</h1>
				<div>
					<div className="btn new-game">New Game</div>
					<div className="btn join-game">Join a Game</div>
				</div>
			</div>
		);
	}
}
