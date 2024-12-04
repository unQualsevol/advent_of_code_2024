import {Result, Solution} from "../types";

export const day04: Solution = (input: string): Result => {
	const board = input.split("\n").map((line: string) => line.split(""))
	const boardHeight = board.length;
	const boardWidth = board[0].length;

	const directions = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];

	function isExpectedLetterFrom(y: number, x: number, direction: number[], factor: number, letter: string): boolean {
		const [newY, newX] = direction.map((value, index) => (index ? x : y) + (value * factor)) as [number, number];
		if(newY < 0 || newY >= boardHeight || newX < 0 || newX >= boardWidth) return false;

		return board[newY][newX] === letter;
	}

	function getCountOfMasFrom(y: number, x: number) {
		let count = 0;
		for (const direction of directions) {
			if(isExpectedLetterFrom(y, x, direction, 1, "M") &&
				isExpectedLetterFrom(y, x, direction, 2, "A") &&
				isExpectedLetterFrom(y, x, direction, 3, "S")){
			count++;
			}
		}
		return count;
	}

	function countXmasAppearances(boardHeight: number, boardWidth: number, board: string[][]) {
		let count = 0;

		for (let y = 0; y < boardHeight; y++) {
			for (let x = 0; x < boardWidth; x++) {
				if (board[y][x] === "X") {
					count+= getCountOfMasFrom(y,x);
				}
			}
		}
		return count;
	}

	const first = countXmasAppearances(boardHeight, boardWidth, board);

	function countMasCrossAppearances(boardHeight: number, boardWidth: number, board: string[][]) {
		const crossDirections = [[-1,-1],[-1,1],[1,-1],[1,1]];
		const validCombinations = ["MMSS", "MSMS", "SMSM", "SSMM"];
		let count = 0;
		for (let y = 1; y < boardHeight-1; y++) {
			for (let x = 1; x < boardWidth-1; x++) {
				if(board[y][x] === "A") {
					const testString = crossDirections.map((coor) => board[y+coor[0]][x+coor[1]]).join("");
					if(validCombinations.includes(testString)){
						count++;
					}
				}
			}
		}
		return count;
	}

	const second = countMasCrossAppearances(boardHeight, boardWidth, board);

	return {first, second};
}