import React from "react";
import { app } from "../base.jsx";

class Timer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			endTime: null,
			min: "00",
			hour: 0,
			sec: "00",
			phase: "Nothing"
		};
		this.startTimer = this.startTimer.bind(this);
		this.fetchTime = this.fetchTime.bind(this);
	}

	componentDidMount() {
		this.clearAllIntervals();
		this.fetchTime(this.props);
	}

	componentWillUnmount() {
		this.clearAllIntervals();
	}

	startCycle() {
		var dayCycle = [
			{ phase: "Day", time: 15000 },
			{ phase: "Discussion", time: 45000 },
			{ phase: "Voting", time: 30000 },
			{ phase: "Defense", time: 20000 },
			{ phase: "Judgement", time: 20000 },
			{ phase: "Last Words", time: 5000 },
			{ phase: "Night", time: 40000 }
		];
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.day !== nextProps.day) {
			this.clearAllIntervals();
			this.fetchTime(nextProps);
		}
	}

	componentWillUpdate() {}

	fetchTime(props) {
		var currentDay = props.day;
		app
			.database()
			.ref(`gamerooms/${props.location}/daylogs/${currentDay}`)
			.on("value", snapshot => {
				if (snapshot.hasChild("endTime")) {
					this.setState({
						endTime: snapshot.val().endTime,
						phase: snapshot.val().phase
					});
					this.startTimer(snapshot.val().endTime);
				}
			});
	}

	listenforChange() {}

	clearAllIntervals() {
		clearInterval(this.state.intervalID);
	}

	startTimer(endTime) {
		if (endTime) {
			let x = setInterval(() => {
				let now = new Date().getTime();
				let timeLeft = endTime - now;
				let minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
				let seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
				this.setState({
					min: minutes.toLocaleString(undefined, { minimumIntegerDigits: 2 }),
					sec: seconds.toLocaleString(undefined, { minimumIntegerDigits: 2 })
				});
				if (timeLeft <= 1000) {
					console.log("time too low");
					clearInterval(this.state.intervalID);
					this.props.next();
					timeLeft = 100000;
					return;
				}
			}, 500);
			this.setState({
				intervalID: x
			});
		}
	}
	render() {
		return (
			<div className="container timer flex">
				<h2>{this.state.phase}</h2>
				<h2>
					{this.state.min}:{this.state.sec}
				</h2>
				<div className="btn" onClick={() => this.startTimer(30)}>
					Start Timer
				</div>
				<div className="btn" onClick={() => this.startTimer(90)}>
					Start Timer 90sec
				</div>
			</div>
		);
	}
}

export default Timer;
