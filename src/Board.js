// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },


    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      //console.log(this.get(rowIndex)); // 2 -- third rows
      // this.rows() //   returns the whole matrix


      //get the row stored at the rowIndex
      let currentRow = this.get(rowIndex); //
      //initialize a counter to count the number of 'queens' in the row
      let counter = 0;
      //iterate through the row
      for (let i = 0; i < currentRow.length; i++) {
        //for every queen, increment counter
        counter += currentRow[i];
      }
      //if counter is greater than 1 at the end, return true
      if (counter > 1) {
        return true; // fixme
      }
        //otherwise return false
      return false;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
    //  get the whole board
    let currentBoard = this.rows();
      // iterate over the board
      for(let i = 0; i < this.rows().length; i++) {
        //check if each element hasRowConflict

        if(this.hasRowConflictAt(i)) {
          // if it does return true
          return true;
        }
      }
      // other wise return false;
      return false;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      //get all the rows in the matrix and store them
      let chessBoard = this.rows();
      //create an array variable to store your column
      let col = [];
      //iterate through each of the individual rows within the entire entire matrix (not every value though)
      for (let i = 0; i < chessBoard.length; i++) {
        //for each row, push the value stored at colIndex into the column variable
        col.push(chessBoard[i][colIndex]);
      }
      //then check to see if there are any conflicts using the same algorithm as hasRowConflictAt
      let counter = 0;
      //iterate through the row
      for (let i = 0; i < col.length; i++) {
        //for every queen, increment counter
        counter += col[i];
      }
      //if counter is greater than 1 at the end, return true
      if (counter > 1) {
        return true;
      }
      return false;

    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {

      for (var k = 0; k < this.rows()[0].length; k++) {
        if(this.hasColConflictAt(k)) {
          return true;
        }
      }
      return false;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      // create two empty arrays / create two counters for the diagonal starting at first row and given column index and the inverse
      const diagonal = [];
      const inverseDiagonal = [];
      let diagonalCounter = 0;
      let diagonalInverseCounter = 0;

      //if the majorDiagonalColumnIndexAtFirstRow is the same as the index of the first row (0)
      if (majorDiagonalColumnIndexAtFirstRow === 0) {
        //iterate through the major diagonal starting at column index 0 and row index 0 until the end of the row's length
        for (let i = 0; i < this.rows()[0].length; i++) {
          //push the diagonal values into the diagonal array
          diagonal.push(this.rows()[i][i]);
        }
        //edge case: if columnindex is equal to the last index of the first row, then always return false
      } else if( majorDiagonalColumnIndexAtFirstRow === this.rows()[0].length - 1) {
          return false;
      } else {
      //starting at the first row and given column index, iterate through the major diagonal until the end of the rows
      for (let i = 0; i + majorDiagonalColumnIndexAtFirstRow < this.rows()[0].length; i++) {
        // push/store that current value in our array - diagonalArray - inverseAray
        diagonal.push(this.rows()[i][i + majorDiagonalColumnIndexAtFirstRow]);
        inverseDiagonal.push(this.rows()[i + majorDiagonalColumnIndexAtFirstRow][i]);
      }
      //for every queen, increment counter
    }
    // iterate over diagonal/inverse array,
    for (let k = 0; k < diagonal.length; k++) {
      // do if statements for both
      diagonalCounter += diagonal[k];
      if(inverseDiagonal.length) {
      diagonalInverseCounter += inverseDiagonal[k];
      }
    }

      return diagonalCounter > 1 || diagonalInverseCounter > 1
      //if either counter is greater than 1 at the end, return true
      // otherwise , return false
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {

      for (var k = 0; k < this.rows()[0].length; k++) {
        if(this.hasMajorDiagonalConflictAt(k)) {
          return true;
        }
      }
      return false;
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      const diagonal = [];
      const inverseDiagonal = [];
      let diagonalCounter = 0;
      let diagonalInverseCounter = 0;

      //if the minorDiagonalColumnIndexAtFirstRow is the same as the index of the last column
      if (minorDiagonalColumnIndexAtFirstRow === this.rows()[0].length - 1) {
        //iterate through the minor diagonal starting at column last index  and row index 0 until the end of the row's length
        for (let i = this.rows()[0].length - 1; i > -1; i--) {
          //push the diagonal values into the diagonal array
          diagonal.push(this.rows()[minorDiagonalColumnIndexAtFirstRow - i][i]);
        }
        //edge case: if columnindex is equal to the last index of the first row, then always return false
      } else if( minorDiagonalColumnIndexAtFirstRow === 0) {
          return false;
      } else {
      //starting at the first row and given column index, iterate through the major diagonal until the end of the rows
      const difference = this.rows()[0].length - 1 - minorDiagonalColumnIndexAtFirstRow;
      for (let i = minorDiagonalColumnIndexAtFirstRow; i > -1; i--) {
        // push/store that current value in our array - diagonalArray - inverseAray
        diagonal.push(this.rows()[minorDiagonalColumnIndexAtFirstRow - i][i]);
        inverseDiagonal.push(this.rows()[minorDiagonalColumnIndexAtFirstRow - i + difference][i + difference]);
      }
      //for every queen, increment counter
    }
    // iterate over diagonal/inverse array,
    for (let k = 0; k < diagonal.length; k++) {
      // do if statements for both
      diagonalCounter += diagonal[k];
      if (inverseDiagonal.length) {
        diagonalInverseCounter += inverseDiagonal[k];
      }
    }

      return diagonalCounter > 1 || diagonalInverseCounter > 1
      //if either counter is greater than 1 at the end, return true
      // otherwise , return false
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      for (var k = 0; k < this.rows()[0].length; k++) {
        if(this.hasMinorDiagonalConflictAt(k)) {
          return true;
        }
      }
      return false;

    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
