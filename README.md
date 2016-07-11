# cerebral-testable

Cerebral-testable is a very thin wrapper over some cerebral functions to make them more testable. Be sure to use webpack (or similar) configured to eliminate unreachable code when making your production build.

## React Components

```js
import { connect } from 'cerebral-testable'

export default connect({
  name: 'user.name'
}, ({ name = 'test user' }) => (
  <div>{name}</div>
))
```

Now when `NODE_ENV === 'test'` cerebral-view-react/connect will not be called, instead your pure component will be returned, making it easy to test.

## Computed

```js
import { Computed } from 'cerebral-testable'

export default Computed({
  name: 'user.name'
}, ({ name = 'test user' }) => {
  return user.toUpperCase()
})
```

Now when `NODE_ENV === 'test'` cerebra/Computed will not be called, instead your pure function will be returned, making it easy to test.
