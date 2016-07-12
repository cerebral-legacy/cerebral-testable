module.exports = {
  Controller: function (state, modules) {
    var model = require('cerebral-model-immutable')({});
    var controller = require('cerebral').Controller(model);

    if (modules) {
      controller.addModules(modules);
    }

    model.tree.deepMerge(state);

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
  }
};
