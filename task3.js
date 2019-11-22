"use strict";

const testlib = require( './testlib.js' );
var dataList = [];  //Used to store the data in .data file
var patternList = [];  //Used to store the pattern in .seq file
var countList = {};  //Used to store the count data with object list: {pattern: count,...}
var patternExpand = {};  //Used to store the possible combination patterns: {originPattern: [possible patterns],...}
const combineList = {
	C:['C'],
	G:['G'],
	A:['A'],
	T:['T'],
	R:['G','A','R'],
	Y:['T','C','Y'],
	K:['G','T','K'],
	M:['A','C','M'],
	S:['G','C','S'],
	W:['A','T','W'],
	B:['G','T','C','B'],
	D:['G','A','T','D'],
	H:['A','C','T','H'],
	V:['G','C','A','V'],
	N:['A','G','C','T','N']
};
const recordChar = ['C','G','A','T','R','Y','K','M','S','W','B','D','H','V','N'];
var combineResult = [];  //Used to store the possible combination patterns for each original pattern
var result = [];  //Used to store the each possible combination pattern, generate by permulation and combination

/* "ready" handler is called to prepare the patterns, count_list and call the resolvePattern function */
testlib.on( 'ready', function( patterns ) {
	console.log( "Patterns:", patterns );
	patternList = patterns.slice();
	patternList.map( function ( item ) {
		countList[item] = 0;  //Initialize the count_list with pattern labels
		patternExpand[item] = 0;  //Initialize the patternExpand with origin pattern labels
		resolvePattern(item);
	} );
	testlib.runTests();
} );

/**
 * This function is used to resolve the original patterns to possible combination patterns.
 * The parameter is the original pattern and it would be divided to characters and permulated.
 */
function resolvePattern(thisPattern) {
	var subPattern = thisPattern.split('');
	var arr = [];  //Used to store the detail of after divided pattern
	subPattern.map( p => arr.push(combineList[p]) );  //Store the "Possible Actual Nucleotides" in arr for each Char
	doCombine(arr, 0);
	patternExpand[thisPattern] = combineResult;  //Store the possible combination with specific label
	combineResult = [];  //Clear the array after this original pattern has been solved
	result = [];
}

/**
 * This function is used to do the combine of permulated characters for Nucleotides, generate all possible combination.
 * It recursively call itself to generate results from end to front.
 */
function doCombine(arr, index) {
	arr[index].map( function ( tuple ) {
		let i = 0;
		result[index] = tuple[i];
		if(index != arr.length - 1)
			doCombine(arr, index + 1);  //Recursive
		else
			combineResult.push(result.join(''));  //Complete combination once
		i++;
	} );
}

/* "data" handler is called to load the data from .data. And compare each data segment of specific pattern_length with patterns */
testlib.on( 'data', function( data ) {
	dataList.push(data);
	patternList.map( function ( originPattern ) {
		patternExpand[originPattern].map( function ( newPattern ) {
			if(dataList.slice(-originPattern.length).join('') === newPattern) {  //Slice the segemtn with specific pattern length
				countList[originPattern]++;  //Count increase while pattern match
				testlib.foundMatch(originPattern, dataList.length - originPattern.length + 1);
			}
		} );
	} );
} );

/* "end" handler is called to display the countList and frequencyTable at the end of the program */
testlib.on( 'end', function() {
	console.log(countList);
	testlib.frequencyTable(countList);
} );

testlib.setup( 3 ); // Runs test N (taskN.data and taskN.seq)
