import React from "react";
import { NotificationManager } from "react-notifications";


const Invite = ({close}) => {
	const copyToClipboard = (action) => {
		let copy = document.querySelector(".text-input");
		copy.select();
		let successful = document.execCommand("copy");
		successful
		? NotificationManager.info("Copied", "Success", 2000)
		: NotificationManager.error("Unable to Copy", "Error", 2000);
		action();
	};
	return (
		<div>
			<h1>Enter a Username</h1>
			<form>
				<input
					readOnly
					className="text-input"
					type="text"
					value={window.location.href}
				/>
			</form>
			<div className="btn yellow" onClick={() => close()}>
				Close
			</div>
			<div className="btn" onClick={() => copyToClipboard(close)}>
				Copy Link + Close
			</div>
		</div>
	);
};

export default Invite;
