import {Result, Solution} from "../types";

function first(colum1: number[], colum2: number[]) {
	colum1.sort();
	colum2.sort();
	return colum1.reduce((acc, current, index) => acc + Math.abs(current - colum2[index]), 0);
}

function second(colum1: number[], map: Record<number, number>) {
	return colum1.reduce((acc, current) => acc + current * (map[current] ?? 0), 0);
}

export const day01: Solution = (input: string): Result => {
	const colum1: number[] = [];
	const colum2: number[] = [];
	const map: Record<number, number> = {};
	input.split("\n").forEach(line => {
		const [value1, value2] = line.split(/\s+/).map((value: string) => Number(value));
		if(map[value2]) {
			map[value2] = map[value2] + 1;
		} else {
			map[value2] = 1;
		}
		colum1.push(value1);
		colum2.push(value2);
	})
	return {first: first(colum1, colum2), second: second(colum1, map)};
}