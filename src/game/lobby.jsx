import React from "react";
import { values } from "lodash";

import BaseGod from '../BaseGod.jsx';

export default class Lobby extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			id: this.props.match.params.id,
			players: {}
		};
	}


  componentDidMount() {
    BaseGod.syncState(`gamerooms/${this.state.id}/players`,{
      context: this,
      state: 'players',
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
