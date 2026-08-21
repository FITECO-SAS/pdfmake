'use strict';

var assert = require('assert');
var sizes = require('../../js/standardPageSizes').default;

var integrationTestHelper = require('./integrationTestHelper');

describe('Integration test: isFooter', function () {

	var testHelper = new integrationTestHelper();

	var usableBottom = function (sizeName) {
		return sizes[sizeName][1] - testHelper.MARGINS.bottom;
	};

	var topOfItem = function (node) {
		var item = node.item;
		if (item.y !== undefined) {
			return item.y;
		}
		return Math.min(item.y1, item.y2);
	};

	var bottomOfItems = function (items) {
		return Math.max.apply(null, items.map(function (node) {
			var item = node.item;
			if (item.y !== undefined) {
				return item.y + (item.h || 0);
			}
			return Math.max(item.y1, item.y2);
		}));
	};

	var footerTableDocDefinition = function (isFooter) {
		var footerTable = {
			id: 'footer-page',
			table: {
				widths: ['100%'],
				dontBreakRows: true,
				body: [
					[{ text: 'Bank: FR76 3000 4000 5000 6000 7000 189' }],
					[{ text: 'VAT: FR 12 345 678 901' }]
				]
			}
		};

		if (isFooter) {
			footerTable.isFooter = true;
		}

		return {
			content: [
				{ text: 'Invoice lines' },
				footerTable
			]
		};
	};

	it('sticks a text node to the bottom of the usable area', function () {
		var pages = testHelper.renderPages('A4', {
			content: [
				{ text: 'Invoice lines' },
				{ text: 'Bank / VAT / legal clause / company info', isFooter: true }
			]
		});

		assert.equal(pages.length, 1);
		// only the two lines, nothing left over from the height measurement
		assert.equal(pages[0].items.length, 2);
		assert.equal(pages[0].items[0].item.y, testHelper.MARGINS.top);
		assert.equal(pages[0].items[1].item.y, usableBottom('A4') - testHelper.LINE_HEIGHT);
	});

	it('keeps the node below the previous content without isFooter', function () {
		var pages = testHelper.renderPages('A4', {
			content: [
				{ text: 'Invoice lines' },
				{ text: 'Bank / VAT / legal clause / company info' }
			]
		});

		assert.equal(pages.length, 1);
		assert.equal(pages[0].items.length, 2);
		assert.equal(pages[0].items[1].item.y, testHelper.MARGINS.top + testHelper.LINE_HEIGHT);
	});

	it('sticks the node to the bottom of the next page when it does not fit', function () {
		var usableHeight = sizes.A7[1] - testHelper.MARGINS.top - testHelper.MARGINS.bottom;
		var linesCount = Math.floor(usableHeight / testHelper.LINE_HEIGHT);
		var content = [];
		for (var i = 0; i < linesCount; i++) {
			content.push({ text: 'Line ' + i });
		}
		content.push({ text: 'Bank / VAT', isFooter: true });

		var pages = testHelper.renderPages('A7', { content: content });

		assert.equal(pages.length, 2);
		assert.equal(pages[0].items.length, linesCount);
		assert.equal(pages[1].items.length, 1);
		assert.equal(pages[1].items[0].item.y, usableBottom('A7') - testHelper.LINE_HEIGHT);
	});

	it('sticks a table to the bottom without changing its own layout', function () {
		var withoutFooter = testHelper.renderPages('A4', footerTableDocDefinition(false));
		var withFooter = testHelper.renderPages('A4', footerTableDocDefinition(true));

		assert.equal(withFooter.length, 1);
		assert.equal(withFooter[0].items.length, withoutFooter[0].items.length);

		// the text before the table is not moved
		assert.equal(withFooter[0].items[0].item.y, withoutFooter[0].items[0].item.y);

		// the table is moved down as a whole (same internal layout)
		var tableItems = function (pages) {
			return pages[0].items.slice(1);
		};
		var shifts = tableItems(withFooter).map(function (item, index) {
			return (topOfItem(item) - topOfItem(tableItems(withoutFooter)[index])).toFixed(4);
		});

		assert.ok(Number(shifts[0]) > 0);
		assert.deepEqual(shifts, shifts.map(function () {
			return shifts[0];
		}));

		assert.equal(bottomOfItems(withFooter[0].items).toFixed(4), usableBottom('A4').toFixed(4));
	});

	it('sticks the node to the bottom of the last page with pageBreakBefore', function () {
		var usableHeight = sizes.A7[1] - testHelper.MARGINS.top - testHelper.MARGINS.bottom;
		var linesCount = Math.floor(usableHeight / testHelper.LINE_HEIGHT) - 1;
		var content = [];
		for (var i = 0; i < linesCount; i++) {
			content.push({ text: 'Line ' + i });
		}
		content.push({
			isFooter: true,
			id: 'footer-page',
			table: {
				widths: ['100%'],
				dontBreakRows: true,
				body: [
					[{ text: 'Bank / VAT' }],
					[{ text: 'legal clause' }]
				]
			}
		});

		var pages = testHelper.renderPages('A7', {
			content: content,
			pageBreakBefore: function (currentNode) {
				return currentNode.id === 'footer-page' && currentNode.pageNumbers.length === 2;
			}
		});

		assert.equal(pages.length, 2);
		assert.equal(pages[0].items.length, linesCount);
		assert.equal(bottomOfItems(pages[1].items).toFixed(4), usableBottom('A7').toFixed(4));
	});

});
