import fs from 'fs';
import parse from './parse';
import { lines } from './pipes';

export {};

fs.readFile('../input/day13.txt', 'utf8', (err, contents) => {
  if (err !== null) {
    console.error(err);
    return;
  }

  const parseUnsignedInt = parse.while((c) => c.match(/^\d$/) !== null);
  const parseColon = parse.string(': ');

  const parseLine = parseUnsignedInt.apPrev(parseColon).bind((depth) =>
    parseUnsignedInt.map((range) =>
      ({depth: parseInt(depth, 10), range: parseInt(range, 10)})),
  );

  const layers: Map<number, { range: number, scanner: number, direction: number }> = new Map();
  let maxLayer: number = 0;

  for (const line of lines(contents)) {
    parseLine.parse(line).onResult(
      ({depth, range}) => {
        layers.set(depth, { range, scanner: 0, direction: -1 });
        maxLayer = Math.max(maxLayer, depth);
      },
      (i) => {
        console.error(`parse error:\n${line}\n${' '.repeat(i) + '^'}`);
        throw Error();
      },
    );
  }

  let p: number = 0;
  let caught: number = 0;

  while (p <= maxLayer) {
    const layer = layers.get(p);
    if (layer !== undefined) {
      if (layer.scanner === 0) {
        caught += p * layer.range;
      }
    }

    for (const [_, layer] of layers) {
      if (layer.scanner === 0 || layer.scanner === layer.range - 1) {
        layer.direction *= -1;
      }

      layer.scanner = (layer.scanner + layer.direction) % layer.range;
    }

    p++;
  }

  console.log(caught);

  let seive: Generator<number, void, unknown> = function*() {
    let i = 0;
    while (true) {
      yield i++;
    }
  }();

  for (const [depth, layer] of layers) {
    seive = function*(s) {
      for (const i of s) {
        if ((i + depth) % ((layer.range - 1) * 2) !== 0) {
          yield i;
        }
      }
    }(seive);
  }

  console.log(seive.next().value);
});
