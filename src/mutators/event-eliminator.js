const Mutation = require('../mutation')

function EventEliminatorMutator() {}

EventEliminatorMutator.prototype.name = 'event-remover'

EventEliminatorMutator.prototype.getMutations = function(file, source, visit) {
  const mutations = []

  visit({
    EmitStatement: (node) => {
      const start = node.range[0]
      const end = node.range[1]

      const text = source.slice(start, end + 1)
      const replacement = '/* commented out ' + text + ' */'

      mutations.push(new Mutation(file, start, end + 1, replacement))
    }
  })

  return mutations
}

module.exports = EventEliminatorMutator
