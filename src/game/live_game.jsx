import React from "react";
import { base } from "../base.jsx";
import {values} from 'lodash';

export default class LiveGame extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			stats: {}
		};
	}

	componentDidMount() {
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
		const allStats = values(this.state.stats).map((stat) => (
			<div className="player-list-item">{stat}</div>
		));
		return (
			<div className="container">
				{allStats}
			</div>
		);
	}
}
