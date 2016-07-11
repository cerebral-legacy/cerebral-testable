module.exports = function (state, modules) {
  var controller = require('cerebral').Controller(require('cerebral-model-immutable')(state));

  if (modules) {
    controller.addModules(modules);
  }

  controller.mockServices = function (module, services) {
    let mockModules = {};
    mockModules[module] = function (module) {
      module.addServices(services);
    };
    controller.addModules(mockModules);
  };

  controller.test = function (testFunc, done) {
    controller.once('signalEnd', function (output) {
      try {
        testFunc(output);
      } catch (e) {
        return done(e);
      }
      done();
    });
  };

  return [ controller, controller.getSignals() ];
};
