import fs from 'fs';
import parse from './parse';
import { lines } from './pipes';

export {};

fs.readFile('../input/day8.txt', 'utf8', (err, contents) => {
  if (err !== null) {
    console.error(err);
    return;
  }

  const parseSpace = parse.string(' ');
  const parseName = parse.while((c) => c.match(/^[a-z]$/i) !== null);
  const parseDigits = parse.while((c) => c.match(/^\d$/i) !== null);
  const parseIncOrDec = parse.string('inc').or(parse.string('dec'));
  const parseIf = parse.string('if');

  const parseNumber = parse.optionMaybe(parse.string('-')).bind((sign) =>
    parseDigits.map((digits) => {
      let n = 0;

      for (const i of digits) {
        n *= 10;
        n += i.charCodeAt(0) - 48;
      }

      return sign.toNullable() === null ? n : -1 * n;
    }),
  );

  const parseBoolOp = parse.string('<=')
    .or(parse.string('>='))
    .or(parse.string('=='))
    .or(parse.string('!='))
    .or(parse.string('<'))
    .or(parse.string('>'));

  const parseInst =
    parseName.apPrev(parseSpace).bind((register) =>
      parseIncOrDec.apPrev(parseSpace).bind((incOrDec) =>
        parseNumber.apPrev(parseSpace).apPrev(parseIf).apPrev(parseSpace).bind((num) =>
          parseName.apPrev(parseSpace).bind((predicateRegister) =>
            parseBoolOp.apPrev(parseSpace).bind((predicateOp) =>
              parseNumber.map((predicateNumber) =>
                ({
                  register,
                  incOrDec,
                  num,
                  predicateRegister,
                  predicateOp,
                  predicateNumber,
                }),
              ),
            ),
          ),
        ),
      ),
    );

  let maxEver = 0;
  const registers: Map<string, number> = new Map();

  for (const line of lines(contents)) {
    parseInst.parse(line).onResult(
      (inst) => {
        if ( (inst.predicateOp === '<'  && (registers.get(inst.predicateRegister) ?? 0) <  inst.predicateNumber )
          || (inst.predicateOp === '>'  && (registers.get(inst.predicateRegister) ?? 0) >  inst.predicateNumber )
          || (inst.predicateOp === '<=' && (registers.get(inst.predicateRegister) ?? 0) <= inst.predicateNumber )
          || (inst.predicateOp === '>=' && (registers.get(inst.predicateRegister) ?? 0) >= inst.predicateNumber )
          || (inst.predicateOp === '==' && (registers.get(inst.predicateRegister) ?? 0) === inst.predicateNumber)
          || (inst.predicateOp === '!=' && (registers.get(inst.predicateRegister) ?? 0) !== inst.predicateNumber)) {
          exec(inst);
        }
      },
      (i) => {
        console.error(`parse error:\n${line}\n${' '.repeat(i) + '^'}`);
        throw Error();
      },
    );
  }

  let max = 0;

  for (const [name, register] of registers) {
    max = Math.max(max, register);
  }

  console.log(registers);
  console.log(max);
  console.log(maxEver);

  function exec(inst: {
      register: string;
      incOrDec: string;
      num: number;
      predicateRegister: string;
      predicateOp: string;
      predicateNumber: number;
  }) {
    let x: number;

    if (inst.incOrDec === 'inc') {
      x = (registers.get(inst.register) ?? 0) + inst.num;
    } else {
      x = (registers.get(inst.register) ?? 0) - inst.num;
    }

    registers.set(inst.register, x);
    maxEver = Math.max(maxEver, x);
  }
});
