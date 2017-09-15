export default { makeId };

function makeId() {
	let id = "";
	const possible =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (let i = 0; i < 8; i++) {
		id += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return id;
}
