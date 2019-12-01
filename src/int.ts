export type Int = number & { __int__: void };

export const roundToInt = (num: number): Int => Math.round(num) as Int;
