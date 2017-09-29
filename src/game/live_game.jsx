import React from "react";
import { app, base } from "../base.jsx";
import PlayerCard from "../users/player_card.jsx";
import PlayerList from "../users/players_list.jsx";
import Timer from "./timer.jsx";

export default class LiveGame extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			uid: this.props.uid,
			leader: this.props.leader,
			isLeader: false,
			stats: {},
			cycleIndex: 0,
			dayCount: 0
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

	nextTimeCycle() {
		console.log("firing next day cycle");
		this.setState({
			cycleIndex: this.state.cycleIndex + 1
		});
		if (this.state.cycleIndex > 6) {
			this.setState({
				cycleIndex: 0,
				dayCount: this.state.dayCount + 1
			});
		}
		this.signalTimerStarted(this.props.match.params.id);
	}

	signalTimerStarted(locations) {
		var gameRef = app
			.database()
			.ref("/gamerooms/" + locations + "/countdownStarted");
		gameRef.once("value", snapshot => {
			if (snapshot.val() === false) {
				gameRef.set(true);
				this.sendTime(this.state.isLeader);
			}
		});
	}

	sendTime(bool) {
		if (bool) {
			var phaseArray = [
				{ phase: "Day", time: 15000 },
				{ phase: "Discussion", time: 45000 },
				{ phase: "Voting", time: 30000 },
				{ phase: "Defense", time: 20000 },
				{ phase: "Judgement", time: 20000 },
				{ phase: "Last Words", time: 5000 },
				{ phase: "Night", time: 40000 }
			];
			var time = Date.now() + phaseArray[this.state.cycleIndex].time;
			var actualTime = new Date(time);
			var day = this.state.dayCount;
			console.log(actualTime.toLocaleTimeString());
			app
				.database()
				.ref(`gamerooms/${this.props.match.params.id}/daylogs/` + day)
				.set({
					phase: phaseArray[this.state.cycleIndex].phase,
					endTime: time
				});
		}
	}
	//
	componentDidMount() {
		this.signIn();
		if (this.props.leader) {
			var val = this.iAmTheLeader(this.props);
			this.syncWithServer(this.props);
			// this.sendTime(val);
			this.signalTimerStarted(this.props.match.params.id);
		}
	}

	iAmTheLeader(props) {
		var val = props.leader === props.uid ? true : false;
		this.setState({
			isLeader: val,
			uid: props.uid,
			leader: props.leader
		});
		return val;
	}

	componentWillReceiveProps(nextProps) {
		if (
			this.props.uid !== nextProps.uid ||
			this.props.leader !== nextProps.leader
		) {
			var val = this.iAmTheLeader(nextProps);
			this.syncWithServer(nextProps);
			// this.sendTime(val);
			this.signalTimerStarted(nextProps.match.params.id);
		}
	}

	syncWithServer(props) {
		console.log("syncing");
	}

	startCycle() {
		return [
			{ phase: "Day", time: 15000 },
			{ phase: "Discussion", time: 45000 },
			{ phase: "Voting", time: 30000 },
			{ phase: "Defense", time: 20000 },
			{ phase: "Judgement", time: 20000 },
			{ phase: "Last Words", time: 5000 },
			{ phase: "Night", time: 40000 }
		];
	}

	render() {
		return (
			<div className="container">
				<Timer
					location={this.props.match.params.id}
					leader={this.state.leader}
					day={this.state.dayCount}
					cycleIndex={this.state.cycleIndex}
					next={this.nextTimeCycle.bind(this)}
				/>
				<PlayerCard uid={this.state.uid} gameId={this.props.match.params.id} />
				<PlayerList players={this.props.players} />
			</div>
		);
	}
}
