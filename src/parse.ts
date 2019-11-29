import * as Either from 'fp-ts/lib/Either';
import * as Option from 'fp-ts/lib/Option';
import { pipe } from './pipes';

export class Suc<A> {
  public readonly x: A;
  public readonly i: number;

  constructor(x: A, i: number) {
    this.x = x;
    this.i = i;
  }
}

export type Fail = number;
export type Parser<A> = (source: Array<string>, index: number) => Either.Either<Fail, Suc<A>>;

export function map<A, B>(pa: Parser<A>, f: (x: A) => B): Parser<B> {
  return (source, i) =>
    pipe(
      pa(source, i),
      Either.map((r) => new Suc(f(r.x), r.i)),
    );
}

export function bind<A, B>(pa: Parser<A>, f: (x: A) => Parser<B>): Parser<B> {
  return (source, i) =>
    pipe(
      pa(source, i),
      Either.map((r) => f(r.x)(source, r.i)),
      Either.flatten,
    );
}

export function apNext<A, B>(pa: Parser<A>, pb: Parser<B>): Parser<B> {
  return (source, i) =>
    pipe(
      pa(source, i),
      Either.map((r) => pb(source, r.i)),
      Either.flatten,
    );
}

export function apPrev<A, B>(pa: Parser<A>, pb: Parser<B>): Parser<A> {
  return (source, i) => {
    const res = pa(source, i);

    if (Either.isLeft(res)) {
      return res;
    }

    const res1 = pb(source, res.right.i);

    if (Either.isRight(res1)) {
      return Either.right(new Suc(res.right.x, res1.right.i));
    }

    return res1;
  };
}

export function parseChar(c: string): Parser<string> {
  return (source, i) => {
    if (source[i] === c) {
      return Either.right(new Suc(c, i + 1));
    } else {
      return Either.left(i);
    }
  };
}

export function parseString(c: string): Parser<string> {
  const cs = c.split('');
  return (source, i) => {
    let j = 0;
    while ((i + j) < source.length && j < cs.length && source[i + j].codePointAt(0) === cs[j].codePointAt(0)) {
      j += 1;
    }
    if (j === cs.length) {
      return Either.right(new Suc(c, i + j));
    } else {
      return Either.left(j);
    }
  };
}

export function parsePred(
  p: (c: string) => boolean,
): (source: Array<string>, i: number) => Either.Either<Fail, Suc<string>> {
  return (source, i) => {
    const cs = [];
    let j: number = i;
    while (j < source.length && p(source[j])) {
      cs.push(source[j]);
      j += 1;
    }
    if (j !== i) {
      return Either.right(new Suc(cs.join(''), j));
    } else {
      return Either.left(j);
    }
  };
}

export function parseWhite(source: Array<string>, i: number): Either.Either<Fail, Suc<null>> {
  let j: number = i;
  while (j < source.length && source[j].match(/^\s$/) !== null) {
    j += 1;
  }
  if (j !== i) {
    return Either.right(new Suc(null, j));
  } else {
    return Either.left(j);
  }
}

export function parsePosInt(source: Array<string>, i: number): Either.Either<Fail, Suc<number>> {
  let n: number = 0;
  let j: number = i;
  while (j < source.length && source[j].match(/^\d$/) !== null) {
    n *= 10;
    n += source[j].charCodeAt(0) - 48;
    j += 1;
  }
  if (j !== i) {
    return Either.right(new Suc(n, j));
  } else {
    return Either.left(j);
  }
}

export function parseOption<A>(pa: Parser<A>): Parser<Option.Option<A>> {
  return (source, i) => {
    const res = pa(source, i);
    if (Either.isRight(res)) {
      return Either.right(new Suc(Option.some(res.right.x), res.right.i));
    } else {
      return Either.right(new Suc(Option.none, i));
    }
  };
}

export function parseOnePlusDelimited<A, B>(pa: Parser<A>, delim: Parser<B>): Parser<Array<A>> {
  return (source: Array<string>, i: number): Either.Either<Fail, Suc<Array<A>>> => {
    const res: Either.Either<Fail, Suc<A>> = pa(source, i);
    if (Either.isLeft(res)) {
      return res;
    }

    let j: number = res.right.i;
    const cs: Array<A> = [res.right.x];

    const plus = apNext(delim, pa);

    while (true) {
      const res1 = plus(source, j);
      if (Either.isLeft(res1)) {
        return Either.right(new Suc(cs, j));
      }
      cs.push(res1.right.x);
      j = res1.right.i;
    }
  };
}
