var mainSheet = "master";
var optionsSheet = "options";
var maxDataColumn = 5;

// Get the sheet object.
var wsMain = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(mainSheet);
var wsOptions = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(optionsSheet);

// Get the last row and column of the data on options sheet.
var optionsLastRow = wsOptions.getLastRow();
var optionsLastCol = wsOptions.getLastColumn();

// Get the values of the options.
var options = wsOptions.getRange(2, 1, optionsLastRow -1, optionsLastCol).getValues();

function onEdit(event) {
  var activeCell = event.range;
  var value = activeCell.getValue();
  var activeRow = activeCell.getRow();
  var activeCol = activeCell.getColumn();
  var wsName = activeCell.getSheet().getName()
  if((wsName == mainSheet ||
      wsName == optionsSheet) 
     && activeRow == 1 && activeCol <= maxDataColumn) {
    var ui = SpreadsheetApp.getUi();
    ui.alert(
      "Beware!",
      "You are changing the first row, it may causes something wrong.",
      ui.ButtonSet.OK
    );
  }
  else if (wsName == mainSheet){
    applyValidation(value, activeRow, activeCol);
  }
}

function applyValidation(value, row, col) {
  if(col == 1) {
    if(value == "") {
      for(var i = col+1; i <= maxDataColumn; i++) {
        wsMain.getRange(row, i).clearContent();
        wsMain.getRange(row, i).clearDataValidations();
      }
    }
    else {
      for (var i = col+1; i <= maxDataColumn; i++) {
        wsMain.getRange(row, i).clearContent();
        wsMain.getRange(row, i).clearDataValidations();
      }
      var filterOptions = options.filter(function(o) {
        return o[col-1] === value
      });
      var listToApply = filterOptions.map(function(o) {
        return o[col]
      });
      var cell = wsMain.getRange(row, col+1);
      applyValidationToCell(listToApply, cell);
    }
  }
  else { //When col >= 2
    if(value == "") {
      for (var i = col+1; i <= maxDataColumn; i++) {
        wsMain.getRange(row, i).clearContent();
        wsMain.getRange(row, i).clearDataValidations();
      }
    }
    else {
      wsMain.getRange(row, col+1).clearContent();
      
      var mark = [];
      mark[1] = ["o[col-1] == value"];
      
      for (var i = 2; i < maxDataColumn; i++) {
        mark[i] = mark[i-1] + ' && o[col-' + i + '] == wsMain.getRange(row, col-'+ (i-1) + ').getValue()';
      }

      var filterOptions = options.filter(function(o) {
        return eval(mark[col]);
        /*
        if (col == 2){
          return eval(mark[col]);
          
          return o[col-1] === value && 
            o[col-2] === wsMain.getRange(row, col-1).getValue()
          
        }
        if (col == 3) {
          return eval(mark[col]);
          
          return o[col-1] === value && 
            o[col-2] === wsMain.getRange(row, col-1).getValue() &&
              o[col-3] === wsMain.getRange(row, col-2).getValue();
          
        }
        if (col == 4) {
          return eval(mark[col]);

          return o[col-1] === value && 
            o[col-2] === wsMain.getRange(row, col-1).getValue() &&
              o[col-3] === wsMain.getRange(row, col-2).getValue() &&
                o[col-4] === wsMain.getRange(row, col-3).getValue();

        }
      */
      });
      var listToApply = filterOptions.map(function(o) {return o[col]});
      if(col < maxDataColumn) {
        var cell = wsMain.getRange(row, col+1);
        applyValidationToCell(listToApply, cell);
      }
    }
  }
}

function applyValidationToCell(list, cell) {
  var rule = SpreadsheetApp.newDataValidation()
  .requireValueInList(list)
  .setAllowInvalid(false)
  .build();
  cell.setDataValidation(rule);
}
     
/*
function applyFirstLevelValidation(value, row) {
  if(value == "") {
    for(var i = 2; i <= maxDataColumn; i++) {
      ws.getRange(row, i).clearContent();
      ws.getRange(row, i).clearDataValidations();
    }
  }
  else {
    for (var i = 2; i <= maxDataColumn; i++) {
      ws.getRange(row, i).clearContent();
      ws.getRange(row, i).clearDataValidations();
    }
    var filterOptions = options.filter(function(o) {return o[0] === value});
    var listToApply = filterOptions.map(function(o) {return o[1]});
    var cell = ws.getRange(row, _2ndCol);
    applyValidationToCell(listToApply, cell);
  }
}

function applySecondLevelValidation(value, row) {
  if(value == "") {
    for (var i = 3; i <= maxDataColumn; i++) {
      ws.getRange(row, i).clearContent();
      ws.getRange(row, i).clearDataValidations();
    }
  } else {
    ws.getRange(row, _3rdCol).clearContent();
    var firstLevelColValue = ws.getRange(row, _1stCol).getValue();
    var filterOptions = options.filter(function(o) {return o[0] === firstLevelColValue && o[1] === value});
    var listToApply = filterOptions.map(function(o) {return o[2]});
    var cell = ws.getRange(row, _3rdCol);
    applyValidationToCell(listToApply, cell);
  }
}

function applyThirdLevelValidation(value, row) {
  if(value == "") {
    for (var i = 4; i <= maxDataColumn; i++) {
      ws.getRange(row, i).clearContent();
      ws.getRange(row, i).clearDataValidations();
    }
  } else {
    ws.getRange(row, _4thCol).clearContent();
    //var firstLevelColValue = ws.getRange(row, _1stCol).getValue();
    //var secondLevelColValue = ws.getRange(row, _2ndCol).getValue();
    var filterOptions = options.filter(function(o) {
      //return o[0] === firstLevelColValue &&
      //return o[1] === secondLevelColValue &&
      var i = 1;
      var j = 2;
      return o[i] === ws.getRange(row, _2ndCol).getValue() &&
        o[j] === value});
    var listToApply = filterOptions.map(function(o) {return o[3]});
    var cell = ws.getRange(row, _4thCol);
    applyValidationToCell(listToApply, cell);
  }
}
*/
