import React from "react";
import { values } from "lodash";

import Rebase from 're-base';
var firebase = require('firebase');

const app = firebase.initializeApp({
  apiKey: "AIzaSyAQNTztslAbIFaZ306nO1zAxBz90B-47tc",
  authDomain: "mafia-f786c.firebaseapp.com",
  databaseURL: "https://mafia-f786c.firebaseio.com",
  storageBucket: "",
  messagingSenderId: "872061463737"
});

const base = Rebase.createClass(app.database());

// const { firebase } = window;

export default class Lobby extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			id: this.props.match.params.id,
			players: {}
		};
		// this.fetchPlayers = this.fetchPlayers.bind(this);
		// this.listenForUpdates = this.listenForUpdates.bind(this);
	}
  //
	// componentDidMount() {
	// 	this.fetchPlayers(this.props.match.params.id).then(
	// 		this.listenForUpdates(this.state.id)
	// 	);
	// }
  //
	// listenForUpdates(gameToken) {
	// 	const db = firebase
	// 		.database()
	// 		.ref("/gamesrooms" + gameToken)
	// 		.child("players")
	// 		.on("value", snapshot => {
	// 			if (this.state.players !== snapshot.val().players) {
	// 				this.setState({
	// 					players: snapshot.val().players
	// 				});
	// 			}
	// 		});
	// }
  //
	// fetchPlayers(id) {
	// 	return firebase
	// 		.database()
	// 		.ref("gamerooms/")
	// 		.child(this.state.id)
	// 		.once("value", snapshot => {
	// 			this.setState({
	// 				players: snapshot.val().players
	// 			});
	// 		});
	// }

  componentDidMount() {
    base.syncState(`gamerooms/${this.state.id}/players`,{
      context: this,
      state: 'players',
      asArray: true
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
