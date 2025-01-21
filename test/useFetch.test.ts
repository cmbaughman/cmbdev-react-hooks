import { renderHook, act } from '@testing-library/react';
import useFetch from '../src/useFetch';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ data: 'test data' }),
  })
) as jest.Mock;

describe('useFetch', () => {
  it('should fetch data', async () => {
    const { result } = renderHook(() => useFetch<{ data: string }>('https://api.example.com/data'));

    await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

    expect(result.current.data).toEqual({ data: 'test data' });
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle fetch error', async () => {
    (fetch as jest.Mock).mockImplementationOnce(() => Promise.reject(new Error('Fetch error')));

    const { result } = renderHook(() => useFetch<{ data: string }>('https://api.example.com/data'));

    await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toEqual(new Error('Fetch error'));
  });
});