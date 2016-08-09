module.exports = {
  Controller: function (state, modules) {
    var model = require('cerebral/models/immutable')({});
    var controller = require('cerebral').Controller(model);

    if (modules) {
      controller.addModules(modules);
    }

    model.tree.deepMerge(state);

    controller.mockServices = function (module, services) {
      var mockModules = {};
      mockModules[module] = function (module) {
        module.addServices(services);
      };
      controller.addModules(mockModules);
    };

    controller.test = function (testFunc, done) {
      if (typeof done === 'function') {
        controller.once('signalEnd', function (output) {
          try {
            testFunc(output);
          } catch (e) {
            return done(e);
          }
          done();
        });
      } else {
        return new Promise(function (resolve, reject) {
          if (typeof testFunc !== 'function') {
            return reject('testFunc must be a function');
          }
          controller.once('signalEnd', resolve);
          try {
            testFunc();
          } catch (e) {
            reject(e)
          }
        });
      }
    };

    return [ controller, controller.getSignals() ];
  }
};
