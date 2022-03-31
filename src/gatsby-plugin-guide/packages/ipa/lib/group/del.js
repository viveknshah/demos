// Generated by CoffeeScript 2.6.1
// # `nikita.ipa.group.del`

// Delete a group from FreeIPA.

// ## Example

// ```js
// const {$status} = await nikita.ipa.group.del({
//   cn: 'somegroup',
//   connection: {
//     url: "https://ipa.domain.com/ipa/session/json",
//     principal: "admin@DOMAIN.COM",
//     password: "mysecret"
//   }
// })
// console.info(`Group was deleted: ${$status}`)
// ```

// ## Schema definitions
var definitions, handler;

definitions = {
  config: {
    type: 'object',
    properties: {
      'cn': {
        type: 'string',
        description: `Name of the group to delete.`
      },
      'connection': {
        type: 'object',
        $ref: 'module://@nikitajs/network/lib/http#/definitions/config',
        required: ['principal', 'password']
      }
    },
    required: ['cn', 'connection']
  }
};

// ## Handler
handler = async function({config}) {
  var $status, base;
  if ((base = config.connection.http_headers)['Referer'] == null) {
    base['Referer'] = config.connection.referer || config.connection.url;
  }
  ({$status} = (await this.ipa.group.exists({
    $shy: false,
    connection: config.connection,
    cn: config.cn
  })));
  if (!$status) {
    return;
  }
  return (await this.network.http(config.connection, {
    negotiate: true,
    method: 'POST',
    data: {
      method: "group_del/1",
      params: [[config.cn], {}],
      id: 0
    }
  }));
};

// ## Exports
module.exports = {
  handler: handler,
  metadata: {
    definitions: definitions
  }
};
