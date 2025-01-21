/*
It's generally a good practice to indicate to users the status of 
any async request. An example would be fetching data from an API 
and displaying a loading indicator before rendering the results.
Another example would be a form where you want to disable the submit 
button when the submission is pending and then display either a 
success or error message when it completes.
Rather than litter your components with a bunch of useState 
calls to keep track of the state of an async function,
you can use our custom hook which takes an async function 
as an input and returns the value, error, and status values 
we need to properly update our UI. Possible values for status 
prop are: "idle", "pending", "success", "error". As you'll see
in the code below, our hook allows both immediate execution and 
delayed execution using the returned execute function.
*/

// Usage
/*
function App() {
  const { execute, status, value, error } = useAsync(myFunction, false);
  return (
    <div>
      {status === "idle" && <div>Start your journey by clicking a button</div>}
      {status === "success" && <div>{value}</div>}
      {status === "error" && <div>{error}</div>}
      <button onClick={execute} disabled={status === "pending"}>
        {status !== "pending" ? "Click me" : "Loading..."}
      </button>
    </div>
  );
}

const myFunction = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const rnd = Math.random() * 10;
      rnd <= 5
        ? resolve("Submitted successfully 🙌")
        : reject("Oh no there was an error 😞");
    }, 2000);
  });
};
*/
import { useState, useEffect, useCallback } from 'react';

interface State<T> {
  data?: T;
  error?: Error;
}

type AsyncFunction<T> = () => Promise<T>;

function useAsync<T>(asyncFunction: AsyncFunction<T>, dependencies: any[] = []): State<T> {
  const [state, setState] = useState<State<T>>({
    data: undefined,
    error: undefined,
  });

  const execute = useCallback(() => {
    setState({ data: undefined, error: undefined });
    asyncFunction()
      .then((response: T) => setState({ data: response, error: undefined }))
      .catch((error: Error) => setState({ data: undefined, error }));
  }, dependencies);

  useEffect(() => {
    execute();
  }, [execute]);

  return state;
}

export default useAsync;