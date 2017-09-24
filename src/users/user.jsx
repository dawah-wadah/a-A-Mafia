import { makeId } from "../utility.js";

export default class User {
	constructor(options) {
		this.username = options.name;
		this.role = options.role;
		this.id = makeId(6);
	}
}
