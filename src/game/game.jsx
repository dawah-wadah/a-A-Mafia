import React from "react";

const { firebase } = window;

export default class Game extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			token: this.props.token,
			players: {
				1: {
					name: "Wadah"
				}
			}
		};
	}

	componentDidMount() {
		this.listenForUpdates(this.state.token, (id, game) => {
			console.log(id);
			console.log(game);
		});
	}

	listenForUpdates(token, cb) {
		const db = firebase.database().ref("gamerooms");
	}

	render() {
		return <div>{this.state.token}</div>;
	}
}
