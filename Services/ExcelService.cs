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

    public List<Dictionary<string, string>> ParseExcel(
        Stream stream,
        List<ColumnMapping> mappings)
    {
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

    public List<Dictionary<string, string>> ParseGenericExcel(
    Stream stream,
    List<ColumnMapping> mappings)
    {
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
