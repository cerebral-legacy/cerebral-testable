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

Example mocha test
```js
import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import Application from '../components/application';
import HomePage from '../components/homepage';

describe('<Application />', () => {
  it('renders the <HomePage />', () => {
    const wrapper = shallow(<Application page="home" />);
    expect(wrapper.find(HomePage)).to.have.length.of(1);
  });
});
```

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

Example mocha test
```js
import { expect } from 'chai';
import upperUser from '../computed/upperUser';

describe('upperUser() Computed', () => {
  it('gets the user name in upper case', () => {
    expect(upperUser({ name: 'fred' })).to.equal('FRED');
  });
});
```

## Module / Signal Testing

The testable controller lets you test your modules and signals in isolation.

Example mocha test
```js
import { expect } from 'chai';
import Controller from 'cerebral-testable/controller'

// module to test
import application from '../modules/application';

describe('application module', () => {
  let controller, signals;

  beforeEach(() => {
    [ controller, signals ] = Controller({
      /* Initial model state for the test */
    }, {
      application: application()
    });
    // if you need to mock services
    controller.mockServices('router', {
      redirect (url) { }
    });
  });

  it('redirects to "home" on unknown url', (done) => {
    controller.test((output) => {
      expect(controller.get('application.page')).to.equal('home');
    }, done);
    signals.application.unknownUrlReceived();
  });
});
```
