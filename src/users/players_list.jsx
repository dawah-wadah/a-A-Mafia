import React from "react";
import { values } from "lodash";

class PlayerList extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {}

	render() {
		const abilities = {
			Doctor: "heal",
			Jester: null,
			Mafioso: "murder",
			Vigilante: "Eliminate",
			Investigator: "Investigate",
			Killer: "murder"
		};
		const allPlayers = values(this.props.players).map(player => (
			<div className="player-list-item flex four" key={player.name}>
				<div className="player-name">{player.name}</div>
				{abilities[player.role] ? (
					<div className="perform-ability-button">{abilities[player.role]}</div>
				) : null}
			</div>
		));
		return (
			<div className="container player-list-item">
				<h2>Players</h2>
				<div className="container">{allPlayers}</div>
			</div>
		);
	}
}

export default PlayerList;
