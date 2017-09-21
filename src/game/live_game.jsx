import React from "react";
import { app, base } from "../base.jsx";
import PlayerCard from "../users/player_card.jsx";
import PlayerList from "../users/players_list.jsx";
import Timer from './timer.jsx';

export default class LiveGame extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			uid: this.props.uid,
			stats: {}
		};
		this.signIn = this.signIn.bind(this);
		this.syncWithServer = this.syncWithServer.bind(this);
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
	//
	componentDidMount() {
		this.signIn();
		if (this.props.uid) {
			this.syncWithServer(this.props);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.uid !== nextProps.uid) {
			this.setState({
				uid: nextProps.uid
			});
			this.syncWithServer(nextProps);
		}
	}

	syncWithServer(props) {
		base.syncState(`gamerooms/${props.match.params.id}/players/${props.uid}`, {
			context: this,
			state: "stats"
		});
	}

	render() {
		return (
			<div className="container">
				<Timer/>
				<PlayerCard uid={this.state.uid} gameId={this.props.match.params.id} />
				<PlayerList players={this.props.players} />
			</div>
		);
	}
}
