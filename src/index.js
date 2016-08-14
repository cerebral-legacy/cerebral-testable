module.exports = {
  Controller: function (args) {
    if (typeof args !== 'object') {
      args = {}
    }
    var model = require('cerebral/models/immutable')({})
    var controller = require('cerebral').Controller(model)

    if (args.modules) {
      controller.addModules(args.modules)
    }

    if (args.state) {
      model.tree.deepMerge(args.state)
    }

    controller.mockServices = function (module, services) {
      var mockModules = {}
      mockModules[module] = function (module) {
        module.addServices(services)
      }
      controller.addModules(mockModules)
    }

    controller.test = function (testFunc) {
      return new Promise(function (resolve, reject) {
        if (typeof testFunc !== 'function') {
          return reject('testFunc must be a function')
        }
        controller.once('signalEnd', resolve)
        try {
          testFunc()
        } catch (e) {
          reject(e)
        }
      })
    }

    return {
      controller: controller,
      signals: controller.getSignals()
    }
  }
}
