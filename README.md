<a href="http://hapijs.com"><img src="https://github.com/hapijs/assets/blob/master/images/family.svg" width="180px" align="right" /></a>

# rule-scope-start

ESLint rule to enforce new line at the beginning of function scope

[![Build Status](https://travis-ci.org/hapijs/rule-scope-start.svg?branch=master)](https://travis-ci.org/hapijs/rule-scope-start)

## Rule Options

### `allow-one-liners`

If the string `'allow-one-liners'` is passed as the first option to this rule,
then functions whose bodies contain zero or one statements are allowed to be
written on a single line. This defaults to `true` for arrow functions, and
`false` otherwise.

### `max-in-one-liner`

The second option to this rule dictates the maximum number of statements allowed
in the bodies of one line function. This must be used in conjunction with
`allow-one-liners`. Defaults to one.
