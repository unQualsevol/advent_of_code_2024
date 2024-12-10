import {Result, Solution} from "../types";

function getKey(y:number, x:number): string {
	return `${y},${x}`;
}

const directions: [y:number,x:number][] = [[-1, 0], [0, 1], [1, 0], [0, -1]];

export const day10: Solution = (input: string): Result => {
	const map = input.split("\n").map((line)=> line.split("").map((cell) => Number(cell)));
	const maxY = map.length;
	const maxX = map[0].length;
	const memoPart1: Map<string, Set<string>> = new Map();
	const memoPart2: Map<string, number> = new Map();

	function isWithinLimits(coor:[y:number,x:number]): boolean {
		const [y,x] = coor;
		return y < maxY && y >= 0 && x < maxX && x >= 0;
	}

	function calculateDirections(y: number, x: number):[y:number,x:number][] {
		const value = map[y][x];
		return directions.map((direction) => [y+direction[0], x+direction[1]] as [y:number,x:number])
			.filter((coor)=> isWithinLimits(coor) && map[coor[0]][coor[1]] === value+1);
	}

	function getTrailScorePart1(y: number, x: number): Set<string> {
		const key = getKey(y, x);
		if(memoPart1.has(key)){
			return memoPart1.get(key)!;
		}
		let hills: Set<string> = new Set();
		if(map[y][x] === 9) {
			hills.add(getKey(y, x));
		} else {
			const branches: [y:number,x:number][] = calculateDirections(y,x);
			branches.forEach((branch) => {
				let hills2 = getTrailScorePart1(branch[0], branch[1]);
				hills2.forEach((hill) => hills.add(hill));
			});
		}

		memoPart1.set(key, hills);
		return hills;
	}

	function getTrailScorePart2(y: number, x: number) {
		const key = getKey(y, x);
		if (memoPart2.has(key)) {
			return memoPart2.get(key)!;
		}
		let count = 0;
		if (map[y][x] === 9) {
			count++;
		} else {
			const branches: [y: number, x: number][] = calculateDirections(y, x);
			count += branches.map((branch) => getTrailScorePart2(branch[0], branch[1])).reduce((a, b) => a + b, 0);
		}

		memoPart2.set(key, count);
		return count;
	}

	let first = 0;
	let second = 0;
	for (let y = 0; y < maxY; y++) {
		for (let x = 0; x < maxX; x++) {
			const current = map[y][x];
			if (current === 0) {
				first += getTrailScorePart1(y,x).size;
				second += getTrailScorePart2(y, x);
			}
		}
	}

	return {first, second};
}