import React from "react";
import { values } from "lodash";

import {base, app} from '../base.jsx';

export default class Lobby extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			id: this.props.match.params.id,
			players: {}
		};
	}


  componentDidMount() {
    base.syncState(`gamerooms/${this.state.id}/players`,{
      context: this,
      state: 'players',
    });

  }

	render() {
		let allPlayers = values(this.state.players).map(player => {

			return (
			<div key={player.id}>{player.name}{
					player.uid === this.props.uid ? ' (You)' : null
				}</div>
		);
	});

		return (
			<div>
				<h1>Here are all the players</h1>
				{allPlayers}
			</div>
		);
	}
}
