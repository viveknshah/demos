// Generated by CoffeeScript 2.6.1
// # Partial

// Replace partial elements in a text.
var utils;

module.exports = function(config, log) {
  var from, from_index, i, len, linebreak, opts, orgContent, place_before, pos, posoffset, ref, ref1, res, results, to;
  if (!((ref = config.write) != null ? ref.length : void 0)) {
    return;
  }
  log({
    message: "Replacing sections of the file",
    level: 'DEBUG'
  });
  ref1 = config.write;
  results = [];
  for (i = 0, len = ref1.length; i < len; i++) {
    opts = ref1[i];
    if (opts.match) {
      if (opts.match == null) {
        opts.match = opts.replace;
      }
      if (typeof opts.match === 'string') {
        log({
          message: "Convert match string to regexp",
          level: 'DEBUG'
        });
      }
      if (typeof opts.match === 'string') {
        opts.match = RegExp(`${utils.regexp.quote(opts.match)}`, "mg");
      }
      if (!(opts.match instanceof RegExp)) {
        throw Error(`Invalid match option, got ${JSON.stringify(opts.match)} instead of a RegExp`);
      }
      if (opts.match.test(config.content)) {
        config.content = config.content.replace(opts.match, opts.replace);
        results.push(log({
          message: "Match existing partial",
          level: 'INFO'
        }));
      } else if (opts.place_before && typeof opts.replace === 'string') {
        if (typeof opts.place_before === "string") {
          opts.place_before = new RegExp(RegExp(`^.*${utils.regexp.quote(opts.place_before)}.*$`, "mg"));
        }
        if (opts.place_before instanceof RegExp) {
          log({
            message: "Replace with match and place_before regexp",
            level: 'DEBUG'
          });
          posoffset = 0;
          orgContent = config.content;
          while ((res = opts.place_before.exec(orgContent)) !== null) {
            log({
              message: "Before regexp found a match",
              level: 'INFO'
            });
            pos = posoffset + res.index; //+ res[0].length
            config.content = config.content.slice(0, pos) + opts.replace + '\n' + config.content.slice(pos);
            posoffset += opts.replace.length + 1;
            if (!opts.place_before.global) {
              break;
            }
          }
          results.push(place_before = false); // if content
        } else {
          log({
            message: "Forgot how we could get there, test shall say it all",
            level: 'DEBUG'
          });
          linebreak = config.content.length === 0 || config.content.substr(config.content.length - 1) === '\n' ? '' : '\n';
          results.push(config.content = opts.replace + linebreak + config.content);
        }
      } else if (opts.append && typeof opts.replace === 'string') {
        if (typeof opts.append === "string") {
          log({
            message: "Convert append string to regexp",
            level: 'DEBUG'
          });
          opts.append = new RegExp(`^.*${utils.regexp.quote(opts.append)}.*$`, 'mg');
        }
        if (opts.append instanceof RegExp) {
          log({
            message: "Replace with match and append regexp",
            level: 'DEBUG'
          });
          posoffset = 0;
          orgContent = config.content;
          results.push((function() {
            var results1;
            results1 = [];
            while ((res = opts.append.exec(orgContent)) !== null) {
              log({
                message: "Append regexp found a match",
                level: 'INFO'
              });
              pos = posoffset + res.index + res[0].length;
              config.content = config.content.slice(0, pos) + '\n' + opts.replace + config.content.slice(pos);
              posoffset += opts.replace.length + 1;
              if (!opts.append.global) {
                break;
              } else {
                results1.push(void 0);
              }
            }
            return results1;
          })());
        } else {
          linebreak = config.content.length === 0 || config.content.substr(config.content.length - 1) === '\n' ? '' : '\n';
          results.push(config.content = config.content + linebreak + opts.replace);
        }
      } else {
        continue; // Did not match, try callback
      }
    } else if (opts.place_before === true) {
      results.push(log({
        message: "Before is true, need to explain how we could get here",
        level: 'INFO'
      }));
    } else if (opts.from || opts.to) {
      if (opts.from && opts.to) {
        from = RegExp(`(^${utils.regexp.quote(opts.from)}$)`, "m").exec(config.content);
        to = RegExp(`(^${utils.regexp.quote(opts.to)}$)`, "m").exec(config.content);
        if ((from != null) && (to == null)) {
          results.push(log({
            message: "Found 'from' but missing 'to', skip writing",
            level: 'WARN'
          }));
        } else if ((from == null) && (to != null)) {
          results.push(log({
            message: "Missing 'from' but found 'to', skip writing",
            level: 'WARN'
          }));
        } else if ((from == null) && (to == null)) {
          if (opts.append) {
            results.push(config.content += '\n' + opts.from + '\n' + opts.replace + '\n' + opts.to);
          } else {
            results.push(log({
              message: "Missing 'from' and 'to' without append, skip writing",
              level: 'WARN'
            }));
          }
        } else {
          results.push(config.content = config.content.substr(0, from.index + from[1].length + 1) + opts.replace + '\n' + config.content.substr(to.index));
        }
      } else if (opts.from && !opts.to) {
        from = RegExp(`(^${utils.regexp.quote(opts.from)}$)`, "m").exec(config.content);
        if (from != null) {
          results.push(config.content = config.content.substr(0, from.index + from[1].length) + '\n' + opts.replace); // TODO: honors append
        } else {
          results.push(log({
            message: "Missing 'from', skip writing",
            level: 'WARN'
          }));
        }
      } else if (!opts.from && opts.to) {
        from_index = 0;
        to = RegExp(`(^${utils.regexp.quote(opts.to)}$)`, "m").exec(config.content);
        if (to != null) {
          results.push(config.content = opts.replace + '\n' + config.content.substr(to.index)); // TODO: honors append
        } else {
          results.push(log({
            message: "Missing 'to', skip writing",
            level: 'WARN'
          }));
        }
      } else {
        results.push(void 0);
      }
    } else {
      results.push(void 0);
    }
  }
  return results;
};

// ## Dependencies
utils = require('@nikitajs/core/lib/utils');
