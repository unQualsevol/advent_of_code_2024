import {Result, Solution} from "../types";

function generate(current: string): string[] {
	const acc: string[] = [];
	if (current === "0") {
		acc.push("1");
	} else if (current.length % 2 === 0) {
		const halfLength = current.length / 2;
		acc.push(String(Number(current.slice(0, halfLength))));
		acc.push(String(Number(current.slice(halfLength))));
	} else {
		acc.push(String(Number(current) * 2024));
	}
	return acc;
}

function countStonesAfterNBlinks(numbers: string[], iterations: number) {
	let counterMap = new Map<string, number>();
	numbers.forEach((value) => counterMap.set(value, 1));
	for (let i = 0; i < iterations; i++) {
		counterMap = [...counterMap.keys()].reduce((acc, key: string) => {
			const count = counterMap.get(key)!;
			generate(key).forEach((value) =>
				acc.set(value, (acc.get(value) ?? 0) + count));
			return acc;
		}, new Map<string, number>);
	}
	return [...counterMap.values()].reduce((acc, current) => acc + current, 0);
}

export const day11: Solution = (input: string): Result => {
	const numbers = input.split(" ");
	return { first: countStonesAfterNBlinks(numbers, 25), second: countStonesAfterNBlinks(numbers, 75) };
}
