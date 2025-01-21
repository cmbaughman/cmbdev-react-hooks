import { renderHook, act } from '@testing-library/react';
import useAsync from '../src/useAsync';

describe('useAsync', () => {
  it('should execute async function and set data on success', async () => {
    const asyncFunction = jest.fn(() => Promise.resolve('Success!'));
    const { result } = renderHook(() => useAsync(asyncFunction, []));

    // Initially, data and error should be undefined
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeUndefined();

    await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });


    expect(result.current.data).toBe('Success!');
    expect(result.current.error).toBeUndefined();
    expect(asyncFunction).toHaveBeenCalled();
  });

  it('should execute async function and set error on failure', async () => {
    const asyncFunction = jest.fn(() => Promise.reject(new Error('Error!')));
    const { result } = renderHook(() => useAsync(asyncFunction, []));

    // Initially, data and error should be undefined
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeUndefined();

    await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });


    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toEqual(new Error('Error!'));
    expect(asyncFunction).toHaveBeenCalled();
  });

  it('should re-execute when dependencies change', async () => {
    const asyncFunction = jest.fn(() => Promise.resolve('Success!'));
    let dependency = 1;
    const { result, rerender } = renderHook(
      () => useAsync(asyncFunction, [dependency]),
      { initialProps: { dependency } }
    );

    await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

    expect(asyncFunction).toHaveBeenCalledTimes(1);

    // Change the dependency
    dependency = 2;
    rerender({ dependency });

    await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });
    expect(asyncFunction).toHaveBeenCalledTimes(2);
  });
});