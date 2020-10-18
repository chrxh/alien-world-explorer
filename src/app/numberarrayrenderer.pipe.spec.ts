import { VectorRenderer2dPipe } from './vectorrender2d.pipe';

describe('VectorPrinter2dPipe', () => {
  it('create an instance', () => {
    const pipe = new VectorRenderer2dPipe();
    expect(pipe).toBeTruthy();
  });
});
