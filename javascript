function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Custom CSV Importer')
      .addItem('Import CSV', 'showDialog')
      .addToUi();
}

function showDialog() {
  var htmlOutput = HtmlService.createHtmlOutputFromFile('Index')
      .setWidth(400)
      .setHeight(300);
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'CSV Importer');
}

function importCSV(data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var csvData = Utilities.parseCsv(data);
  var numRows = csvData.length;
  var numCols = csvData[0].length;
  
  var app = UiApp.createApplication().setTitle('Select Columns to Import');
  var grid = app.createGrid(numRows + 1, numCols);
  
  for (var i = 0; i < numCols; i++) {
    var listBox = app.createListBox().setId('col_' + i);
    for (var j = 0; j < numRows; j++) {
      listBox.addItem(csvData[j][i]);
    }
    grid.setWidget(0, i, listBox);
  }
  
  var importButton = app.createButton('Import');
  var handler = app.createServerClickHandler('importData');
  handler.addCallbackElement(grid);
  importButton.addClickHandler(handler);
  
  grid.setWidget(numRows, 0, importButton);
  app.add(grid);
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  spreadsheet.show(app);
}

function importData(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var values = e.parameter;
  var data = Utilities.parseCsv(e.parameter.data);
  
  for (var i = 0; i < data[0].length; i++) {
    var colIndex = parseInt(values['col_' + i]);
    var columnData = [];
    for (var j = 0; j < data.length; j++) {
      columnData.push([data[j][i]]);
    }
    sheet.getRange(1, colIndex + 1, data.length, 1).setValues(columnData);
  }
}
