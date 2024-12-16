import {Result, Solution} from "../types";

interface Coordinate {
	y: number;
	x: number;
}


type Direction = "N" | "E" | "S" | "W";

interface Reindeer {
	position: Coordinate;
	direction: Direction;
}

interface Step {
	reindeer: Reindeer;
	cost: number;
}

const movement: Record<Direction, (position: Coordinate) => Coordinate> = {
	"N": (position) => ({y: position.y-1, x: position.x}),
	"E": (position) => ({y:position.y, x: position.x+1}),
	"S": (position) => ({y: position.y+1, x: position.x}),
	"W": (position) => ({y: position.y, x: position.x-1}),
}


function moveforward(reindeer: Reindeer): Reindeer {
	return {position: movement[reindeer.direction](reindeer.position), direction: reindeer.direction};
}

function turnLeft(reindeer: Reindeer): Reindeer {
	let newDirection: Direction;
	switch (reindeer.direction) {
		case "N":
			newDirection = "W";
			break;
		case "E":
			newDirection = "N";
			break;
		case "S":
			newDirection = "E";
			break;
		case "W":
			newDirection = "S";
			break;
	}
	return {position: reindeer.position, direction: newDirection};
}

function turnRight(reindeer: Reindeer): Reindeer {
	let newDirection: Direction;
	switch (reindeer.direction) {
		case "N":
			newDirection = "E";
			break;
		case "E":
			newDirection = "S";
			break;
		case "S":
			newDirection = "W";
			break;
		case "W":
			newDirection = "N";
			break;
	}
	return {position: reindeer.position, direction: newDirection};
}

function isEmpty(map: string[][], coordinate: Coordinate): boolean {
	return map[coordinate.y][coordinate.x] === "."
		|| map[coordinate.y][coordinate.x] === "E"
		|| map[coordinate.y][coordinate.x] === "S";
}

function getNeighbors(map: string[][], reindeer: Reindeer): Step[] {
	const steps: Step[] = [];
	steps.push(
		{reindeer: moveforward(reindeer), cost: 1},
		{reindeer: moveforward(turnLeft(reindeer)), cost: 1001},
		{reindeer: moveforward(turnRight(reindeer)), cost: 1001},
	);
	return steps.filter((step) => isEmpty(map, step.reindeer.position));
}

function getNeighbors2(map: string[][], reindeer: TrackingPathReindeer): TrackingPathReindeer[] {
	const neighbors: TrackingPathReindeer[] = [];
	const forward = moveforward(reindeer);
	if(isEmpty(map, forward.position)) {
		neighbors.push(
			{...forward, score: reindeer.score + 1, path: [...reindeer.path, forward.position]},
		);
	}
	neighbors.push(
		{...turnLeft(reindeer), score: reindeer.score + 1000, path: [...reindeer.path]},
		{...turnRight(reindeer), score: reindeer.score + 1000, path: [...reindeer.path]},
	);
	return neighbors;
}

function aStarLeastCostPath(map: string[][], startPosition: Coordinate, endPosition: Coordinate): number {
	const costMap = new Map<string, number>();
	const parentMap = new Map<string, string[]>();
	const visited = new Set<string>();

	const openList: Reindeer[] = [{position: startPosition, direction: "E"}];
	let startKey = getKey(startPosition);
	costMap.set(startKey, 0);

	while (openList.length > 0) {
		const currentNode = openList.shift()!;
		const currentKey = getKey(currentNode.position);
		visited.add(currentKey);

		for (const neighbor of getNeighbors(map, currentNode)) {
			const costToNeighbor = costMap.get(currentKey)! + neighbor.cost;
			const neighborKey = getKey(neighbor.reindeer.position);
			if(!visited.has(neighborKey) || costToNeighbor <= costMap.get(neighborKey)!) {
				costMap.set(neighborKey, costToNeighbor);
				if(!visited.has(neighborKey) || costToNeighbor < costMap.get(neighborKey)!) {
					parentMap.set(neighborKey, [currentKey]);
				} else {
					parentMap.set(neighborKey, [...parentMap.get(neighborKey)!,currentKey]);
				}
				openList.push(neighbor.reindeer);
			}
		}
		openList.sort((a, b) => costMap.get(getKey(a.position))! - costMap.get(getKey(b.position))!);
	}

	return costMap.get(getKey(endPosition)) ?? 0;
}


function getKey(coordinate: Coordinate): string {
	return `${coordinate.y},${coordinate.x}`
}
function getKey2(reindeer: Reindeer): string {
	return `${reindeer.position.y},${reindeer.position.x},${reindeer.direction}`
}

interface TrackingPathReindeer extends Reindeer {
	score: number;
	path: Coordinate[];
}

function getPaths(map: string[][], startPosition: Coordinate, endPosition: Coordinate, lowestScore: number) {
	const queue: TrackingPathReindeer[] = [{position: startPosition, direction: "E", score: 0, path: [startPosition]}];
	const visited = new Map<string, number>();
	const paths: Coordinate[][] = [];

	while (queue.length > 0) {
		const current = queue.shift()!;
		const currentKey = getKey2(current);
		if(current.score > lowestScore) continue;
		if(visited.has(currentKey) && visited.get(currentKey)! < current.score) continue;
		visited.set(currentKey, current.score);

		if(current.position.x === endPosition.x && current.position.y === endPosition.y && current.score === lowestScore) {
			paths.push(current.path);
			continue;
		}
		queue.push(...getNeighbors2(map, current));
	}

	return paths;
}

export const day16: Solution = (input: string): Result => {
	const map = input.split("\n").map((line)=> line.split(""));
	const startPosition: Coordinate = {y: map.length-2, x: 1};
	const endPosition: Coordinate = {y: 1, x: map[1].length-2};

	let first = aStarLeastCostPath(map, startPosition, endPosition);
	const paths = getPaths(map, startPosition, endPosition, first);
	const uniquePath = new Set<string>();
	paths.flat().forEach((a)=> uniquePath.add(getKey(a)));
	const second = uniquePath.size;
	return {first: first, second: second};
}