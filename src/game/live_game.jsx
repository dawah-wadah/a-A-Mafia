import React from "react";
import { app, base } from "../base.jsx";
import PlayerCard from '../users/player_card.jsx';

export default class LiveGame extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			uid: this.props.uid,
			stats: {}
		};
		this.signIn = this.signIn.bind(this);
	}


	signIn() {
		app.auth().onAuthStateChanged(user => {
			if (user) {
				this.setState({
					uid: user.uid
				});
			} else {
				app
					.auth()
					.signInAnonymously()
					.then(() => this.signIn());
			}
		});
	}

	componentDidMount() {
		this.signIn();
		if (this.props.uid) {
			base.syncState(
				`gamerooms/${this.props.match.params.id}/players/${this.props.uid}`,
				{
					context: this,
					state: "stats"
				}
			);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.uid !== nextProps.uid) {
			base.syncState(
				`gamerooms/${nextProps.match.params.id}/players/${nextProps.uid}`,
				{
					context: this,
					state: "stats"
				}
			);
		}
	}


	render() {
		return (
			<PlayerCard uid={this.state.uid} gameId={this.props.match.params.id}/>
		);
	}
}
