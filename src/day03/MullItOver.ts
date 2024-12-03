import {Result, Solution} from "../types";


function multiply(operation: string) {
	const [operand1, operand2] = operation.match(/\d+/gm)!.map(value => Number(value));
	return operand1 * operand2;
}

function first(input: string) {
	const operations = input.match(/mul\(\d+,\d+\)/gm)!;
	return operations.reduce((accumulator, currentValue) => accumulator + multiply(currentValue), 0);
}

function second(input: string) {
	const operations = input.match(/mul\(\d+,\d+\)|don't\(\)|do\(\)/gm)!;
	let operate = true;
	return operations.reduce((accumulator, currentValue) => {
		if(currentValue === "don't()") {
			operate = false;
			return accumulator;
		}
		if(currentValue === "do()") {
			operate = true;
			return accumulator;
		}
		return accumulator + (operate ? multiply(currentValue) : 0);
	}, 0);
}

export const day03: Solution = (input: string): Result => {
	return {first:first(input), second: second(input)};
}