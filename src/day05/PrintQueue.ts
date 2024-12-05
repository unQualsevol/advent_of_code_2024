import {Result, Solution} from "../types";

export const day05: Solution = (input: string): Result => {
	const [section1, section2] = input.split("\n\n");
	const orderingRules = section1.split("\n");
	const pageUpdates: string[][] = section2.split("\n").map((line) => line.split(","));

	let correctMiddlePageNumberCount = 0;
	let incorrectPagesMiddlePageNumberCount = 0;
	for (const pageUpdate of pageUpdates) {
		const sorted = [...pageUpdate].sort((a, b) => {
			const isAfter = orderingRules.includes(`${a}|${b}`);
			const isBefore = orderingRules.includes(`${b}|${a}`);
			if(isAfter) return -1
			if(isBefore) return 1
			return 0;
		});
		const middlePage = Number(sorted[(pageUpdate.length-1)/2]);
		if(JSON.stringify(pageUpdate) === JSON.stringify(sorted)) {
			correctMiddlePageNumberCount += middlePage;
		} else {
			incorrectPagesMiddlePageNumberCount += middlePage;
		}
	}
	return {first: correctMiddlePageNumberCount, second: incorrectPagesMiddlePageNumberCount};
}