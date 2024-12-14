import {Result, Solution} from "../types";

const maxY = 103;
const maxX = 101;

interface Coordinate {
	x: number;
	y: number;
}

interface Robot {
	position: Coordinate;
	velocity: Coordinate;
}

function moveRobot(robot: Robot, times: number): Robot {
	const newY = (((robot.position.y + robot.velocity.y * times) % maxY) + maxY) % maxY;
	const newX = (((robot.position.x + robot.velocity.x * times) % maxX) + maxX) % maxX;
	return {position: {x: newX, y: newY}, velocity: robot.velocity}
}

function second(robots: Robot[]) {
	let second = -1;
	for (let times = 6600; times <= 6700; times++) {
		const movedRobots = robots.map((robot) => moveRobot(robot, times));
		for (let y = 0; y < maxY; y++) {
			let line = "";
			for (let x = 0; x < maxX; x++) {
				const robot = movedRobots.find((robot) => robot.position.x === x && robot.position.y === y);
				line += robot ? "#" : ".";
			}
			if (line.includes("###############################")) {
				second = times;
				break;
			}
		}
		if (second > 0) break;
	}
	return second;
}

function first(robots: Robot[]) {
	const movedRobots = robots.map((robot) => moveRobot(robot, 100));

	const halfY = maxY >> 1;
	const halfX = maxX >> 1;

	const q1 = movedRobots.filter((robot) => robot.position.x < halfX && robot.position.y < halfY).length;
	const q2 = movedRobots.filter((robot) => robot.position.x > halfX && robot.position.y < halfY).length;
	const q3 = movedRobots.filter((robot) => robot.position.x < halfX && robot.position.y > halfY).length;
	const q4 = movedRobots.filter((robot) => robot.position.x > halfX && robot.position.y > halfY).length;

	return q1 * q2 * q3 * q4;
}

export const day14: Solution = (input: string): Result => {
	const robots: Robot[] = input.split("\n").map((line)=> {
		const [_, px, py, vx, vy] = line.match(/p=(\d+),(\d+) v=(-?\d+),(-?\d+)/)!
		return {position: {y: Number(py), x: Number(px)}, velocity: {y: Number(vy), x: Number(vx)}};
	});
	return {first: first(robots), second: second(robots)};
}