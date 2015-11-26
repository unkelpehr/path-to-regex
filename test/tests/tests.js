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

tape('Miscellaneous', function (assert) {
	var regex;

	regex = assert.ok(typeof pathToRegexp('/users/:userId?').query === 'function', 'regex.query is a function');

	regex = assert.equal(pathToRegexp('/users/:userId').length, 1, '`length` equals 1');
	regex = assert.equal(pathToRegexp('/users/:userId/:userId?').length, 2, '`length` equals 2');
	regex = assert.equal(pathToRegexp('/users/:userId/:userId?/*').length, 3, '`length` equals 3');
	regex = assert.equal(pathToRegexp('/users/').length, 0, '`length` equals 0');
	regex = assert.equal(pathToRegexp('*').length, 1, '`length` equals 1');

	assert.end();
});