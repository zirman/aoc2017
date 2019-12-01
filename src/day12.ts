import fs from 'fs';
import parse from './parse';
import { lines } from './pipes';

export {};

fs.readFile('../input/day12.txt', 'utf8', (err, contents) => {
  if (err !== null) {
    console.error(err);
    return;
  }

  const parseUnsignedInt = parse.while((c) => c.match(/^\d$/) !== null);
  const parseComma = parse.string(', ');

  const parseLine = parseUnsignedInt.bind((node) =>
    parse.string(' <-> ').apNext(parse.sepBy1(parseUnsignedInt, parseComma)).map((adjacent) =>
      ({node, adjacent}),
    ),
  );

  const maps: Map<number, Array<number>> = new Map();

  for (const line of lines(contents)) {
    parseLine.parse(line).onResult(
      ({node, adjacent}) => {
        const n = parseInt(node, 10);
        const ns = adjacent.map((s) => parseInt(s, 10));
        maps.set(n, ns);
      },
      (i) => {
        console.error(`parse error:\n${line}\n${' '.repeat(i) + '^'}`);
        throw Error();
      },
    );
  }

  function difference<A>(setA: Set<A>, setB: Set<A>) {
    const d = new Set(setA);

    for (const elem of setB) {
      d.delete(elem);
    }

    return d;
  }

  let remaining = new Set(maps.keys());
  const t = traverse(0, new Set());
  remaining = difference(remaining, t);
  console.log(t.size);

  let count: number = 1;
  while (remaining.size > 0) {
    count += 1;
    remaining = difference(remaining, traverse(remaining.keys().next().value, new Set()));
  }

  console.log(count);

  function traverse(m: number, traversed: Set<number>): Set<number> {
    if (traversed.has(m)) {
      return traversed;
    }

    traversed.add(m);
    const adjacent = maps.get(m);

    if (adjacent !== undefined) {
      for (const adj of adjacent) {
        traverse(adj, traversed);
      }
    }

    return traversed;
  }
});
