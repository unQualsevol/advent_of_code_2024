import {Result, Solution} from "../types";

function first(expandedInput: string, map: number[][]) {
	let i = 0;
	let j = expandedInput.length - 1;
	while (i < j) {
		while (expandedInput[i] !== "." && i < j) {
			i++;
		}
		while (expandedInput[j] === "." && i < j) {
			j--;
		}
		if (expandedInput[i] === "." && expandedInput[j] !== ".") {
			const swap1 = expandedInput[i];
			const swap2 = expandedInput[j];
			map.filter((file) => file.includes(j)).forEach((file) => file[file.indexOf(j)] = i);
			expandedInput = expandedInput.substring(0, i) + swap2 + expandedInput.substring(i + 1, j) + swap1 + expandedInput.substring(j + 1);
		}
	}

	return map.reduce((acc, current, index) => acc + index * current.reduce((acc, current) => acc + current), 0);
}
function second(expandedInput: string, map: number[][]) {
	for (let i = map.length -1; i >= 0; i--) {
		const current = map[i];
		const length = current.length;
		const emptySpace = ".".repeat(length);
		const indexOfAvailableSpace = expandedInput.indexOf(emptySpace);
		if(indexOfAvailableSpace > 0 && indexOfAvailableSpace < current[0]){
			const busySpace = "X".repeat(length);
			expandedInput = expandedInput.substring(0, indexOfAvailableSpace) + busySpace + expandedInput.substring(indexOfAvailableSpace + length, current[0]) + emptySpace + expandedInput.substring(current[0] + length);
			map[i] = [];
			for (let j = 0; j < length; j++) {
				map[i].push(indexOfAvailableSpace+j);
			}
		}
	}

	return map.reduce((acc, current, index) => acc + index * current.reduce((acc, current) => acc + current), 0);
}

export const day09: Solution = (input: string): Result => {
	let fileIndex = 0;
	const map:number[][] = [];
	let expandedInput = input.split("").reduce((acc, current, index) => {
		const repetitions = Number(current);
		if(index % 2 !== 0){
			acc += ".".repeat(repetitions);
		} else {
			const start = acc.length;
			acc += `X`.repeat(repetitions)
			const end = acc.length;
			const indexes: number[] = [];
			for (let k = start; k < end; k++) {
				indexes.push(k);
			}
			map.push(indexes);
			fileIndex++;
		}
		return acc;
	}, "");
	return {first: first(String(expandedInput), map.map((line) => [... line])), second: second(String(expandedInput), map.map((line) => [... line]))};
}