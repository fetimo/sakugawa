/* @flow weak */
/**
 * Sakugawa
 * https://github.com/paazmaya/sakugawa
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (http://paazmaya.fi)
 * Licensed under the MIT license.
 */

'use strict';

const fs = require('fs');
const tape = require('tape');
const sakugawa = require('../lib/index');

// This CSS file has 5 selectors
const twenty = fs.readFileSync('tests/fixtures/twenty.css', 'utf8');

// Helper to save files when creating a new test in order to easily inspect the result
/*
var saveResults = function (results, prefix) {
	for (var i = 0; i < results.length; ++i) {
		var stuff = results[i];
		fs.writeFileSync(__dirname + '/expected/' + prefix + '_' + (i + 1) + '.css', stuff, 'utf8');
	}
};
*/

tape('dummy test', function (test) {
  test.plan(2);

  test.equal(typeof sakugawa, 'function');

  const styles = 'body {\n  color: rebeccapurple;\n}';
  test.deepEqual(sakugawa(styles), [styles]);
});

tape('max selectors lower than total', function (test) {
  test.plan(2);

  var name = 'max-selectors-lower';
	const options = {
		maxSelectors: 16
	};
	const result = sakugawa(twenty, options);
  test.equal(result.length, 2);

	const expected1 = fs.readFileSync('tests/expected/' + name + '_1.css', 'utf8');
	test.equal(result[0], expected1);
});

tape('max selectors higher than total', function (test) {
  test.plan(1);

  var name = 'max-selectors-higher';
	const options = {
		maxSelectors: 24
	};
	const result = sakugawa(twenty, options);
  test.equal(result.length, 1);
});

tape('max selectors same as total', function (test) {
  test.plan(1);

  var name = 'max-selectors-same';
	const options = {
		maxSelectors: 20
	};
	var result = sakugawa(twenty, options);
  test.equal(result.length, 1);
});

tape('media queries separated', function (test) {
  test.plan(1);

  var name = 'media-queries-separated';
	const options = {
		maxSelectors: 50,
		mediaQueries: 'separate'
	};
	var result = sakugawa(twenty, options);
  test.equal(result.length, 2);
});

tape('media queries ignored', function (test) {
  test.plan(1);

  var name = 'media-queries-ignored';
	const options = {
		maxSelectors: 18,
		mediaQueries: 'ignore'
	};
	var result = sakugawa(twenty, options);
  test.equal(result.length, 1);
});

/*
tape('filename option gets used', function (test) {
  test.plan(1);

	var options = {
		filename: 'very-secret.css'
	};

});
*/

tape('two empty files due to minimum number of sheets being high', function (test) {
  test.plan(1);

  var name = 'min-sheets-higher';
	const options = {
		maxSelectors: 12,
		minSheets: 4
	};
	var result = sakugawa(twenty, options);
  test.equal(result.length, 4);
});

tape('minSheets irrelevant when lower than resulting number', function (test) {
  test.plan(1);

  var name = 'min-sheets-lower';
	const options = {
		maxSelectors: 8,
		minSheets: 2
	};
	var result = sakugawa(twenty, options);
  test.equal(result.length, 3);
});

tape('minSheets irrelevant when same as resulting number', function (test) {
  test.plan(1);

  var name = 'min-sheets-same';
	const options = {
		maxSelectors: 6,
		minSheets: 4
	};
	var result = sakugawa(twenty, options);
  test.equal(result.length, 4);
});

tape('error case when no styles empty', function (test) {
  test.plan(1);

	try {
		const result = sakugawa('');
	}
	catch (error) {
    test.equal(error.message, 'styles must not be empty');
	}
});

tape('error case when styles are not a string', function (test) {
  test.plan(1);

	try {
		const result = sakugawa(42);
	}
	catch (error) {
    test.equal(error.message, 'styles must be a string');
	}
});

tape('@charset is preserved in all resulting sheets', function (test) {
  test.plan(3);
	const charset = fs.readFileSync('tests/fixtures/charset.css', 'utf8');

  var name = 'charset-preserved';
	const options = {
		maxSelectors: 4
	};
	const result = sakugawa(charset, options);
  test.equal(result.length, 2);

  result.forEach(function (res) {
    test.equal(res.indexOf('@charset'), 0);
  });
});
