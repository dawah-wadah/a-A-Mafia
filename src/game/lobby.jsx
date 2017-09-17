import React from "react";
import { values } from "lodash";

import { base } from "../base.jsx";

export default class Lobby extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			id: this.props.match.params.id,
			players: {},
			leader: null
		};
	}

	componentDidMount() {
		base.syncState(`gamerooms/${this.state.id}/players`, {
			context: this,
			state: "players"
		});
	}

	render() {
		let activePlayers = [];
		let inactivePlayers = [];
		let playersWhoLeft = [];
		values(this.state.players).forEach(player => {
			if (player) {
				if (player.active) {
					activePlayers.push(
						<div className="player-list-item" key={player.uid}>
							{player.name}
							{player.uid === this.props.uid ? " (You)" : null}
						</div>
					);
				} else if (!player.active && !player.leftGame) {
					inactivePlayers.push(
						<div className="player-list-item" key={player.uid}>
							{player.name} (Inactive )
						</div>
					);
				} else {
					playersWhoLeft.push(
						<div className="player-list-item" key={player.uid}>
							{player.name} (Gone But Not Forgotten )
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
				<div className='container'>
					<h2>Active Players</h2>
					{activePlayers}
					<h2>Inactive Player</h2>
					{inactivePlayers}
					<h2>Players No Longer With Us (RIP)</h2>
					{playersWhoLeft}
				</div>
			</div>
		);
	}
}
