import {Result, Solution} from "../types";

function isSafeReport(report: number[]): boolean {
	const ascending = report[0]-report[1] < 0;
	return report.every((val, idx) => {
		if(idx === report.length-1){
			return true;
		}
		const diff = val - report[idx + 1];
		if(ascending) {
			return diff <= -1 && diff >= -3;
		}
		return diff >= 1 && diff <= 3;
	});
}

function isSafeReport2(report: number[]): boolean {
	if(isSafeReport(report)) return true;
	for (let i = 0; i < report.length; i++) {
		const smallReport = [...report]
		smallReport.splice(i, 1);
		if(isSafeReport(smallReport)) {
			return true;
		}
	}
	return false;
}

function first(reports: number[][]) {
	return reports.reduce((acc, current) => acc + (isSafeReport(current) ? 1 : 0), 0);
}

function second(reports: number[][]) {
	return reports.reduce((acc, current) => acc + (isSafeReport2(current) ? 1 : 0), 0);
}

export const day02: Solution = (input: string): Result => {
	const reports = input.split("\n").map((line) => line.split(" ").map(value => Number(value)));
	return {first: first(reports), second: second(reports)};
}