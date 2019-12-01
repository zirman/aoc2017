import fs from 'fs';
import maybe from './maybe';
import parse, { Parser } from './parse';
import { lines } from './pipes';

export {};

const parseUnsignedInt: Parser<string> = parse.while((c) => c.match(/^\d$/) !== null);
const parseName: Parser<string> = parse.while((c) => c.match(/^[a-z]$/i) !== null);
const parseWeight: Parser<string> = parse.string('(').apNext(parseUnsignedInt).apPrev(parse.string(')'));
const parseArrow: Parser<string> = parse.string(' -> ');
const parseComma: Parser<string> = parse.string(', ');

const parseNode =
  parseName.apPrev(parse.string(' ')).bind((name) =>
    parseWeight.bind((weight) =>
      parse.optionMaybe(parseArrow.apNext(parse.sepBy1(parseName, parseComma))).map((maybeChildren) =>
        ({
          name,
          weight: parseInt(weight, 10),
          children: maybe.joinArray(maybeChildren),
        }),
      ),
    ));

class Node {
  public readonly name: string;
  public readonly weight: number;
  public readonly children: Array<Node>;
  public totalWeight: number;

  constructor(name: string, weight: number, children: Array<Node>, totalWeight: number) {
    this.name = name;
    this.weight = weight;
    this.children = children;
    this.totalWeight = totalWeight;
  }
}

fs.readFile('../input/day7.txt', 'utf8', (err, contents) => {
  if (err !== null) {
    console.error(err);
    return;
  }

  const byName: Map<string, Node> = new Map<string, Node>();
  const byChildren: Map<string, Node> = new Map<string, Node>();

  for (const line of lines(contents)) {
    parseNode.parse(line).onResult(
      ({ name, weight, children }) => {
        const node = new Node(name, weight, [], NaN);

        for (const childName of children) {
          const child = byName.get(childName);

          if (child !== undefined) {
            node.children.push(child);
            byName.delete(childName);
          } else {
            byChildren.set(childName, node);
          }
        }

        const parent = byChildren.get(node.name);

        if (parent !== undefined) {
          parent.children.push(node);
        } else {
          byName.set(node.name, node);
        }
      },
      (i) => {
        console.error(`parse error:\n${line}\n${' '.repeat(i) + '^'}`);
        throw Error();
      },
    );
  }

  function initTotalWeight(node: Node): number {
    node.totalWeight = node.weight;

    for (const child of node.children) {
      const childWeight: number = initTotalWeight(child);
      node.totalWeight += childWeight;
    }

    return node.totalWeight;
  }

  function fixTotalWeight(node: Node, totalWeight: number): void {
    if (node.children.length > 0) {
      const map: Map<string, Array<number>> = new Map();

      for (let i = 0; i < node.children.length; i += 1) {
        const childTotalWeight = node.children[i].totalWeight;
        const p = map.get(childTotalWeight.toString());

        if (p !== undefined) {
          p.push(i);
        } else {
          map.set(node.children[i].totalWeight.toString(), [i]);
        }
      }

      if (map.size === 2) {
        let wrongChildTotalWeightIndex: number;
        let childTotalWeight: number;

        for (const [w, is] of map) {
          if (is.length === 1) {
            wrongChildTotalWeightIndex = is[0];
          } else {
            childTotalWeight = parseInt(w, 10);
          }
        }

        fixTotalWeight(node.children[wrongChildTotalWeightIndex], childTotalWeight);
      } else {
        console.log(totalWeight - (node.totalWeight - node.weight));
      }
    }
  }

  for (const [name, node] of byName) {
    console.log(name);
    initTotalWeight(node);

    if (node.children.length > 0) {
      const map: Map<string, Array<number>> = new Map();

      for (let i = 0; i < node.children.length; i += 1) {
        const childTotalWeight = node.children[i].totalWeight;
        const p = map.get(childTotalWeight.toString());

        if (p !== undefined) {
          p.push(i);
        } else {
          map.set(node.children[i].totalWeight.toString(), [i]);
        }
      }

      if (map.size === 2) {
        let wrongChildTotalWeightIndex: number;
        let childTotalWeight: number;

        for (const [w, is] of map) {
          if (is.length === 1) {
            wrongChildTotalWeightIndex = is[0];
          } else {
            childTotalWeight = parseInt(w, 10);
          }
        }

        fixTotalWeight(node.children[wrongChildTotalWeightIndex], childTotalWeight);
      }
    }
  }
});
