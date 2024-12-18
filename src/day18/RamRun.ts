import {Result, Solution} from "../types";

interface Coordinate {
	y: number;
	x: number;
}

const maxY = 71;
const maxX = 71;
const start: Coordinate = {y: 0, x: 0};
const end: Coordinate = {y: maxY-1, x: maxX-1};
const endKey = getKey(end);
const directions: Coordinate[] = [{y: -1, x:0}, {y: 0, x:1}, {y: 1, x:0}, {y: 0, x:-1}];

function isWithinLimits(location: Coordinate): boolean {
	const {y, x} = location;
	return y < maxY && y >= 0 && x < maxX && x >= 0;
}

function getKey(coordinate: Coordinate): string {
	return `${coordinate.y},${coordinate.x}`;
}

function second(steps: Coordinate[], originalShortestPath: string[]) {
	let currentShortestPath = originalShortestPath;
	for (let i = 1024; i < steps.length; i++) {
		if(currentShortestPath.includes(getKey(steps[i]))){
			currentShortestPath = first(steps.slice(0, i+1));
			if(currentShortestPath.length === 0) {
				return `${steps[i].x},${steps[i].y}`;
			}
		}
	}
	return undefined;
}

function first(steps: Coordinate[]): string[] {
	const blocks = new Set<string>(steps.map(getKey));
	const visited = new Set<string>();
	const previousMap = new Map<string, string>();

	function isBlock(location: Coordinate): boolean {
		return blocks.has(getKey(location));
	}

	function validNeighbors(coordinate: Coordinate):Coordinate[] {
		return directions.map((direction) => ({y: direction.y + coordinate.y, x: direction.x +coordinate.x}))
			.filter((coor)=> {
				return isWithinLimits(coor) && !isBlock(coor);
			});
	}

	const queue: Coordinate[] = [start];
	const key = getKey(start);
	previousMap.set(key, "");

	while (queue.length > 0) {
		const current = queue.shift()!;
		const currentKey = getKey(current);
		if(visited.has(currentKey)) {
			continue;
		}
		visited.add(currentKey);

		if(currentKey === endKey) {
			let path: string[] = [];
			let inPath: string | undefined = previousMap.get(currentKey);
			while (inPath) {
				path.push(inPath);
				inPath = previousMap.get(inPath);
			}
			return path;
		}

		let neighbors = validNeighbors(current);
		neighbors.forEach((neighbor) => {
			const neighborKey = getKey(neighbor);
			if(!previousMap.has(neighborKey))
				previousMap.set(neighborKey, currentKey);
			queue.push(neighbor);
		});
	}
	return [];
}

export const day18: Solution = (input: string): Result => {
	const steps: Coordinate[] = input.split("\n").map((line) => {
		const [x,y] = line.split(",");
		return {y: Number(y), x: Number(x)};
	})


	const shortestPath = first(steps.slice(0,1024));
	return {first: shortestPath.length, second: second(steps, shortestPath)};
}