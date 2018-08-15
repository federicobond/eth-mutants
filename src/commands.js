const childProcess = require('child_process')
const copy = require('recursive-copy')
const fs = require('fs')
const glob = require('glob')
const mkdirp = require('mkdirp')
const parser = require('solidity-parser-antlr')
const mutators = require('./mutators')
const config = require('./config')

const baselineDir = config.baselineDir
const contractsDir = config.contractsDir
const contractsGlob = config.contractsGlob

function prepare(callback) {
  mkdirp(baselineDir, () =>
    copy(contractsDir, baselineDir, { dot: true }, callback)
  )
}

function generateAllMutations(files) {
  let mutations = []

  const mutator = new mutators.CompositeMutator([
    new mutators.ConditionalBoundaryMutator(),
    new mutators.LiteralMutator()
  ])

  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8')
    const ast = parser.parse(source, { range: true })
    const visit = parser.visit.bind(parser, ast)

    mutations = mutations.concat(mutator.getMutations(file, source, visit))
  }

  return mutations
}

function runTests(mutation) {
  console.log('Running tests for mutation ' + mutation.hash())

  const proc = childProcess.spawnSync('npm', ['test'])
  return proc.status === 0
}

function test(argv) {
  prepare(() =>
    glob(contractsDir + contractsGlob, (err, files) => {
      if (err) {
        console.error(err)
        process.exit(1)
      }

      const mutations = generateAllMutations(files)

      for (const mutation of mutations) {
        mutation.apply()
        console.log(mutation.diff())

        const hash = mutation.hash()
        const result = runTests(mutation)

        if (result) {
          console.log(' 👾 Mutant ' + hash + ' survived testing.')
        } else {
          console.log(' 💪 Mutant ' + hash + ' was killed by tests.')
        }

        mutation.restore()
      }
    })
  )
}

module.exports = { test: test }
