import {Result, Solution} from "../types";

function calculateRec(numbers: number[], acc: number, expected: number, includeConcatenation:boolean): boolean {
	if(numbers.length === 0){
		return acc === expected;
	}
	const validOnSum = calculateRec(numbers.slice(1), acc+numbers[0], expected, includeConcatenation);
	if(validOnSum) return true;
	const validOnMul =  calculateRec(numbers.slice(1), acc*numbers[0], expected, includeConcatenation);
	if(validOnMul) return true;
	if (includeConcatenation){
		return calculateRec(numbers.slice(1), Number(`${acc}${numbers[0]}`), expected, includeConcatenation);
	}
	return false;
}

function isValid(current: number[], includeConcatenation:boolean) {
	const total = current[0]
	return calculateRec(current.slice(1), 0, total, includeConcatenation);
}

function calculateValidOperations(valuesMap: number[][], includeConcatenation = false) {
	return valuesMap.reduce((acc, current) => {
		if (isValid(current, includeConcatenation)) acc += current[0];
		return acc;
	}, 0);
}

export const day07: Solution = (input: string): Result => {
	const valuesMap = input.split("\n").map((line: string) => line.split(/:?\s/).map((value) => Number(value)));
	const first = calculateValidOperations(valuesMap)
	const second = calculateValidOperations(valuesMap, true)
	return {first, second};
}