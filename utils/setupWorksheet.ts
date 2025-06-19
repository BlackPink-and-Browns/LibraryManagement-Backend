import { Worksheet, Workbook } from 'exceljs';

type WorksheetConfig = {
  name: string;
  headers: string[];
  columnWidths: number[];
};

function setupWorksheet(
  workbook: Workbook,
  config: WorksheetConfig
): Worksheet {
  const sheet = workbook.addWorksheet(config.name, {
    views: [{ state: 'frozen', ySplit: 1 }],
  });

  sheet.addRow(config.headers);
  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true };
  headerRow.alignment = { vertical: 'middle', wrapText: true };
  headerRow.border = {
    bottom: { style: 'double', color: { argb: '#000000' } },
  };

  sheet.columns = config.columnWidths.map((width) => ({ width }));
  return sheet;
}

export default setupWorksheet;