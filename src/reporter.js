const chalk = require('chalk')

function Reporter() {
  this.survived = []
  this.killed = []
}

Reporter.prototype.beginMutant = function(mutant) {
  console.log(mutant.diff())
}

Reporter.prototype.mutantSurvived = function(mutant) {
  console.log(' 👾 Mutant ' + chalk.green(mutant.hash()) + ' survived testing.')
}

Reporter.prototype.mutantKilled = function(mutant) {
  console.log(
    ' 💪 Mutant ' + chalk.green(mutant.hash()) + ' was killed by tests.'
  )
}

Reporter.prototype.summary = function() {
  console.log(
    this.survived.length +
      ' mutants survived testing, ' +
      this.killed.length +
      ' mutants killed.'
  )
  console.log(
    'Survivors: ' + this.survived.map(m => chalk.green(m.hash())).join(', ')
  )
}

module.exports = Reporter
