var mongoose = require('mongoose')

var utils = module.exports = {
  validateArgument: function (arg, constraint) {
    constraint.required = (constraint.required === undefined ? true : !!constraint.required)

    if (!arg && constraint.required) {
      throw new Error('missing required argument')
    }

    if (constraint.type) {
      var type = (constraint.type.name || constraint.type).toLowerCase()

      if (arg instanceof mongoose.Model) {
        type = constraint.type.modelName

        if (!(constraint instanceof mongoose.Model)) {
          throw new Error('mongoose argument ' + constraint.name + ' invalid type ' + arg + ' !== ' + type)
        }

        if (arg.constructor.modelName !== type) {
          throw new Error('mongoose argument ' + constraint.name + ' invalid type ' + arg + ' !== ' + type)
        }
      } else if (typeof arg !== type) {
        throw new Error('argument ' + constraint.name + ' invalid type ' + typeof arg + ' !== ' + type)
      }
    }

    if (constraint.fields) {
      for (var key in constraint.fields) {
        utils.validateArgument(arg[key], {
          name: key,
          type: constraint.fields[key]
        })
      }
    }
  },

  validateArguments: function (args, constraints) {
    if (constraints.length > args.length) {
      throw new Error('invalid args', args, constraints)
    }

    constraints.forEach(function (constraint, index) {
      utils.validateArgument(args[index], constraint)
    })
  },

  validateArgumentsCB: function (args, constraints) {
    utils.validateArguments(args, constraints)

    utils.validateArgument(args[constraints.length], {
      required: false,
      type: Function
    })
  }
}
