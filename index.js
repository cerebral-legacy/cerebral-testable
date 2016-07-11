module.exports = {
  Computed: function (deps, func) {
    if (process.env.NODE_ENV === 'test') {
      return func;
    } else {
      return require('cerebral').Computed(deps, func);
    }
  },
  connect: function (deps, Component) {
    if (process.env.NODE_ENV === 'test') {
      return Component;
    } else {
      return require('cerebral-view-react').connect(deps, Component);
    }
  }
};
