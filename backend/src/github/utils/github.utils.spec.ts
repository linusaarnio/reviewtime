import { createState } from './github.utils';

describe('createState', () => {
  it('should give different responses on subsequent calls', () => {
    const first = createState();
    const second = createState();
    expect(first === second).toBeFalsy();
  });

  it('should give a long string', () => {
    const state = createState();
    expect(state.length).toBeGreaterThan(20);
  });
});
