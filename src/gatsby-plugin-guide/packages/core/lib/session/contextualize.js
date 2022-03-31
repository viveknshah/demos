// Generated by CoffeeScript 2.6.1
var is_object_literal, mutate, properties, utils,
  indexOf = [].indexOf;

({mutate, is_object_literal} = require('mixme'));

utils = require('../utils');

module.exports = function(args) {
  var arg, default_action, i, k, kk, len, new_action, prop, v, vv;
  // args_is_array = args.some (arg) -> Array.isArray arg
  // # Multiply the arguments
  // actions = utils.array.multiply ...args
  // Reconstituate the action
  default_action = function() {
    return {
      config: {},
      metadata: {},
      hooks: {},
      state: {}
    };
  };
  new_action = default_action();
  for (i = 0, len = args.length; i < len; i++) {
    arg = args[i];
    switch (typeof arg) {
      case 'function':
        if (new_action.handler) {
          throw utils.error('NIKITA_SESSION_INVALID_ARGUMENTS', [`handler is already registered, got ${utils.error.got(arg)}`]);
        }
        mutate(new_action, {
          handler: arg
        });
        break;
      case 'string':
        if (new_action.handler) {
          throw utils.error('NIKITA_SESSION_INVALID_ARGUMENTS', [`handler is already registered, got ${JSON.stringigy(arg)}`]);
        }
        mutate(new_action, {
          metadata: {
            argument: arg
          }
        });
        break;
      case 'object':
        if (Array.isArray(arg)) {
          throw utils.error('NIKITA_SESSION_INVALID_ARGUMENTS', [`argument cannot be an array, got ${utils.error.got(arg)}`]);
        }
        if (arg === null) {
          mutate(new_action, {
            metadata: {
              argument: null
            }
          });
        } else if (is_object_literal(arg)) {
          for (k in arg) {
            v = arg[k];
            if (k === '$') {
// mutate new_action, v
              for (kk in v) {
                vv = v[kk];
                if (['config', 'metadata'].includes(kk)) {
                  new_action[kk] = {...new_action[kk], ...vv};
                } else {
                  new_action[kk] = vv;
                }
              }
            } else if (k[0] === '$') {
              if (k === '$$') {
                mutate(new_action.metadata, v);
              } else {
                prop = k.substr(1);
                if (indexOf.call(properties, prop) >= 0) {
                  new_action[prop] = v;
                } else {
                  new_action.metadata[prop] = v;
                }
              }
            } else {
              if (v !== void 0) {
                new_action.config[k] = v;
              }
            }
          }
        } else {
          mutate(new_action, {
            metadata: {
              argument: arg
            }
          });
        }
        break;
      default:
        mutate(new_action, {
          metadata: {
            argument: arg
          }
        });
    }
  }
  // Create empty action when no arguments are provided and not for an empty array
  // new_actions = default_action() if not args.length
  return new_action;
};

properties = ['context', 'handler', 'hooks', 'metadata', 'config', 'parent', 'plugins', 'registry', 'run', 'scheduler', 'ssh', 'state'];
