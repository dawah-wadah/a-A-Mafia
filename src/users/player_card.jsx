import React from "react";

const { firebase } = window;

export default class PlayerCard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			id: this.props.playerId,
			gameId: this.props.gameId,
			role: null
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
					role: snapshot.val().role
				});
			});
	}

	render() {}
}
