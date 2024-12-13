import {Result, Solution} from "../types";

interface Coordinate {
	y: number;
	x: number;
}

interface ClawMachine {
	a: Coordinate;
	b: Coordinate;
	prize: Coordinate;
}

function getMinimalTokens(clawMachine: ClawMachine, offset = 0) {
	let prize: Coordinate = {x: clawMachine.prize.x + offset, y: clawMachine.prize.y + offset};
	let det = clawMachine.a.x * clawMachine.b.y - clawMachine.a.y * clawMachine.b.x;
	let a = Math.trunc((prize.x * clawMachine.b.y - prize.y * clawMachine.b.x) / det);
	let b = Math.trunc((clawMachine.a.x * prize.y - clawMachine.a.y * prize.x) / det);
	if( prize.x === (clawMachine.a.x * a + clawMachine.b.x * b) && prize.y === (clawMachine.a.y * a + clawMachine.b.y * b)) {
		return 3*a +b;
	}
	return 0;
}

function getValues(line: string): Coordinate {
	const [x, y] = line.match(/(\d+)/gm)!;
	return {x: Number(x), y: Number(y)};
}

export const day13: Solution = (input: string): Result => {

	const clawMachines: ClawMachine[] = input.split("\n\n").map((block) => {
		const lines = block.split("\n");
		return {
			a: getValues(lines[0]),
			b: getValues(lines[1]),
			prize: getValues(lines[2]),
		}
	});

	let first = 0
	let second = 0;
	for (const clawMachine of clawMachines) {
		first += getMinimalTokens(clawMachine);
		second += getMinimalTokens(clawMachine, 10000000000000);
	}
	return {first, second};
}