import React from "react";

import { app } from "../base.jsx";

// const userRef = (location, uid) =>
// 	app.database().ref("/gamerooms/" + location + "/players/" + uid + "/role");

const userRef = (location, uid) =>
	app.database().ref("/gamerooms/" + location + "/players/" + uid );


export default class PlayerCard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			id: this.props.uid,
			gameId: this.props.gameId,
			roleType: null,
			role: {
				ability: "",
				allegiance: "",
				image: "",
				win_condition: "",
				description: ""
			},
			stats : {},
			roleFetch: false
		};
		this.fetchRole = this.fetchRole.bind(this);
		// this.getUserId = this.getUserId.bind(this);
	}

	componentDidMount() {
		if (this.props.uid) {
			this.fetchRole(this.props.uid, this.props.gameId);
		}
	}
	componentWillReceiveProps(nextProps) {
		if (
			nextProps.uid &&
			this.state.role.description === ""
		) {
			this.fetchRole(nextProps.uid, nextProps.gameId);
		}
	}


	fetchRole(id, location) {
		if (id && location && this.state.roleType === null) {
			userRef(location, id)
				.once("value", snapshot => {
					this.setState({
						roleType: snapshot.val().role,
						stats: snapshot.val().stats
					});
				})
				.then(data => {
					app
						.database()
						.ref(`roles/${data.val().role}`)
						.once("value", info => {
							this.setState({
								role: info.val()
							});
							if (this.state.role !== null) {
								this.setState({
									roleFetch: true
								});
							} else {
								this.setState({
									roleFetch: false
								});
							}
						});
				});
		}
	}

	render() {
		return (
			<div className="container top-buffer player-list-item">
				<h2>Role Card</h2>
				{this.state.roleFetch ? (
					<div>
						<div className="player-list-item header">
							{this.state.roleType}
						</div>
						<div className="player-list-item image">
							<img src={this.state.role.image} alt="pic" />
						</div>
						<div className="player-list-item allegiance">
							<h2>Allegiance</h2>
							{this.state.role.allegiance}
						</div>
						<div className="player-list-item win">
							<h2>How to Win</h2>
							{this.state.role.win_condition}
						</div>
						<div className="player-list-item player-abilities">
							<h2>Abilities</h2>
							{this.state.role.abilities}
						</div>
						<div className="player-list-item player-description">
							<h2>Description</h2>
							{this.state.role.description}
						</div>
					</div>
				) : null}
			</div>
		);
	}
}
