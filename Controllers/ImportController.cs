using Microsoft.AspNetCore.Mvc;
using Aras.IOM;
using Advance_Batch_Loader.Models;
using Advance_Batch_Loader.Services;
using Newtonsoft.Json;


namespace Advance_Batch_Loader.Controllers
{

    [ApiController]
    [Route("api/import")]
    public class ImportController : ControllerBase
    {
        private readonly ExcelService _excelService;
        private readonly ImportService _importService;
        private readonly ArasConnectionService _connectionService;

        public ImportController(
            ExcelService excelService,
            ImportService importService,
            ArasConnectionService connectionService)
        {
            _excelService = excelService;
            _importService = importService;
            _connectionService = connectionService;
        }

        [HttpPost("bom")]
        public IActionResult ImportBom(
    IFormFile file,
    [FromForm] string requestJson)
        {
            try
            {
                var request = JsonConvert.DeserializeObject<ImportRequest>(requestJson);

                using var stream = file.OpenReadStream();

                // Parse Excel rows based on mapping
                var rows = _excelService.ParseExcel(stream, request.Mappings);

                // Connect to Aras
                var inn = _connectionService.Connect(request.Connection);

                // Import items
                _importService.ImportItems(
                    inn,
                    request.ItemType,
                    rows);

                return Ok(new
                {
                    message = "Import completed",
                    rows = rows.Count
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    error = ex.ToString()
                });
            }
        }

        [HttpPost("generic")]
        public IActionResult ImportGeneric(
             IFormFile file,
             [FromForm] string requestJson)
        {
            var request = JsonConvert.DeserializeObject<ImportRequest>(requestJson);

            using var stream = file.OpenReadStream();

            var rows = _excelService.ParseGenericExcel(stream, request.Mappings);

            var inn = _connectionService.Connect(request.Connection);

            _importService.ImportItems(
                inn,
                request.ItemType,
                rows);

            return Ok(new
            {
                message = "Generic import completed",
                rows = rows.Count
            });
        }
    }
}
