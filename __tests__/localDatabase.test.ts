import { mergeUniqueBy } from '../src/storage/localDatabase';

interface Item {
  id: string;
  value: number;
}

describe('mergeUniqueBy', () => {
  it('merges arrays and overwrites by key when conflicts occur', () => {
    const existing: Item[] = [
      { id: 'a', value: 1 },
      { id: 'b', value: 2 },
    ];
    const incoming: Item[] = [
      { id: 'b', value: 3 },
      { id: 'c', value: 4 },
    ];

    const merged = mergeUniqueBy(existing, incoming, (item) => item.id);

    expect(merged).toEqual([
      { id: 'a', value: 1 },
      { id: 'b', value: 3 },
      { id: 'c', value: 4 },
    ]);
  });

  it('returns existing entries when there is no incoming data', () => {
    const existing: Item[] = [
      { id: 'x', value: 10 },
      { id: 'y', value: 20 },
    ];

    const merged = mergeUniqueBy(existing, undefined, (item) => item.id);

    expect(merged).toEqual(existing);
  });
});

