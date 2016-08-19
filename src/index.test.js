/* eslint-env mocha */
var expect = require('chai').expect
var Controller = require('.').Controller

var testModule = (module) => {
  module.addState({
    x: 1
  })
  module.addSignals({
    xUpdated: [
      ({ input, state }) => state.set('x', input.x)
    ],
    xUpdatedFromService: [
      ({ services: { mock }, state }) => state.set('x', mock.service())
    ]
  })
}

describe('testable controller', () => {
  describe('state, signals, mock services', () => {
    let controller, signals

    beforeEach(() => {
      ({ controller, signals } = Controller({
        state: {
          x: 2
        },
        modules: {
          testModule: testModule
        }
      }))
      controller.mockServices('mock', {
        service: function () {
          return 4
        }
      })
    })

    it('overrides default state with initial test state', () => {
      expect(controller.get('x')).to.equal(2)
    })

    it('resolves a promise when signals complete', () => controller
      .test(() => signals.testModule.xUpdated({ x: 3 }))
      .then(() => expect(controller.get('x')).to.equal(3)))

    it('rejects a promise when signals fail', () => controller
      .test(() => {
        throw Error('test error')
      })
      .catch((e) => expect(e).to.eql(Error('test error'))))

    it('checks that testFunc is a function', () => controller
      .test(1).catch((err) => expect(err).to.equal('testFunc must be a function')))

    it('can mock services', () => controller
      .test(() => signals.testModule.xUpdatedFromService())
      .then(() => expect(controller.get('x')).to.equal(4)))
  })

  it('works without a module', () => {
    let { controller } = Controller({
      state: { x: 2 }
    })
    expect(controller.get('x')).to.equal(2)
  })

  it('works without test state', () => {
    let { controller, signals } = Controller({
      modules: {
        testModule: testModule
      }
    })
    return controller
     .test(() => signals.testModule.xUpdated({ x: 5 }))
     .then(() => expect(controller.get('x')).to.equal(5))
  })

  it('works without test state or module', () => {
    let { controller } = Controller()
    expect(controller.get('x')).to.equal(undefined)
  })

  it('can set state over and over', () => {
    let { controller } = Controller()
    controller.set('parent.child', 'x')
    expect(controller.get('parent.child')).to.equal('x')
    controller.set('parent.child', 'y')
    expect(controller.get('parent.child')).to.equal('y')
  })
})
