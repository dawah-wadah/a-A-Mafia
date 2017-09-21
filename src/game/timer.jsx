import React from "react";

class Timer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			min: "00",
			hour: 0,
			sec: "00"
		};
		this.startTimer = this.startTimer.bind(this);
	}

	componentDidMount() {}

	startTimer(time) {
		let timeNow = new Date().getTime() + 31000;
		// var countDownDate = new Date(timeNow + 100000).getTime();
		// let countDownDate = new Date("Sep 21, 2017 00:27:30").getTime();
		let x = setInterval(() => {
			let now = new Date().getTime();
			let timeLeft = timeNow - now;
			let days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
			let hours = Math.floor(
				(timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
			);
			let minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
			let seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
			this.setState({
				min: minutes.toLocaleString(undefined, { minimumIntegerDigits: 2 }),
				hour: hours.toLocaleString(undefined, { minimumIntegerDigits: 2 }),
				sec: seconds.toLocaleString(undefined, { minimumIntegerDigits: 2 })
			});
			if (timeLeft <= 1000) {
				clearInterval(x);
				alert("YO");
			}
		}, 1000);
	}
	render() {
		return (
			<div className="container timer flex">
				<h2>
					{this.state.min}:{this.state.sec}
				</h2>
				<div className="btn" onClick={() => this.startTimer()}>
					Start Timer
				</div>
			</div>
		);
	}
}

export default Timer;
