var pathToRegexp = require('../../index'),
	testRunner = require('../testRunner.js'),
	tape = require('tape');

testRunner(function (tests, testsDescr) {
	tape(testsDescr, function (assert) {
		tests.forEach(function (test) {
			assert.deepEqual(pathToRegexp(test.path).query(test.query), test.result, test.descr);
		});

		assert.end();
	});
});