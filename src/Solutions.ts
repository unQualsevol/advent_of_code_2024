import {Solution} from "./types";
import {day01} from "./day01/HistorianHysteria";
import {day02} from "./day02/RedNosedReports";
import {day03} from "./day03/MullItOver";
import {day04} from "./day04/CeresSearch";

export function getSolutions(): Solution[] {
	return [
		day01,
		day02,
		day03,
		day04,
		// day05,
		// day06,
		// day07,
	];
}