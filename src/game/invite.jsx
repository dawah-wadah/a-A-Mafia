import React from "react";

const Invite = props => {
	return (
		<div>
			<h1>Enter a Username</h1>
			<form>
				<input type="text" value={props.location} />
				<div className="btn" onClick={() => props.close()}>
					Close
				</div>
			</form>
		</div>
	);
};

export default Invite;
