export default { makeId };

function makeId(num) {
	let id = "";
	const possible =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (let i = 0; i < num; i++) {
		id += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return id;
}
