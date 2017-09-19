import React from "react";
import Promise from "es6-promise";

import { app } from "../base.jsx";

export default class PlayerCard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			id: this.props.uid,
			gameId: this.props.gameId,
			roleType: "doctor",
			role: {
				ability: "healing",
				image:
					"https://i.pinimg.com/originals/26/4e/30/264e30439c42387c1e3c48d2d038429d.png",
				allegiance: "town",
				win_condition: "town wins",
				description: null
			}
		};
		this.fetchRole = this.fetchRole.bind(this);
		this.getUserId = this.getUserId.bind(this);
	}

	componentDidMount() {
		this.fetchRole(this.props.uid);
	}
	componentWillReceiveProps(nextProps) {
		if (
			this.props.uid !== nextProps.uid &&
			this.state.role.description === null
		) {
			this.fetchRole(nextProps.uid);
		}
	}

	getUserId() {}

	fetchRole(id) {
		if (id) {
			app
				.database()
				.ref("gamerooms/" + this.state.gameId + "/players/" + id + "/role")
				.once("value", snapshot => {
					this.setState({
						roleType: snapshot.val()
					});
				})
				.then(
					app
						.database()
						.ref("roles/" + this.state.roleType)
						.once("value", snapshot => {
							this.setState({
								role: snapshot.val()
							});
						})
				);
		}
	}

	render() {
		return (
			<div className="container top-buffer">
				<div className="player-list-item header">{this.state.roleType}</div>
				<div className="player-list-item allegiance">
					Allegiance: {this.state.role.allegiance}
				</div>
				<div className="player-list-item image">
					<img src={this.state.role.image} />
				</div>
				<div className="player-list-item player-abilities">
					{this.state.role.abilities}
				</div>
				<div className="player-list-item player-description">
					{this.state.role.description}
				</div>
			</div>
		);
	}
}
