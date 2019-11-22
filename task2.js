"use strict";

const testlib = require( './testlib.js' );
var dataList = [];  //Used to store the data in .data file
var patternList = [];  //Used to store the pattern in .seq file
var countList = {};  //Used to store the count data with object list: {pattern: count,...}

/* "ready" handler is called to prepare the patterns and count_list */
testlib.on( 'ready', function( patterns ) {
	console.log( "Patterns:", patterns );
	patternList = patterns.slice();
	patternList.map( function ( item ) {
		countList[item] = 0;  //Initialize the count_list with pattern labels
	} );
	testlib.runTests();
} );

/* "data" handler is called to load the data from .data. And compare each data segment of specific pattern_length with patterns */
testlib.on( 'data', function( data ) {
	dataList.push(data);
	patternList.map( function ( item ) {
		if(dataList.slice(-item.length).join('') === item) {  //Slice the segemtn with specific pattern length
			countList[item]++;  //Count increase while pattern match
			testlib.foundMatch(item, dataList.length - item.length + 1);
		}
	} );
} );

/* "end" handler is called to display the countList and frequencyTable at the end of the program */
testlib.on( 'end', function() {
	console.log(countList);
	testlib.frequencyTable(countList);
})

testlib.setup( 2 ); // Runs test 2 (task2.data and task2.seq)
