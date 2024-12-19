import {Result, Solution} from "../types";


const compareByLength = (a: string, b: string)=> b.length - a.length;

export const day19: Solution = (input: string): Result => {
	const [line1, _, ...desiredDesigns] = input.split("\n");
	const validDesigns = line1.split(", ").sort(compareByLength);
	const countMap = new Map<string, number>();
	function countMatches(desiredDesign: string): number {
		if(countMap.has(desiredDesign)) return countMap.get(desiredDesign)!;
		if (!desiredDesign) return 1;
		const result = validDesigns.reduce((acc, validDesign) =>
				desiredDesign.startsWith(validDesign) ? acc + countMatches(desiredDesign.slice(validDesign.length)) : acc, 0);
		countMap.set(desiredDesign, result);
		return result;
	}

	const countArray = desiredDesigns.map((desiredDesign)=> countMatches(desiredDesign));
	const countOfValidDesigns = countArray.filter((count)=> count > 0).length
	const countEveryPossibleOption = countArray.reduce((previousValue, currentValue) => previousValue + currentValue, 0);

	return {first:countOfValidDesigns, second: countEveryPossibleOption};
}