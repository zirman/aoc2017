import * as Either from 'fp-ts/lib/Either';
import * as Option from 'fp-ts/lib/Option';
import fs from 'fs';
import * as Parse from './parse';
import { lines } from './pipes';

export {};

const parseOWhite: Parse.Parser<null> = Parse.map(Parse.parseOption(Parse.parseWhite), () => null);
const parseName: Parse.Parser<string> = Parse.apNext(parseOWhite, Parse.parsePred((c) => c.match(/^[a-z]$/i) !== null));
const parseWeight: Parse.Parser<number> =
  Parse.apNext(parseOWhite, Parse.apPrev(Parse.apNext(Parse.parseChar('('), Parse.parsePosInt), Parse.parseChar(')')));
const parseArrow: Parse.Parser<null> = Parse.apPrev(parseOWhite, Parse.parseString('->'));
const parseComma: Parse.Parser<null> = Parse.apPrev(parseOWhite, Parse.parseChar(','));

const parseNode: Parse.Parser<{ name: string, weight: number, children: Option.Option<Array<string>> }> =
  Parse.bind(
    parseName,
    (name) => Parse.bind(
      parseWeight,
      (weight) => Parse.map(
        Parse.parseOption(
          Parse.apNext(
            parseArrow,
            Parse.parseOnePlusDelimited(
              parseName,
              parseComma,
            ),
          ),
        ),
        (children) => ({name, weight, children}),
      ),
    ),
  );

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
    const res = parseNode(line.split(''), 0);

    if (Either.isRight(res)) {
      const n = res.right.x;
      const node = new Node(n.name, n.weight, [], NaN);

      if (Option.isSome(n.children)) {
        for (const childName of n.children.value) {
          const child = byName.get(childName);
          if (child !== undefined) {
            node.children.push(child);
            byName.delete(childName);
          } else {
            byChildren.set(childName, node);
          }
        }
      }

      const parent = byChildren.get(node.name);

      if (parent !== undefined) {
        parent.children.push(node);
      } else {
        byName.set(node.name, node);
      }
    }
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
