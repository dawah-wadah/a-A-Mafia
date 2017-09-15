import React from "react";

const { firebase } = window;

export default class Lobby extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			id: this.props.match.params.id,
			player: {}
		};
	}

	componentDidMount() {
		this.fetchPlayers(this.props.match.params.id);
	}

	fetchPlayers(id) {
		let players = firebase.database
			.ref("gamerooms/" + id)
			.once("value", snapshot => {
				this.setState({
					players: snapshot.val().players
				});
			});
	}

	render() {
		let allPlayers = this.state.player.map(player => <div>{player.name}</div>);

		return (
			<div>
				<h1>Here are all the players</h1>
				{allPlayers}
			</div>
		);
	}
}
