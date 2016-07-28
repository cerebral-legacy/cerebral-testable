# cerebral-testable

When `NODE_ENV` is set to `'test'` cerebral will return your pure react components and computed functions, the crebral controller will be bypassed.

This means that you can easily test your components and computed functions just as if they were simple stateless/pure functions.

## React Components

```js
import { connect } from 'cerebral-view-react'

export default connect({
  name: 'user.name'
}, ({ name = 'test user' }) => (
  <div>{name}</div>
))
```

When `NODE_ENV === 'test'` cerebral-view-react/connect will not be called, instead your pure component will be returned, making it easy to test.

Example mocha test
```js
import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'

import Application from '../components/application'
import HomePage from '../components/homepage'

describe('<Application />', () => {
  it('renders the <HomePage />', () => {
    const wrapper = shallow(<Application page="home" />)
    expect(wrapper.find(HomePage)).to.have.length.of(1)
  })
})
```

## Computed

```js
import { Computed } from 'cerebral-view-react'

export default Computed({
  name: 'user.name'
}, ({ name = 'test user' }) => {
  return user.toUpperCase()
})
```

When `NODE_ENV === 'test'` cerebral/Computed will not be called, instead your pure function will be returned, making it easy to test.

Example mocha test
```js
import { expect } from 'chai'
import upperUser from '../computed/upperUser'

describe('upperUser() Computed', () => {
  it('gets the user name in upper case', () => {
    expect(upperUser({ name: 'fred' })).to.equal('FRED')
  })
})
```

## Module / Signal Testing

The testable controller lets you test your modules and signals in isolation.

Example mocha test
```js
import { expect } from 'chai'
import { Controller } from 'cerebral-testable'

// module to test
import application from '../modules/application'

describe('application module', () => {
  let controller, signals

  beforeEach(() => {
    [ controller, signals ] = Controller({
      /* Initial model state for the test */
    }, {
      application: application()
    });
    // if you need to mock services
    controller.mockServices('router', {
      redirect (url) { }
    })
  })

  it('redirects to "home" on unknown url (callback)', (done) => {
    controller.test((output) => {
      expect(controller.get('application.page')).to.equal('home')
    }, done)
    signals.application.unknownUrlReceived()
  })

  // same test as before but using a promise
  it('redirects to "home" on unknown url (promise)', () => {
    return controller.test(() => signals.application.unknownUrlReceived()).then((output) => {
      expect(controller.get('application.page')).to.equal('home')
    })
  })
})
```
