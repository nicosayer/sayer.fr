import { chunk } from "lodash";

export const mapAsync = async <F, T>(
  collection: F[] | Promise<F>[] | Promise<F[]> | Promise<Promise<F>[]>,
  callback: (value: F, index: number) => T | Promise<T>
): Promise<T[]> =>
  Promise.resolve(collection).then((resolvedCollection) =>
    Promise.all(
      (resolvedCollection as Array<F | Promise<F>>).map((value, index) =>
        Promise.resolve(value).then((resolvedValue) =>
          callback(resolvedValue, index)
        )
      )
    )
  );

export type Resolve<T> = T extends Promise<infer U> ? U : T;

const resolveValue = <K, V>(tuple: [K, V | Promise<V>]): Promise<[K, V]> =>
  Promise.resolve(tuple[1]).then((value) => [tuple[0], value]);

const propsFn = <T>(
  object: T
): Promise<{ [key in keyof T]: Resolve<T[key]> }> =>
  // @ts-ignore
  Promise.all(Object.entries(object).map(resolveValue)).then(
    Object.fromEntries
  ) as Promise<{ [key in keyof T]: Resolve<T[key]> }>;

export const propsAsync = async <T>(
  props: Promise<T> | T
): Promise<{ [key in keyof T]: Resolve<T[key]> }> =>
  Promise.resolve(props).then(propsFn);

export const reduceAsync = <I, O>(
  collection: I[] | Promise<I>[] | Promise<I[]> | Promise<Promise<I>[]>,
  callback: (acc: O, cur: I, index: number) => O | Promise<O>,
  initialValue: O | Promise<O>
): Promise<O> =>
  Promise.resolve(collection).then(
    (resolvedCollection) =>
      // @ts-ignore
      resolvedCollection.reduce<Promise<O>>(
        (acc: Promise<O>, cur: I | Promise<I>, i: number) =>
          Promise.all([acc, cur]).then(([a, c]) => callback(a, c, i)),
        initialValue
      ) as Promise<O>
  );

// @ts-ignore
const flatFn = <T>(result: Array<T | T[]>): T[] => result.flat();

export const flatMapAsync = async <F, T>(
  collection: F[] | Promise<F>[] | Promise<F[]> | Promise<Promise<F>[]>,
  callback: (value: F, index: number) => T[] | Promise<T[]> | T | Promise<T>
): Promise<T[]> => mapAsync(collection, callback).then(flatFn);

const resolveAll = <T>(arr: T[] | Promise<T>[]): Promise<T[]> =>
  Promise.all(arr);

const filterFn = <T>([collection, filterResult]: [T[], unknown[]]): T[] =>
  collection.filter((_, i) => filterResult[i]);

const resolveCollectionAndValues = <T>(
  collection: T[] | Promise<T>[] | Promise<T[]> | Promise<Promise<T>[]>
): Promise<T[]> => Promise.resolve(collection).then(resolveAll);

export const filterAsync = async <T>(
  collection: T[] | Promise<T>[] | Promise<T[]> | Promise<Promise<T>[]>,
  callback: (value: T, index: number) => unknown | Promise<unknown>
): Promise<T[]> =>
  Promise.all([
    resolveCollectionAndValues(collection),
    mapAsync(collection, callback),
  ]).then(filterFn);

export const runInParallel = async <F>(
  collection: F[] | Promise<F>[] | Promise<F[]> | Promise<Promise<F>[]>,
  callback: (value: F, index: number) => void
) => {
  await mapAsync(collection, callback);
};

export const runInSeries = async <F>(
  collection: F[] | Promise<F>[] | Promise<F[]> | Promise<Promise<F>[]>,
  callback: (value: F, index: number) => void
) => {
  await reduceAsync(
    collection,
    async (acc, cur, index) => callback(cur, index),
    {}
  );
};

export const runInBatch = async <F>(
  batchSize: number,
  collection: F[] | Promise<F>[] | Promise<F[]> | Promise<Promise<F>[]>,
  callback: (value: F, index: number) => void
) => {
  await mapAsyncBatch(batchSize, collection, callback);
};

export const mapAsyncBatch = async <F, T>(
  batchSize: number,
  collection: F[] | Promise<F>[] | Promise<F[]> | Promise<Promise<F>[]>,
  callback: (value: F, index: number) => T | Promise<T>
): Promise<T[]> => {
  const resolvedCollection = await collection;
  const batches = chunk<Promise<F> | F>(resolvedCollection, batchSize);
  return reduceAsync<(Promise<F> | F)[], T[]>(
    batches,
    async (acc, cur, index1) => {
      const mappedData = await mapAsync(Promise.all(cur), (value, index2) =>
        callback(value, index1 * batchSize + index2)
      );
      return [...acc, ...mappedData];
    },
    []
  );
};
