import {Result, Solution} from "../types";

interface Coordinate {
	y: number;
	x: number;
}

type Instruction = "^" | ">" | "v" | "<";

const InstructionToDirection: Record<Instruction, Coordinate> = {
	"^": {y: -1, x: 0},
	">": {y: 0, x: 1},
	"v": {y: 1, x: 0},
	"<": {y: 0, x: -1},

}

const Empty = ".";
const Wall = "#";
const Box = "O";
const BoxLeft = "[";
const BoxRight = "]";
const Robot = "@";

function swap(map:string[][], from: Coordinate, to: Coordinate) {
	const aux = map[to.y][to.x];
	map[to.y][to.x] = map[from.y][from.x];
	map[from.y][from.x] = aux;
}


function swapStepByStep(map:string[][], from: Coordinate, to: Coordinate, movement: Coordinate) {
	let currentTo = to;
	while(currentTo.y !== from.y || currentTo.x !== from.x){
		const currentFrom = move(currentTo, {y: -movement.y, x: -movement.x});
		swap(map, currentTo, currentFrom)
		currentTo = currentFrom;
	}
}

function readInitialMap(mapString: string) {
	return mapString.split("\n").map((line) => line.split(""));
}

function move(initialPosition: Coordinate, direction: Coordinate): Coordinate {
	return {y: initialPosition.y + direction.y, x: initialPosition.x + direction.x};
}

function findEmptySpace(map:string[][], initialPosition: Coordinate, movement: Coordinate): Coordinate | undefined {
	let newPosition = move(initialPosition, movement);
	let current = map[newPosition.y][newPosition.x];
	while (current !== Wall) {
		if(current === Empty) return newPosition;
		newPosition = move(newPosition, movement);
		current = map[newPosition.y][newPosition.x];
	}
	return undefined;
}

function positionHas(map: string[][], position: Coordinate, expected: string): boolean{
	return map[position.y][position.x] === expected;
}

function printMap(map: string[][]) {
	for (const mapElement of map) {
		console.log(mapElement.join(""));
	}
	console.log();
}

function sumOfBoxesGpsCoordinates(map: string[][], boxCharacter: "O" | "["): number {
	let count = 0;
	for (let i = 0; i < map.length; i++) {
		const currentLine = map[i];
		for (let j = 0; j < currentLine.length; j++) {
			if(currentLine[j] === boxCharacter) {
				count += 100*i+j;
			}
		}
	}
	return count;
}

function first(map: string[][], instructions: Instruction[]) {
	const initialY = map.findIndex((line) => line.includes(Robot));
	const initialX = map[initialY].indexOf(Robot);
	const initialPosition: Coordinate = {y: initialY, x: initialX};
	let position = initialPosition;
	for (const instruction of instructions) {
		let movement = InstructionToDirection[instruction];
		const newPosition = move(position, movement);
		if (positionHas(map, newPosition, Empty)) {
			swap(map, position, newPosition);
			position = newPosition;
		} else if (positionHas(map, newPosition, Box)) {
			const emptySpace = findEmptySpace(map, newPosition, movement);
			if (emptySpace) {
				swap(map, newPosition, emptySpace);
				swap(map, position, newPosition);
				position = newPosition;
			}
		}
	}
	return sumOfBoxesGpsCoordinates(map, "O");
}

function expand(cell: string): [a:string, b:string] {
	switch (cell) {
		case Wall:
			return ["#", "#"];
		case Box:
			return ["[", "]"];
		case Empty:
			return [".", "."];
		default:
			return ["@", "."];
	}
}

function calculateNextLevel(map: string[][], boxesSides: Coordinate[], movementY: number): {canMove: boolean, hasWall: boolean, newBoxSides: Coordinate[]}{
	const nextLevel = boxesSides.map((boxSide) => ({y: boxSide.y+movementY, x: boxSide.x}));
	const canMove = nextLevel.every((boxSide) => positionHas(map, boxSide, Empty))
	const hasWall = nextLevel.some((boxSide) => positionHas(map, boxSide, Wall))
	const newBoxesSides: Coordinate[] = [];
	const first = nextLevel[0];
	if(positionHas(map, first, BoxRight)){
		newBoxesSides.push({y: first.y, x: first.x-1});
	}
	newBoxesSides.push(...nextLevel.filter((position)=>positionHas(map, position, BoxRight) || positionHas(map, position, BoxLeft)))
	const last = nextLevel[nextLevel.length-1];
	if(positionHas(map, last, BoxLeft)){
		newBoxesSides.push({y: last.y, x: last.x+1});
	}
	return {canMove, hasWall, newBoxSides: newBoxesSides};
}


function pushRec(map: string[][], boxSides: Coordinate[], movementY: number): boolean {
	const {canMove, hasWall, newBoxSides} = calculateNextLevel(map, boxSides, movementY);
	if(canMove) {
		boxSides.forEach((boxSide) => swap(map, boxSide, {y: boxSide.y+movementY, x: boxSide.x}));
		return true;
	}
	if(hasWall)	return false;
	if(pushRec(map, newBoxSides, movementY)){
		boxSides.forEach((boxSide) => swap(map, boxSide, {y: boxSide.y+movementY, x: boxSide.x}));
		return true;
	}
	return false;
}

function push(map: string[][], initialPosition: Coordinate, movementY: number) {
	let boxSides = [{y: initialPosition.y, x: initialPosition.x-1}, initialPosition];
	if(positionHas(map, initialPosition, BoxLeft)){
		boxSides = [initialPosition, {y: initialPosition.y, x: initialPosition.x+1}]
	}
	if(pushRec(map, boxSides, movementY)) {
		return true;
	}
	return false;
}

function second(map: string[][], instructions: Instruction[]) {
	const expandedMap = map.map((line) => line.map(expand).flat());
	const initialY = expandedMap.findIndex((line) => line.includes(Robot));
	const initialX = expandedMap[initialY].indexOf(Robot);
	const initialPosition: Coordinate = {y: initialY, x: initialX};
	let position = initialPosition;
	for (const instruction of instructions) {
		let movement = InstructionToDirection[instruction];
		const newPosition = move(position, movement);
		if (positionHas(expandedMap, newPosition, Wall)) continue;
		if (positionHas(expandedMap, newPosition, Empty)) {
			swap(expandedMap, position, newPosition);
			position = newPosition;
			continue;
		}
		switch (instruction) {
			case "^":
			case "v":
				if(push(expandedMap, newPosition, movement.y)){
					swap(expandedMap, position, newPosition);
					position = newPosition;
				}
				break;
			case ">":
			case "<":
				const emptySpace = findEmptySpace(expandedMap, newPosition, movement);
				if(emptySpace) {
					//swap from newPosition to empty space 1 by one
					swapStepByStep(expandedMap, newPosition, emptySpace, movement);
					swap(expandedMap, position, newPosition);
					position = newPosition;
				}
				break;
		}
	}
	return sumOfBoxesGpsCoordinates(expandedMap, "[");
}

export const day15: Solution = (input: string): Result => {
	const [mapString, instructionsString] = input.split("\n\n");
	const instructions = instructionsString.split("\n").map((line)=> line.split("").map((value)=> value as Instruction)).flat()
	return {first: first(readInitialMap(mapString), instructions), second: second(readInitialMap(mapString), instructions)};
}