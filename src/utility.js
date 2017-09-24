export function makeId(num) {
	let id = "";
	const possible =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (let i = 0; i < num; i++) {
		id += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return id;
}

export function shuffle(array) {
	var i = 0,
		j = 0,
		temp = null;
	for (i = array.length - 1; i > 0; i -= 1) {
		j = Math.floor(Math.random() * (i + 1));
		temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
}
