var pathToRegexp = require('../index');

// console.time('Simpler test');
// var to = 100000;
// while (to--) {
// 	pathToRegexp('/users/:userId?/:action').query('/users/14/update');
// }
// console.timeEnd('Simpler test');
// return;

var testRunner = require('../test/testRunner'),
	Benchmark = require('benchmark'),

	benchSuite1 = new Benchmark.Suite,
	benchSuite2 = new Benchmark.Suite,

	contender1 = pathToRegexp,
	contender2 = pathToRegexp;

if (true) {
	console.log('Benchmarking the creation of regexp objects')
	benchSuite1
		.add('contender1', function() {
			testRunner(function (tests) {
				tests.forEach(function (test) {
					contender1(test.path);
				});
			});
		})
		.add('contender2', function() {
			testRunner(function (tests) {
				tests.forEach(function (test) {
					contender2(test.path);
				});
			});
		})
		.on('cycle', function(event) {
			console.log(String(event.target));
		})
		.on('complete', function() {
			console.log('Fastest is ' + this.filter('fastest').pluck('name'));
		})
		.run();
}

// Benchmarking the creation of regexp objects and matching them
// contender1 x 257 ops/sec ±0.24% (90 runs sampled)
// contender2 x 258 ops/sec ±0.40% (90 runs sampled)
// Fastest is contender1
return;
console.log('\nBenchmarking the creation of regexp objects and matching them')
benchSuite2
	.add('contender1', function() {
		testRunner(function (tests) {
			tests.forEach(function (test) {
				contender1(test.path).query(test.query);
			});
		});
	})
	.add('contender2', function() {
		testRunner(function (tests) {
			tests.forEach(function (test) {
				contender2(test.path).query(test.query);
			});
		});
	})
	.on('cycle', function(event) {
		console.log(String(event.target));
	})
	.on('complete', function() {
		console.log('Fastest is ' + this.filter('fastest').pluck('name'));
	})
	.run();