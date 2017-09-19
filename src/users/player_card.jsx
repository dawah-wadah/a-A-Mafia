import React from "react";
import Promise from "es6-promise";

import { app, base } from "../base.jsx";

const userRef = (location, uid) =>
	app.database().ref("/gamerooms/" + location + "/players/" + uid + "/role");
const userRefString = (location, uid) =>
	"/gamerooms/" + location + "/players/" + uid + "/role";

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
			}
		};
		this.fetchRole = this.fetchRole.bind(this);
		this.getUserId = this.getUserId.bind(this);
	}

	componentDidMount() {
		if (this.props.uid) {
			this.fetchRole(this.props.uid, this.state.gameId);
		}
	}
	componentWillReceiveProps(nextProps) {
		if (
			this.props.uid !== nextProps.uid &&
			this.state.role.description === ""
		) {
			this.fetchRole(nextProps.uid, this.state.gameId);
		}
	}

	getUserId() {}

	fetchRole(id, location) {
		if (id && location && this.state.roleType === null) {
			userRef(location, id)
				.once("value", snapshot => {
					this.setState({
						roleType: snapshot.val()
					});
				})
				.then(data => {
					app
						.database()
						.ref(`roles/${data.val()}`)
						.on("value", info => {
							this.setState({
								role: info.val()
							});
						});
				});
		}
	}

	render() {
		return (
			<div className="container top-buffer">
				<div className="player-list-item header">{this.state.roleType}</div>

				<div className="player-list-item allegiance">
					Allegiance: {this.state.role.allegiance}
				</div>
				<div className="player-list-item win">
					How To Win: {this.state.role.win_condition}
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
