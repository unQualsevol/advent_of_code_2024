import {getSolutions} from "./Solutions";
import * as fs from "fs";

function getInputAsString(day: number) {
	return fs.readFileSync(`resources/input${(day < 10) ? "0" + day : day}`).toString().trim();
}

export default (day: string, part?: string): void => {
	const dayNumber = Number(day);
	if (dayNumber < 1 || dayNumber > 25) {
		throw new Error("`day` must be between 1 and 25");
	}
	if (part && part !== "1" && part !== "2") {
		throw new Error("`part` must be between 1 and 2");
	}
	const result = getSolutions()[dayNumber - 1](getInputAsString(dayNumber));
	switch (part) {
		case "1": {
			console.log(`First exercise: ${result.first}`);
			break;
		}
		case "2": {
			console.log(`Second exercise: ${result.second}`);
			break;
		}
		default: {
			console.log(`First exercise: ${result.first}`);
			console.log(`Second exercise: ${result.second}`);
		}

	}
}