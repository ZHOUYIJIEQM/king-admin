import * as XLSX from 'xlsx/xlsx.mjs';

// 导出 json 转为 xlsx
export function exportExcelFile(array: any[], sheetName = '表1', fileName = 'example.xlsx') {
  const jsonWorkSheet = XLSX.utils.json_to_sheet(array);
  // console.log(jsonWorkSheet);
  const workBook: any = {
    SheetNames: [sheetName],
    Sheets: {
      [sheetName]: jsonWorkSheet,
    }
  };
  // console.log(workBook);
  return XLSX.writeFile(workBook, fileName);
}

// 导入并转为json
export function importExcelFromBuffer(excelRcFileBuffer: ArrayBuffer) {
  // 读取表格对象
  const workbook = XLSX.read(excelRcFileBuffer, {type: 'buffer'});
  // 找到第一张表
  const sheetNames = workbook.SheetNames;
  const sheet1 = workbook.Sheets[sheetNames[0]];
  // 读取内容
  return XLSX.utils.sheet_to_json(sheet1);
}