const Mutation = require('../mutation')

function LiteralMutator() {}

LiteralMutator.prototype.name = 'literal'

LiteralMutator.prototype.getMutations = function(file, source, visit) {
  const mutations = []

  visit({
    BooleanLiteral: (node) => {
      if (node.value) {
        mutations.push(new Mutation(file, node.range[0], node.range[1] + 1, 'false'))
      } else {
        mutations.push(new Mutation(file, node.range[0], node.range[1] + 1, 'true'))
      }
    },
    NumberLiteral: (node) => {
      if (node.subdenomination) {
        return // TODO(federicobond) add support for numbers with subdenomination
      }

      if (node.value === '1') {
        mutations.push(new Mutation(file, node.range[0], node.range[1] + 1, '0'))
      } else if (node.value === '0') {
        mutations.push(new Mutation(file, node.range[0], node.range[1] + 1, '1'))
      } else {
        let num = parseInt(node.number)
        num = isNaN(num) ? '1' : (num - 1).toString()
        mutations.push(new Mutation(file, node.range[0], node.range[1] + 1, num))
      }
    }
  })

  return mutations
}

module.exports = LiteralMutator
