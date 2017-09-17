import React from "react";
import { base, app } from "../base.jsx";

class SignInModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: ""
		};
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	//
	handleSubmit(e) {
		e.preventDefault();
		let location = this.props.location;
		let name = this.state.name;
		app.auth().onAuthStateChanged(function(user) {
			if (user) {
				base.post(`gamerooms/${location}/players/${user.uid}`, {
					data: {
						active: true,
						name: name,
						uid: user.uid
					}
				});
			}
		});
		this.props.close();
	}

	_handleChange(e, field) {
		this.setState({
			[field]: e.currentTarget.value
		});
	}

	render() {
		return (
			<div>
				<h1>Enter a Username</h1>
				<form>
					<input
						onChange={e => this._handleChange(e, "name")}
						type="text"
						placeholder="Name"
					/>
					<div className="btn" onClick={e => this.handleSubmit(e)}>
						Submit
					</div>
				</form>
			</div>
		);
	}
}

export default SignInModal;
