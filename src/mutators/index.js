const ConditionalBoundaryMutator = require('./conditional-boundary')
const LiteralMutator = require('./literal')

function CompositeMutator(mutators) {
  this.mutators = mutators
}

CompositeMutator.prototype.getMutations = function(file, source, visit) {
  let mutations = []
  for (const mutator of this.mutators) {
    mutations = mutations.concat(mutator.getMutations(file, source, visit))
  }
  return mutations
}

module.exports = {
  ConditionalBoundaryMutator: ConditionalBoundaryMutator,
  LiteralMutator: LiteralMutator,
  CompositeMutator: CompositeMutator
}
