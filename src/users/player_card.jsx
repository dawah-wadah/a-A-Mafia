import React from "react";

const { firebase } = window;

export default class PlayerCard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			id: this.props.playerId,
			gameId: this.props.gameId,
			roleType: null,
			role: {
				ability: "healing",
				image:
					"https://i.pinimg.com/originals/26/4e/30/264e30439c42387c1e3c48d2d038429d.png",
				allegiance: "town",
				win_condition: "town wins",
				description:
					"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
			}
		};
	}

	componentDidMount() {
		this.fetchRole(this.state.id);
	}

	fetchRole(id) {
		firebase.database
			.ref("gamerooms" + this.state.gameId + this.state.id)
			.once("value", snapshot => {
				this.setState({
					roleType: snapshot.val().role
				});
			})
			.then(
				firebase.database
					.ref("roles" + this.state.roleType)
					.once("value", snapshot =>
						this.setState({
							role: snapshot.val()
						})
					)
			);
	}

	render() {
		return (
			<div className="playerCard">
				<div className="playerCard-header">{this.state.roleType}</div>
				<div className="player-image">
					<img src={this.state.role.image} />
				</div>
				<div className="player-abilities">{this.state.role.abilities}</div>
				<div className="player-description">{this.state.role.description}</div>
			</div>
		);
	}
}
