using Advance_Batch_Loader.Models;
using OfficeOpenXml;

public class ExcelService
{
    public List<object> ReadHeaders(Stream stream)
    {
        using var package = new ExcelPackage(stream);
        var sheet = package.Workbook.Worksheets[0];

        int columnCount = sheet.Dimension.Columns;

        var headers = new List<object>();

        for (int col = 1; col <= columnCount; col++)
        {
            var header = sheet.Cells[1, col].Text.Trim();

            if (!string.IsNullOrWhiteSpace(header))
            {
                headers.Add(new
                {
                    columnIndex = col,
                    columnName = header
                });
            }
        }

        return headers;
    }

    public (List<BomData>, Dictionary<string, PartData>) ParseExcel(
     Stream stream,
     List<ColumnMapping> mappings)
    {
        ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

        using var package = new ExcelPackage(stream);
        var sheet = package.Workbook.Worksheets[0];

        int rowCount = sheet.Dimension.Rows;

        var bomList = new List<BomData>();
        var partDictionary = new Dictionary<string, PartData>();

        for (int row = 2; row <= rowCount; row++)
        {
            string parent = string.Join("-",
                sheet.Cells[row, 7].Text.Trim(),
                sheet.Cells[row, 8].Text.Trim(),
                sheet.Cells[row, 9].Text.Trim(),
                sheet.Cells[row, 10].Text.Trim(),
                sheet.Cells[row, 11].Text.Trim()
            );

            string child = sheet.Cells[row, 17].Text.Trim();

            if (string.IsNullOrWhiteSpace(child))
                continue;

            int qty = 1;
            int.TryParse(sheet.Cells[row, 15].Text, out qty);

            bomList.Add(new BomData
            {
                ParentPart = parent,
                ChildPart = child,
                Quantity = qty
            });

            AddPart(sheet, row, parent, partDictionary, mappings);
            AddPart(sheet, row, child, partDictionary, mappings);
        }

        return (bomList, partDictionary);
    }

    public List<Dictionary<string, string>> ParseGenericExcel(
    Stream stream,
    List<ColumnMapping> mappings)
    {
        ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

        using var package = new ExcelPackage(stream);
        var sheet = package.Workbook.Worksheets[0];

        int rowCount = sheet.Dimension.Rows;

        var rows = new List<Dictionary<string, string>>();

        for (int row = 2; row <= rowCount; row++)
        {
            var data = new Dictionary<string, string>();

            foreach (var map in mappings)
            {
                var value = sheet.Cells[row, map.ColumnIndex].Text.Trim();

                if (!string.IsNullOrWhiteSpace(value))
                {
                    data[map.PropertyName] = value;
                }
            }

            if (data.Count > 0)
                rows.Add(data);
        }

        return rows;
    }

    private void AddPart(
    ExcelWorksheet sheet,
    int row,
    string partNumber,
    Dictionary<string, PartData> partDictionary,
    List<ColumnMapping> mappings)
    {
        if (partDictionary.ContainsKey(partNumber))
            return;

        var part = new PartData();
        part.ItemNumber = partNumber;

        part.Properties["item_number"] = partNumber;

        foreach (var map in mappings)
        {
            var value = sheet.Cells[row, map.ColumnIndex].Text.Trim();

            if (!string.IsNullOrWhiteSpace(value))
            {
                part.Properties[map.PropertyName] = value;
            }
        }

        partDictionary[partNumber] = part;
    }
}
