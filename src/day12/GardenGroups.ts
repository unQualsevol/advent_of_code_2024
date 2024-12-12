import {Result, Solution} from "../types";

interface Coordinate {
	y: number;
	x: number;
}

const directions: Coordinate[] = [{y: -1, x:0}, {y: 0, x:1}, {y: 1, x:0}, {y: 0, x:-1}];
type Direction = "N" | "E" | "S" | "W";
const pointing: Direction[] = ["N", "E", "S", "W"]

interface Fence {
	coordinate: Coordinate;
	direction: Direction;
}

function getKey(coordinate: Coordinate): string {
	return `${coordinate.y},${coordinate.x}`;
}

export const day12: Solution = (input: string): Result => {
	const map: string[][] = input.split("\n").map((line)=> line.split(""));
	const maxY = map.length;
	const maxX = map[0].length;
	const visited = new Set<string>();

	function isWithinLimits(location: Coordinate): boolean {
		const {y, x} = location;
		return y < maxY && y >= 0 && x < maxX && x >= 0;
	}

	function getFences(coordinate: Coordinate, regionPlantType: string): Fence[] {
		return directions.reduce((acc, direction, currentIndex) => {
			const fenceCoor = {y: direction.y + coordinate.y, x: direction.x + coordinate.x};
			const fenceDirection = pointing[currentIndex];
			if(!isWithinLimits(fenceCoor) || map[fenceCoor.y][fenceCoor.x] !== regionPlantType) {
				acc.push({coordinate: fenceCoor, direction: fenceDirection});
			}
			return acc;
		}, [] as Fence[]);
	}

	function validDirections(coordinate: Coordinate, regionPlantType: string):Coordinate[] {
		return directions.map((direction) => ({y: direction.y + coordinate.y, x: direction.x +coordinate.x}))
			.filter((coor)=> {
				return !visited.has(getKey(coor)) && isWithinLimits(coor) && map[coor.y][coor.x] === regionPlantType;
			});
	}

	function countSides(fences:Fence[])
	{
		fences.sort((a, b) => {
			if(a.direction === b.direction) {
				switch (a.direction) {
					case "N":
					case "S":
						if(a.coordinate.y === b.coordinate.y) {
							return a.coordinate.x - b.coordinate.x;
						}
						return a.coordinate.y - b.coordinate.y;
					case "E":
					case "W":
						if(a.coordinate.x === b.coordinate.x) {
							return a.coordinate.y - b.coordinate.y;
						}
						return a.coordinate.x - b.coordinate.x;
				}
			}
			return a.direction.localeCompare(b.direction);
		})

		let sides = 1;
		let previous = fences[0];
		for (let i = 1; i < fences.length; i++) {
			const current = fences[i];
			if(current.direction !== previous.direction){
				sides++;
			} else {
				if(current.direction === "N" || current.direction === "S"){
					if(current.coordinate.y !== previous.coordinate.y || Math.abs(current.coordinate.x - previous.coordinate.x) > 1){
						sides++;
					}
				} else {
					if(current.coordinate.x !== previous.coordinate.x || Math.abs(current.coordinate.y - previous.coordinate.y) > 1){
						sides++;
					}
				}
			}
			previous = current;
		}
		return sides;

	}

	function bfs(coordinate: Coordinate): {area: number, perimeter: number, sides: number} {
		let perimeter = 0;
		let area = 0;
		const regionPlantType = map[coordinate.y][coordinate.x];
		const queue: Coordinate[] = [coordinate];
		const accFences = [];
		while (queue.length > 0) {
			const current = queue.shift()!;
			if(visited.has(getKey(current))) continue;
			visited.add(getKey(current));
			area++;
			const fences = getFences(current, regionPlantType);
			accFences.push(...fences);
			perimeter += fences.length;
			queue.push(...validDirections(current, regionPlantType))
		}
		const sides = countSides(accFences);
		return {area, perimeter, sides};
	}

	let first = 0;
	let second = 0;
	for (let y = 0; y < maxY; y++) {
		for (let x = 0; x < maxX; x++) {
			if(!visited.has(getKey({y,x}))){
				const {area, perimeter, sides} = bfs({y,x});
				first += area*perimeter;
				second += area*sides;
			}
		}
	}
	return { first, second };
}