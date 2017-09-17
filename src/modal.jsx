import React from "react";

class Modal extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="overlay">
				<div className="modal container">{this.props.component}</div>
			</div>
		);
	}
}

export default Modal;
