import { createPlugin } from './create-plugin';

describe('createPlugin', () => {
  it('is a function', () => expect(typeof createPlugin).toBe('function'));

  it('creates a plugin instance', () => {
    const p = createPlugin();
    expect(p).toBeTruthy();
    expect(typeof p.call).toBe('function');
    expect(typeof p.execActionCommand).toBe('function');
    expect(typeof p.execLinkCondition).toBe('function');
    expect(typeof p.finalize).toBe('function');
    expect(typeof p.getInfo).toBe('function');
    expect(typeof p.initialize).toBe('function');
    expect(typeof p.setInternal).toBe('function');
    expect(typeof p.setLocale).toBe('function');
    expect(typeof p.setParamValue).toBe('function');
    expect(typeof p.update).toBe('undefined');
  });
});
