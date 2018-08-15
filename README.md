eth-mutants
===========

eth-mutants is a mutation testing tool for Solidity contracts.

## What is mutation testing?

It about performing changes to your code (like replacing a `<` for a `<=`) and
running your tests. If they pass we say that the mutation lived/survived, which
means that you werent checking the condition and you should ensure there is a
test case covering it.

It's a great companion to existing test coverage tools, ensuring that you are
not only running every line, but actually asserting logic about the control
flow around them.

For more information, check out the Wikipedia page on 
[mutation testing](https://en.wikipedia.org/wiki/Mutation_testing).

## Installation

```
npm install eth-mutants
```

## Usage

```
The `preflight` command will show the number of possible mutations found
and print some compact diffs for each mutation. Use this to understand
how long it may take to visit all mutations and please report any invalid 
ones.
```

The `test` command will start applying mutations and running your tests to
check if they pass. It will report the result of each mutation.

```
eth-mutants test
```

This tools makes some important assumptions about your workspace, which should
hold true for most Truffle-based projects, but I plan on adding options to
override them soon:

 * Your contract files are in the `contracts/` directory
 * You run your tests with `npm test` which returns a non-zero error code in
   case of failure.

## Mutators

The only mutation implemented at the moment is called `boundary-condition`
and replaces `<` and `>` for `<=` and `>=` and vice-versa. Contributions for
mutators are especially welcomed.

## Prior Art

 * [PIT](http://pitest.org/) is a mutation testing tool for Java with a long
   track record.
 * [mutmut](https://mutmut.readthedocs.io/en/latest/) is a mutation testing
   tool for Python.

## Author

Federico Bond

## License

MIT
