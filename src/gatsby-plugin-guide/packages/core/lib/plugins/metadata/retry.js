// Generated by CoffeeScript 2.6.1
var merge, utils;

({merge} = require('mixme'));

utils = require('../../utils');

module.exports = {
  name: '@nikitajs/core/lib/plugins/metadata/retry',
  hooks: {
    'nikita:action': function(action, handler) {
      var base, base1, base2, i, len, property, ref;
      if ((base = action.metadata).attempt == null) {
        base.attempt = 0;
      }
      if ((base1 = action.metadata).retry == null) {
        base1.retry = 1;
      }
      if ((base2 = action.metadata).sleep == null) {
        base2.sleep = 3000;
      }
      ref = ['attempt', 'sleep', 'retry'];
      for (i = 0, len = ref.length; i < len; i++) {
        property = ref[i];
        if (typeof action.metadata[property] === 'number') {
          if (action.metadata[property] < 0) {
            throw utils.error(`METADATA_${property.toUpperCase()}_INVALID_RANGE`, [`configuration \`${property}\` expect a number above or equal to 0,`, `got ${action.metadata[property]}.`]);
          }
        } else if (typeof action.metadata[property] !== 'boolean') {
          throw utils.error(`METADATA_${property.toUpperCase()}_INVALID_VALUE`, [`configuration \`${property}\` expect a number or a boolean value,`, `got ${JSON.stringify(action.metadata[property])}.`]);
        }
      }
      return function(args) {
        var config, failure, retry, run;
        action = args;
        ({retry} = action.metadata);
        config = merge({}, action.config);
        // Handle error
        failure = function(err) {
          if (retry !== true && action.metadata.attempt >= retry - 1) {
            throw err;
          }
          // Increment the attempt metadata
          action.metadata.attempt++;
          action.config = merge({}, config);
          // Reschedule
          return run();
        };
        run = async function() {
          var err;
          try {
            return (await handler.call(null, args));
          } catch (error) {
            err = error;
            return failure(err);
          }
        };
        return run();
      };
    }
  }
};
