import React from "react";

const Modal = props => {
	return (
		<div className="overlay">
			<div className="modal container">{props.component}</div>
		</div>
	);
};

export default Modal;
