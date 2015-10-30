'use strict';

module.exports = function (context) {
  var allowOneLiners = context.options[0] === 'allow-one-liners';
  var maxInOneLiner = context.options[1] !== undefined ? context.options[1] : 1;

  function checkFunction (node) {
    check(node, allowOneLiners, maxInOneLiner);
  }

  function checkArrow (node) {
    check(node, true, maxInOneLiner);
  }

  function check (node, allowOneLiners, maxInOneLiner) {
    var fnBody = node.body;

    // Arrow functions can return literals that span multiple lines
    if (fnBody.type === 'ObjectExpression' || fnBody.type === 'ArrayExpression') {
      return;
    }

    var body = (fnBody.type === 'BlockStatement') ? fnBody.body : [fnBody];

    // Allow empty function bodies to be of any size
    if (body.length === 0) {
      return;
    }

    var bodyStartLine = body[0].loc.start.line;
    var openBraceLine = context.getTokenBefore(body[0]).loc.start.line;
    var closeBraceLine = context.getTokenAfter(body[0]).loc.start.line;

    if (allowOneLiners === true &&
        body.length <= maxInOneLiner &&
        openBraceLine === closeBraceLine) {
      return;
    }

    if (bodyStartLine - openBraceLine < 2) {
      context.report(node, 'Missing blank line at beginning of function.');
    }
  }

  return {
    ArrowFunctionExpression: checkArrow,
    FunctionExpression: checkFunction,
    FunctionDeclaration: checkFunction
  };
};

module.exports.esLintRuleName = 'hapi-scope-start';
