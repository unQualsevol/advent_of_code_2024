import {Result, Solution} from "../types";

interface State {
	A: bigint,
	B: bigint,
	C: bigint,
	pointer: number;
	out: number[];
}

function combo(operand: number, state: State):bigint {
	if (operand < 4) return BigInt(operand);
	if (operand === 4) return state.A;
	if (operand === 5) return state.B;
	if (operand === 6) return state.C;
	throw Error("Invalid operand " + operand);
}

const Operate: ((operand: number, state: State) => State)[] = [
	(operand: number, state: State): State => ({...state, A: state.A >> combo(operand, state), pointer: state.pointer+2}),
	(operand: number, state: State): State => ({...state, B: (state.B ^ BigInt(operand)) % 8n, pointer: state.pointer+2}),
	(operand: number, state: State): State => ({...state, B: combo(operand, state) % 8n, pointer: state.pointer+2}),
	(operand: number, state: State): State => ({...state, pointer: (state.A === 0n) ? state.pointer+2 : operand}),
	(_: number, state: State): State => ({...state, B: (state.B ^ state.C) % 8n, pointer: state.pointer+2}),
	(operand: number, state: State): State => ({...state, out: [...state.out, Number(combo(operand, state)) % 8], pointer: state.pointer+2}),
	(operand: number, state: State): State => ({...state, B: state.A >> combo(operand, state), pointer: state.pointer+2}),
	(operand: number, state: State): State => ({...state, C: state.A >> combo(operand, state), pointer: state.pointer+2})
] as const;

function comboPrint(operand: number): string {
	if (operand < 4) return ""+operand;
	if (operand === 4) return "A";
	if (operand === 5) return "B";
	if (operand === 6) return "C";
	throw Error("Invalid operand " + operand);
}

const OperatePrint: ((operand: number, state: State) => string)[] = [
	(operand: number, state: State): string => `A(${Operate[0](operand, state).A}) = A(${state.A}) / 2^${comboPrint(operand)}(${combo(operand, state)})`,
	(operand: number, state: State): string => `B(${Operate[1](operand, state).B}) = B(${state.B}) ^ ${operand}`,
	(operand: number, state: State): string => `B(${Operate[2](operand, state).B}) = ${comboPrint(operand)}(${combo(operand, state)}) % 8`,
	(operand: number, state: State): string => `pointer(${Operate[3](operand, state).pointer}) = ${state.A === 0n ? state.pointer+2 : operand}`,
	(operand: number, state: State): string => `B(${Operate[4](operand, state).B}) = B(${state.B}) ^ C(${state.C})`,
	(operand: number, state: State): string => `out = ${[...state.out, comboPrint(operand)]}(${combo(operand, state)%8n}), state: ${JSON.stringify(state)}`,//({...state, out: [...state.out, combo(operand, state) % 8], pointer: state.pointer+2}),
	(operand: number, state: State): string => `B(${Operate[6](operand, state).B}) = A(${state.A}) / 2^${comboPrint(operand)}(${combo(operand, state)})`,
	(operand: number, state: State): string => `C(${Operate[7](operand, state).C}) = A(${state.A}) / 2^${comboPrint(operand)}(${combo(operand, state)})`,
] as const;

function execute(program: number[], state: State, logs = false): State {
	let currentState: State = state;
	while (currentState.pointer < program.length) {
		const currentOpCode = program[currentState.pointer];
		const currentOperand = program[currentState.pointer+1];
		if(logs) console.log(currentOpCode, OperatePrint[currentOpCode](currentOperand, currentState));
		currentState = Operate[currentOpCode](currentOperand, currentState);
	}
	return currentState;
}

function calculateInitialValue(output: number[], initial: number, program: number[]): bigint {
	let result = BigInt(initial);
	for (let i = output.length-1; i >= 0; i--) {
		let expected = output.slice(i).join(",")
		for (let j = 0; j < 8; j++) {
			let tempResult = (result << 3n) + BigInt(j);
			let test = execute(program, {A: tempResult, B: 0n, C:0n, pointer: 0, out: []}).out.join(",");
			if(test === expected) {
				result = tempResult;
				break;
			}
		}
	}
	return result;
}

export const day17: Solution = (input: string): Result => {
	const [A, B, C, ...program] = [...input.matchAll(/\d+/gm)].map((match) => Number(match[0]))
	const finalState = execute(program, {A: BigInt(A),B:BigInt(B),C:BigInt(C),pointer: 0, out: []});
	const output = finalState.out;
	const second = calculateInitialValue([...program], 0, program);
	return {first: output.join(","), second: second};
}