
shell = require 'shell'

shell
  name: 'lxdvmhost'
  description: "LXD VM host based on Virtual Box"
  commands:
    'start':
      description: 'Start the cluster'
      options:
        debug:
          type: 'boolean'
          shortcut: 'b'
          description: 'Print debug output'
        log:
          type: 'string'
          description: 'Path to the directory storing logs.'
      handler: require './start'
    'stop':
      description: 'Stop the cluster'
      options:
        debug:
          type: 'boolean'
          shortcut: 'b'
          description: 'Print debug output'
        log:
          type: 'string'
          description: 'Path to the directory storing logs.'
      handler: require './stop'
.route()
