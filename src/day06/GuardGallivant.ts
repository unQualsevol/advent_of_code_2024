import {Result, Solution} from "../types";

function isWithinLimits(y: number, x: number, maxY: number, maxX: number) {
	return y < maxY && y >= 0 && x < maxX && x >= 0;
}

type Direction = "N" | "E" | "S" | "W";

const directionOrder: Direction[] = ["N","E","S","W"];

function getNextDirection(direction: Direction) {
	return directionOrder[(directionOrder.indexOf(direction)+1)%directionOrder.length];
}

const movement: Record<Direction, (y: number, x: number) => { y: number, x: number }> = {
	"N": (y: number, x: number) => ({y: y-1, x}),
	"E": (y: number, x: number) => ({y, x: x+1}),
	"S": (y: number, x: number) => ({y: y+1, x}),
	"W": (y: number, x: number) => ({y, x: x-1}),
}

function getKey(y: number, x: number) {
	return `${y},${x}`;
}


function getDirectionKey(y: number, x: number, direction: Direction) {
	return `${y},${x},${direction}`;
}

export const day06: Solution = (input: string): Result => {
	const map: string[][] = input.split("\n").map((line)=> line.split(""));
	const startY = map.findIndex((line) => line.includes("^"));
	const startX = map[startY].indexOf("^");
	const maxY = map.length;
	const maxX = map[0].length;


	function isEmptyLocation(y:number, x:number, map: string[][]): boolean {
		return !isWithinLimits(y, x, maxY, maxX) || map[y][x] !== "#";
	}


	const visited: Set<string> = new Set<string>();
	let currentY = startY;
	let currentX = startX;
	let direction: Direction = "N";

	while(isWithinLimits(currentY,currentX, maxY, maxX))
	{
		visited.add(getKey(currentY, currentX));
		let newDirection: Direction = direction;
		let {y: newY, x: newX} = movement[newDirection](currentY, currentX);
		while (!isEmptyLocation(newY, newX, map))
		{
			newDirection = getNextDirection(newDirection);
			let {y: auxY, x: auxX} = movement[newDirection](currentY, currentX);
			newY = auxY;
			newX = auxX;
		}

		direction = newDirection;
		currentY = newY;
		currentX = newX;

	}
	const first = visited.size;

	visited.delete(getKey(startY, startX));
	let second = 0;
	for (const location of visited) {
		const [newBlockY,newBlockX] = location.split(",").map((value) => Number(value));
		const currentMap = map.map((line) => [...line]);
		currentMap[newBlockY][newBlockX] = "#";
		const visitedWithDirection: Set<string> = new Set<string>();
		let currentY = startY;
		let currentX = startX;
		let direction: Direction = "N";

		while(isWithinLimits(currentY,currentX, maxY, maxX))
		{
			const key = getDirectionKey(currentY, currentX, direction);
			if(visitedWithDirection.has(key)){
				second++;
				break;
			}

			visitedWithDirection.add(key);
			let newDirection: Direction = direction;
			let {y: newY, x: newX} = movement[newDirection](currentY, currentX);
			while (!isEmptyLocation(newY, newX, currentMap))
			{
				newDirection = getNextDirection(newDirection);
				let {y: auxY, x: auxX} = movement[newDirection](currentY, currentX);
				newY = auxY;
				newX = auxX;
			}
			direction = newDirection;
			currentY = newY;
			currentX = newX;
		}
	}
	return {first, second};
}