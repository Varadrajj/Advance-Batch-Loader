using Advance_Batch_Loader.Models;
using Aras.IOM;
using System.Security;
using System.Text;

namespace Advance_Batch_Loader.Services
{
    public class ImportService
    {
        public void ImportBom(
            Innovator inn,
            List<BomData> rows,
            Dictionary<string, PartData> parts)
        {
            var uniqueParts = parts.Keys.ToList();

            var existingParts = GetExistingParts(inn, uniqueParts);

            var missingParts = uniqueParts
                .Where(p => !existingParts.ContainsKey(p))
                .ToList();

            if (missingParts.Any())
            {
                var newParts = missingParts
                    .Select(p => parts[p])
                    .ToList();

                CreatePartsBatch(inn, newParts);

                var createdParts = GetExistingParts(inn, missingParts);

                foreach (var p in createdParts)
                    existingParts[p.Key] = p.Value;
            }

            CreateBomRelationships(inn, rows, existingParts);
        }

        private Dictionary<string, string> GetExistingParts(
            Innovator inn,
            IEnumerable<string> partNumbers)
        {
            var list = partNumbers.ToList();

            if (!list.Any())
                return new Dictionary<string, string>();

            string inClause = string.Join(",", list.Select(p => $"'{p}'"));

            string aml = $@"
                         <AML>
                         <Item type='Part' action='get' select='id,item_number'>
                             <item_number condition='in'>{inClause}</item_number>
                         </Item>
                         </AML>";

            Item result = inn.applyAML(aml);

            var dict = new Dictionary<string, string>();

            for (int i = 0; i < result.getItemCount(); i++)
            {
                var item = result.getItemByIndex(i);

                dict[item.getProperty("item_number")] = item.getID();
            }

            return dict;
        }

        public void ImportItems(
            Innovator inn,
            string itemType,
            List<Dictionary<string, string>> rows)
        {
            int batchSize = 500;

            for (int i = 0; i < rows.Count; i += batchSize)
            {
                var batch = rows.Skip(i).Take(batchSize);

                var sb = new StringBuilder();
                sb.Append("<AML>");

                foreach (var row in batch)
                {
                    sb.Append($"<Item type='{itemType}' action='add'>");

                    foreach (var prop in row)
                    {
                        if (string.IsNullOrWhiteSpace(prop.Value))
                            continue;

                        var value = SecurityElement.Escape(prop.Value);

                        sb.Append($"<{prop.Key}>{value}</{prop.Key}>");
                    }

                    sb.Append("</Item>");
                }

                sb.Append("</AML>");

                inn.applyAML(sb.ToString());
            }
        }

        private void CreatePartsBatch(Innovator inn, List<PartData> parts)
        {
            var sb = new StringBuilder();
            sb.Append("<AML>");

            foreach (var part in parts)
            {
                sb.Append("<Item type='Part' action='add'>");

                foreach (var prop in part.Properties)
                {
                    if (string.IsNullOrWhiteSpace(prop.Value))
                        continue;

                    var value = SecurityElement.Escape(prop.Value);

                    sb.Append($"<{prop.Key}>{value}</{prop.Key}>");
                }

                sb.Append("</Item>");
            }

            sb.Append("</AML>");

            inn.applyAML(sb.ToString());
        }

        private void CreateBomRelationships(
            Innovator inn,
            List<BomData> rows,
            Dictionary<string, string> partMap)
        {
            int batchSize = 500;

            for (int i = 0; i < rows.Count; i += batchSize)
            {
                var batch = rows.Skip(i).Take(batchSize);

                var sb = new StringBuilder();
                sb.Append("<AML>");

                foreach (var row in batch)
                {
                    if (!partMap.ContainsKey(row.ParentPart) ||
                        !partMap.ContainsKey(row.ChildPart))
                        continue;

                    string parentId = partMap[row.ParentPart];
                    string childId = partMap[row.ChildPart];

                    sb.Append($@"
                              <Item type='Part BOM' action='add'>
                                  <source_id>{parentId}</source_id>
                                  <related_id>{childId}</related_id>
                                  <quantity>{row.Quantity}</quantity>
                              </Item>");
                }

                sb.Append("</AML>");

                inn.applyAML(sb.ToString());
            }
        }
    }

}
