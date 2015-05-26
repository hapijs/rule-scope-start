'use strict';

var Code = require('code');
var ESLint = require('eslint');
var Lab = require('lab');
var HapiScopeStart = require('../lib');

var lab = exports.lab = Lab.script();
var expect = Code.expect;
var describe = lab.describe;
var it = lab.it;
var linter = ESLint.linter;
var linterConfig = {rules: {}};

Code.settings.truncateMessages = false;
linter.defineRule(HapiScopeStart.esLintRuleName, HapiScopeStart);

describe('ESLint Rule', function() {
  it('reports warning when function body does not begin with a blank line', function(done) {
    var fns = [
      function fn() {
        return;
      },
      function fn(foo, bar, baz) {
        var fizz = 1;
      },
      function fn(foo)

      {
          return 'foo';
      },
      function fn() {/*test*/
        return;
      },
      function fn() { return; },
      function fn(foo, bar, baz) { return; }
    ];

    linterConfig.rules[HapiScopeStart.esLintRuleName] = 1;

    for (var i = 0; i < fns.length; ++i) {
      var fn = fns[i].toString();
      var result = linter.verify(fn, linterConfig);

      expect(result).to.be.an.array();
      expect(result.length).to.equal(1);
      expect(result[0].ruleId).to.equal(HapiScopeStart.esLintRuleName);
      expect(result[0].message).to.equal('Missing blank line at beginning of function.');
      expect(result[0].nodeType).to.equal('FunctionDeclaration');
    }

    done();
  });

  it('does not report anything when function body begins with a blank line', function(done) {
    var fns = [
      function fn() {

        return;
      },
      function fn(foo, bar, baz) {

        var fizz = 1;
      },
      function fn(foo)
      {

          return 'foo';
      },
      function fn() {/*test*/

        return;
      }
    ];

    linterConfig.rules[HapiScopeStart.esLintRuleName] = 1;

    for (var i = 0; i < fns.length; ++i) {
      var fn = fns[i].toString();
      var result = linter.verify(fn, linterConfig);

      expect(result).to.be.an.array();
      expect(result.length).to.equal(0);
    }

    done();
  });

  it('does not report anything when function is one line and allow-one-liners is set', function(done) {
    var fns = [
      function fn() { return; },
      function fn(foo, bar, baz) { return; }
    ];

    linterConfig.rules[HapiScopeStart.esLintRuleName] = [1, 'allow-one-liners'];

    for (var i = 0; i < fns.length; ++i) {
      var fn = fns[i].toString();
      var result = linter.verify(fn, linterConfig);

      expect(result).to.be.an.array();
      expect(result.length).to.equal(0);
    }

    done();
  });

  it('reports an error when function is allow-one-liners is set but function body contains too many statements', function(done) {
    var fns = [
      function fn() { var i = 0; i++; return; },
    ];

    linterConfig.rules[HapiScopeStart.esLintRuleName] = [1, 'allow-one-liners', 2];

    for (var i = 0; i < fns.length; ++i) {
      var fn = fns[i].toString();
      var result = linter.verify(fn, linterConfig);

      expect(result).to.be.an.array();
      expect(result.length).to.equal(1);
      expect(result[0].ruleId).to.equal(HapiScopeStart.esLintRuleName);
      expect(result[0].message).to.equal('Missing blank line at beginning of function.');
      expect(result[0].nodeType).to.equal('FunctionDeclaration');
    }

    done();
  });

  it('allow-one-liners defaults to 1', function(done) {
    var fns = [
      function fn() { console.log('broken'); return; },
    ];

    linterConfig.rules[HapiScopeStart.esLintRuleName] = [1, 'allow-one-liners'];

    for (var i = 0; i < fns.length; ++i) {
      var fn = fns[i].toString();
      var result = linter.verify(fn, linterConfig);

      expect(result).to.be.an.array();
      expect(result.length).to.equal(1);
      expect(result[0].ruleId).to.equal(HapiScopeStart.esLintRuleName);
      expect(result[0].message).to.equal('Missing blank line at beginning of function.');
      expect(result[0].nodeType).to.equal('FunctionDeclaration');
    }

    done();
  });

  it('does not report anything when function body is empty', function(done) {
    var fns = [
      function fn() {},
      function fn(foo, bar, baz) {},
      function fn(foo){

      },
      function fn() {/*test*/}
    ];

    linterConfig.rules[HapiScopeStart.esLintRuleName] = 1;

    for (var i = 0; i < fns.length; ++i) {
      var fn = fns[i].toString();
      var result = linter.verify(fn, linterConfig);

      expect(result).to.be.an.array();
      expect(result.length).to.equal(0);
    }

    done();
  });

  it('handles function expressions', function(done) {
    var fnExpr = 'var foo = ' + function() {

      return;
    }.toString();

    linterConfig.rules[HapiScopeStart.esLintRuleName] = 1;

    var result = linter.verify(fnExpr, linterConfig);

    expect(result).to.be.an.array();
    expect(result.length).to.equal(0);
    done();
  });
});
