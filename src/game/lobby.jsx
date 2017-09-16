import React from "react";
import { values } from "lodash";

const { firebase } = window;

export default class Lobby extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			id: this.props.match.params.id,
			players: {}
		};
	}

	componentDidMount() {
		this.fetchPlayers(this.props.match.params.id);
	}

	fetchPlayers(id) {

		let players = firebase
			.database()
			.ref("gamerooms/")
			.child(this.state.id)
			.once("value", snapshot => {
        debugger
				this.setState({
					players: snapshot.val().players
				});
			});
	}

	render() {
		let allPlayers = values(this.state.players).map(player => (
			<div key={player.id}>{player.name}</div>
		));

		return (
			<div>
				<h1>Here are all the players</h1>
				{allPlayers}
			</div>
		);
	}
}
