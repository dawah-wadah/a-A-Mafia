import React from "react";
import { values } from "lodash";

import { base } from "../base.jsx";

export default class Lobby extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			id: this.props.match.params.id,
			players: {},
			leader: null,
		};
	}

	componentDidMount() {
		base.syncState(`gamerooms/${this.state.id}/players`, {
			context: this,
			state: "players"
		});
	}

	render() {
		let allPlayers = values(this.state.players).map(player => {
			if (player) {
				if (player.active) {
					return (
						<div className="player-list-item" key={player.uid}>
							{player.name}
							{player.uid === this.props.uid ? " (You)" : null}
						</div>
					);
				} else {
					return (
						<div className="player-list-item" key={player.uid}>
							{player.name} (Inactive )
						</div>
					);
				}
			} else {
				return;
			}
		});

		return (
			<div className="container">
				<h1>Here are all the players</h1>
				{allPlayers}
			</div>
		);
	}
}
