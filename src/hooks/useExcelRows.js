import * as XLSX from "xlsx";
import { useState, useCallback } from "react";

// --- UTIL: Normalize text ---
const normalizeCellValue = (value) => {
  if (typeof value !== "string") return "";
  return value
    .replace(/<[^>]*>/g, "") // Remove HTML tags like <t>
    .replace(/&[^;\s]+;/g, "") // Remove HTML entities like &amp;
    .replace(/\s+/g, " ") // Collapse whitespace
    .trim()
    .toLowerCase();
};

// --- UTIL: Fix broken !ref by scanning cell addresses ---
const getActualRangeFromSheet = (sheet) => {
  const cellAddresses = Object.keys(sheet).filter((key) =>
    /^[A-Z]+\d+$/.test(key)
  );

  let minRow = Infinity,
    maxRow = -1,
    minCol = Infinity,
    maxCol = -1;

  cellAddresses.forEach((address) => {
    const { r, c } = XLSX.utils.decode_cell(address);
    minRow = Math.min(minRow, r);
    maxRow = Math.max(maxRow, r);
    minCol = Math.min(minCol, c);
    maxCol = Math.max(maxCol, c);
  });

  if (cellAddresses.length === 0) return null;

  const start = XLSX.utils.encode_cell({ r: minRow, c: minCol });
  const end = XLSX.utils.encode_cell({ r: maxRow, c: maxCol });

  return `${start}:${end}`;
};

// --- HEADER ROW DETECTOR: based on keyword like "Sales" ---
const findHeaderRow = (sheet, keyword = "Sales") => {
  const range = XLSX.utils.decode_range(sheet["!ref"]);

  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      const cell = sheet[cellAddress];

      if (cell && typeof cell.v === "string") {
        const cleaned = normalizeCellValue(cell.v);
        if (cleaned.includes(keyword.toLowerCase())) {
          console.log(`Matched keyword "${keyword}" at row ${R + 1}`);
          return R;
        }
      }
    }
  }

  return null;
};

// --- EXCEL FILE PARSER ---
const parseExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Fix !ref if broken
        const fixedRef = getActualRangeFromSheet(sheet);
        if (!fixedRef) {
          reject(new Error("Unable to determine data range."));
          return;
        }
        sheet["!ref"] = fixedRef;

        const headerRowIndex = findHeaderRow(sheet, "Ledger Account");
        if (headerRowIndex === null) {
          reject(new Error('Header row with "Sales" not found.'));
          return;
        }

        const json = XLSX.utils.sheet_to_json(sheet, {
          range: headerRowIndex,
          header: 1,
          blankrows: false,
          defval: "",
        });

        console.log("------------------- start json here -------------------");
        console.log("headerRowIndex", headerRowIndex);
        console.log(json);
        console.log("------------------- end here -------------------");

        resolve({ data: json, headerRow: headerRowIndex + 1 });
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

// --- REACT HOOK ---
export default function useExcelRows() {
  const [rows, setRows] = useState([]);

  const load = useCallback(async (file) => {
    try {
      const result = await parseExcelFile(file);
      setRows(result.data);
    } catch (error) {
      console.error("Failed to load Excel:", error.message);
    }
  }, []);

  return { rows, load };
}
