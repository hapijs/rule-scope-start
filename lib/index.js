'use strict';

module.exports = function(context) {
  function check(node) {

    var body = node.body.body;

    // Allow empty function bodies to be of any size
    if (body.length === 0) {
      return;
    }

    var bodyStartLine = body[0].loc.start.line;
    var openBraceLine = context.getTokenBefore(body[0]).loc.start.line;

    if (bodyStartLine - openBraceLine < 2) {
      context.report(node, 'Missing blank line at beginning of function.');
    }
  }

  return {
    FunctionExpression: check,
    FunctionDeclaration: check
  };
};

module.exports.esLintRuleName = 'hapi-scope-start';
