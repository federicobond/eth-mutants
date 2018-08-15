#!/usr/bin/env node

const yargs = require('yargs')
const commands = require('./src/commands')

yargs
	.usage('$0 <cmd> [args]')
	.command('test', 'run mutation tests', (yargs) => {
		yargs.option('contracts-dir', {
			type: 'string',
			default: 'contracts',
			describe: 'the directory containing contract files'
		})
	}, commands.test)
	.help()
	.argv
