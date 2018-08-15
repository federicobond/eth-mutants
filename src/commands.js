const childProcess = require('child_process')
const copy = require('recursive-copy')
const fs = require('fs')
const glob = require('glob')
const mkdirp = require('mkdirp')
const parser = require('solidity-parser-antlr')
const mutators = require('./mutators')
const config = require('./config')
const Reporter = require('./reporter')

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
  const proc = childProcess.spawnSync('npm', ['test'])
  return proc.status === 0
}

function test(argv) {
  const reporter = new Reporter()

  prepare(() =>
    glob(contractsDir + contractsGlob, (err, files) => {
      if (err) {
        console.error(err)
        process.exit(1)
      }

      const mutations = generateAllMutations(files)

      for (const mutation of mutations) {
        mutation.apply()

        reporter.beginMutant(mutation)

        const result = runTests(mutation)

        if (result) {
          reporter.mutantSurvived(mutation)
          if (argv.failfast) process.exit(1)
        } else {
          reporter.mutantKilled(mutation)
        }

        mutation.restore()
      }

      reporter.summary()
    })
  )
}

function preflight(argv) {
  prepare(() =>
    glob(contractsDir + contractsGlob, (err, files) => {
      const mutations = generateAllMutations(files)

      console.log(mutations.length + ' possible mutations found.')
      console.log('---')

      for (const mutation of mutations) {
        console.log(mutation.file + ':' + mutation.hash() + ':')
        process.stdout.write(mutation.diff())
      }
    })
  )
}

module.exports = { test: test, preflight, preflight }
