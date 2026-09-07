# Clearframe

A self-contained CSV / XLSX data-cleaning portfolio demo for Yunis Nasibov.

## Screenshots

![Workspace](docs/screenshots/workspace.png)
![Before cleaning](docs/screenshots/before.png)
![After cleaning](docs/screenshots/after.png)

## Run

Requires Node.js 20 or newer. No package installation is needed.

```
node scripts/build.mjs
node scripts/serve.mjs
```

Open http://127.0.0.1:4173. Stop with Ctrl+C. Run `node --test tests/core.test.mjs` for tests.

## Structure

- `src/core.mjs`: CSV parsing, quality analysis, immutable cleaning, CSV serialization.
- `src/xlsx.mjs`: limited XLSX values import and text-only XLSX export.
- `src/app.mjs`: interface state, import/export and optional WebMCP tools.
- `src/style.css`: responsive interface.
- `tests/`: deterministic tests and an Excel export validation fixture.
- `scripts/`: isolated build and local static server.
- `dist/`: generated deployable static website.
- `samples/`: fictional sample input.
- `PORTFOLIO.md`: draft portfolio description and recording outline.

No databases, API keys, accounts, telemetry, uploads to a server, or changes to other projects. File contents remain in browser memory and disappear on reload. Google Fonts is requested for typography; no file content is sent with that request.

## Scope and limits

- UTF-8 CSV/TSV and .xlsx; not legacy .xls, encrypted workbooks or macros.
- Maximum 5 MB compressed input, 50 MB declared expanded workbook content, 20,000 data rows, 200 columns.
- First row becomes headers. Blank and duplicate headers receive generated unique names. Ragged CSV rows are padded, with generated headers for extra columns.
- XLSX supports sheet selection and stored values. Formulas are not calculated. Missing cached formula results become blank. Dates are read as Excel serial values; styling, merged cells and formatting are not preserved. Export is values-only with all cells stored as text.
- Exact row duplicates are compared across every field, case-sensitive. Trimming runs before deduplication. Blank values are never imputed.
- CSV export prefixes formula-like cells with an apostrophe to reduce spreadsheet formula execution. The change report covers cleaning, not these export-only prefixes. XLSX is preferred for exact string preservation.
- Preview shows first 100 rows. Cleaning and downloads cover all imported rows.
- Change reports contain original and revised values; treat them with the same care as the source data.

## Validation

Automated tests cover CSV quoting, multiline cells, delimiters, leading zero preservation, malformed input, header normalization, immutable cleaning, operation order, blanks, duplicates and export. Exported XLSX was independently read with openpyxl. Full browser interaction and XLSX import compatibility across third-party workbooks remain to be verified before claiming production readiness. WebMCP is feature-detected; its live integration has not been verified.

## Opening CSV in Excel

If a CSV opens in one column, use Data > From Text/CSV and select comma as delimiter, or download XLSX instead. XLSX exports include readable column widths.

The sample cleaning flow was also checked by the author in the browser: 12 rows become 9, with 3 missing cells retained.
