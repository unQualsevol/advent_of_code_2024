import {Result, Solution} from "../types";

interface Coordinate {
	y: number;
	x: number;
}

let map: string[][] = [];
let maxY: number = 0;
let maxX: number = 0;

function isWithinLimits(location: Coordinate): boolean {
	const {y, x} = location;
	return y < maxY && y >= 0 && x < maxX && x >= 0;
}

function getAntinode(first: Coordinate, second: Coordinate): Coordinate {
	const diffY = second.y - first.y;
	const diffX = second.x - first.x;
	return {y:first.y+diffY*2, x:first.x+diffX*2};
}

function getKey(coordinate: Coordinate): string {
	return `${coordinate.y},${coordinate.x}`;
}

function calculateAntinodesLocation(locations: Coordinate[], condition: (antinode: Coordinate) => boolean) {
	const antinodes: Coordinate[] = []
	for (let i = 0; i < locations.length; i++) {
		const current = locations[i];
		const others = locations.toSpliced(i, 1);
		others.forEach((aa) =>	{
			let antinode: Coordinate;
			let first: Coordinate = current
			let second: Coordinate = aa;
			do {
				antinode = getAntinode(first, second);
				if (isWithinLimits(antinode)) {
					antinodes.push(antinode);
				}
				first = second;
				second = antinode;
			}
			while (condition(antinode))
		});
	}
	return antinodes;
}

function first(antennaMap: Map<string, Coordinate[]>) {
	const antinodeLocations: Set<string> = new Set<string>();
	for (const antennaMapKey of antennaMap.keys()) {
		calculateAntinodesLocation(antennaMap.get(antennaMapKey)!, () => false)
			.forEach((antinode) => antinodeLocations.add(getKey(antinode)));
	}
	return antinodeLocations.size;
}

function second(antennaMap: Map<string, Coordinate[]>) {
	const antinodeLocations: Set<string> = new Set<string>();
	for (const antennaMapKey of antennaMap.keys()) {
		const antennas = antennaMap.get(antennaMapKey)!;
		antennas.forEach((antenna) => antinodeLocations.add(getKey(antenna)));
		calculateAntinodesLocation(antennas, (antinode) => isWithinLimits(antinode))
			.forEach((antinode) => {
				antinodeLocations.add(getKey(antinode))
			});
	}
	return antinodeLocations.size;
}

export const day08: Solution = (input: string): Result => {
	map = input.split("\n").map((line)=> line.split(""));
	maxY = map.length;
	maxX = map[0].length;
	const antennaMap: Map<string, Coordinate[]> = new Map();
	map.forEach((line, indexY) => {
		line.forEach((current, indexX) => {
			if(current !== ".") {
				if(!antennaMap.has(current)) {
					antennaMap.set(current, []);
				}
				antennaMap.get(current)!.push({y: indexY, x: indexX});
			}
		})
	});
	return {first: first(antennaMap), second: second(antennaMap)};
}