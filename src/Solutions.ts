import {Solution} from "./types";
import {day01} from "./day01/HistorianHysteria";
import {day02} from "./day02/RedNosedReports";
import {day03} from "./day03/MullItOver";
import {day04} from "./day04/CeresSearch";
import {day05} from "./day05/PrintQueue";
import {day06} from "./day06/GuardGallivant";
import {day07} from "./day07/BridgeRepair";
import {day08} from "./day08/ResonantCollinearity";
import {day09} from "./day09/DiskFragmenter";
import {day10} from "./day10/HoofIt";
import {day11} from "./day11/PlutonianPebbles";
import {day12} from "./day12/GardenGroups";
import {day13} from "./day13/ClawContraption";
import {day14} from "./day14/RestroomRedoubt";
import {day15} from "./day15/WarehouseWoes";
import {day16} from "./day16/ReindeerMaze";

export function getSolutions(): Solution[] {
	return [
		day01, day02, day03, day04, day05, day06,
		day07, day08, day09, day10, day11, day12,
		day13, day14, day15, day16,
	];
}