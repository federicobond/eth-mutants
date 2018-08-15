const childProcess = require('child_process')
const fs = require('fs')
const sha1 = require('sha1')
const config = require('./config')

const baselineDir = config.baselineDir
const contractsDir = config.contractsDir

function splice(str, start, length, replacement) {
  return str.substring(0, start) + replacement + str.substring(start + length)
}

function Mutation(file, start, end, replace) {
  this.file = file
  this.start = start
  this.end = end
  this.replace = replace
}

Mutation.prototype.hash = function() {
  const input = [this.file, this.start, this.end, this.replace].join(':')
  return sha1(input).slice(0, 8)
}

Mutation.prototype.apply = function() {
  const hash = this.hash()

  console.log('Applying mutation ' + hash + ' to ' + this.file)

  const original = fs.readFileSync(this.file, 'utf8')
  const mutated = splice(
    original,
    this.start,
    this.end - this.start,
    this.replace
  )

  fs.writeFileSync(this.file, mutated, 'utf8')
}

Mutation.prototype.restore = function() {
  const baseline = this.baseline()

  console.log('Restoring ' + this.file)

  const original = fs.readFileSync(baseline, 'utf8')
  fs.writeFileSync(this.file, original, 'utf8')
}

Mutation.prototype.baseline = function() {
  return baselineDir + this.file.substr(contractsDir.length)
}

Mutation.prototype.diff = function() {
  const args = [this.baseline(), this.file]
  const out = childProcess.spawnSync('diff', args).stdout

  // remove first line
  return (
    out
      .toString('utf8')
      .split('\n')
      .slice(1)
      .join('\n')
  )
}

module.exports = Mutation
