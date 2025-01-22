# Cool React Hooks

[![npm (scoped)](https://img.shields.io/npm/v/cmbdev-react-hooks)](https://www.npmjs.com/package/cmbdev-react-hooks)
[![GitHub issues](https://img.shields.io/github/issues/cmbaughman/cmbdev-react-hooks)](https://github.com/cmbaughman/cmbdev-react-hooks/issues)
[![GitHub license](https://img.shields.io/github/license/cmbaughman/cmbdev-react-hooks)](https://github.com/cmbaughman/cmbdev-react-hooks/blob/main/LICENSE)

A collection of cool and useful React hooks from various sources and some rewritten by me.

```bash
npm install cmbdev-react-hooks
```

or

```
yarn add cmbdev-react-hooks
```

## Hooks

### `useAsync`

It's generally a good practice to indicate to users the status of any async request. An example would be fetching data from an API and displaying a loading indicator before rendering the results. Another example would be a form where you want to disable the submit button when the submission is pending and then display either a success or error message when it completes.

Rather than litter your components with a bunch of useState calls to keep track of the state of an async function, you can use our custom hook which takes an async function as an input and returns the value, error, and status values we need to properly update our UI. Possible values for status prop are: "idle", "pending", "success", "error". As you'll see in the code below, our hook allows both immediate execution and delayed execution using the returned execute function.

#### Usage

```javascript
import { useAsync } from 'cmbdev-react-hooks';

function App() {
  const { execute, status, value, error } = useAsync(myFunction, []);
  
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
```

### `useClickOutside`

Detects clicks outside of a specified element. Useful for closing modals, dropdowns, etc.

#### Usage

```javascript
import { useClickOutside } from 'cmbdev-react-hooks';

function MyCoolComponent() {
  const wrapperRef = useClickOutside(() => {
    // Do something when a click occurs outside the element
    console.log('Clicked outside!');
  });

  return <div ref={wrapperRef}>Click outside of this div</div>;
}
```

### `useDebounce`

Delays invoking a function until after a specified number of milliseconds have elapsed since the last time it was invoked. Useful for input fields, search bars, etc.

#### Usage

```javascript
import { useDebounce } from 'cmbdev-react-hooks';

function MyComponent() {
  const [value, setValue] = useState('');
  const debouncedValue = useDebounce(value, 500); // 500ms delay

  useEffect(() => {
    // Do something with the debounced value
    console.log('Debounced value:', debouncedValue);
  }, [debouncedValue]);

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
```

### `useEventListener`

A declarative way to add event listeners to DOM elements.

#### Usage

```javascript
import { useEventListener } from 'cmbdev-react-hooks';

function MyComponent() {
  const handler = useCallback((event) => {
    // Do something with the event
    console.log('Mouse moved!', event);
  }, []);

  useEventListener('mousemove', handler); // Defaults to window

  const myElementRef = useRef(null);
  useEventListener('click', handler, myElementRef.current); // Attach to a specific element

  return <div ref={myElementRef}>Move your mouse</div>;
}
```

### `useFetch`

Fetches data from an API and returns the data, loading state, and any errors.

#### Usage

```javascript
import { useFetch } from 'cmbdev-react-hooks';

function MyCoolComponent() {
  const { data, loading, error } = useFetch<{ message: string }>('[https://api.example.com/data](https://api.example.com/data)');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>Data: {data?.message}</div>;
}
```

### `useHover`

Detects when the mouse is hovering over an element.

#### Usage

```javascript
import { useHover } from 'cmbdev-react-hooks';

function MyComponent() {
  const [hoverRef, isHovered] = useHover<HTMLDivElement>();

  return (
    <div ref={hoverRef}>
      {isHovered ? '😁' : '☹️'}
    </div>
  );
}
```

### `useKeyPress`

Detects when a specific key is pressed.

#### Usage

```javascript
import { useKeyPress } from 'cmbdev-react-hooks';

function App() {
  const happyPress = useKeyPress('h');
  const sadPress = useKeyPress('s');
  const robotPress = useKeyPress('r');
  const foxPress = useKeyPress('f');

  return (
    <div>
      <div>h, s, r, f</div>
      <div>
        {happyPress && '😊'}
        {sadPress && '😢'}
        {robotPress && '🤖'}
        {foxPress && '🦊'}
      </div>
    </div>
  );
}
```

### `useLocalStorage`

Manages a value in local storage.

#### Usage

```javascript
import { useLocalStorage } from 'cmbdev-react-hooks';

function MyComponent() {
  const [name, setName] = useLocalStorage('name', 'Bob');

  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>
  );
}
```

### `useMediaQuery`

Detects if the window matches a given media query.

#### Usage

```javascript
import { useMediaQuery } from 'cmbdev-react-hooks';

function MyComponent() {
  const isSmallScreen = useMediaQuery('(max-width: 600px)');

  return (
    <div>
      Screen is small: {isSmallScreen ? 'Yes' : 'No'}
    </div>
  );
}
```

### Contributing

Contributions are welcome! Please read the contributing guidelines before submitting a pull request.

### License

MIT
