using Advance_Batch_Loader.Models;
using Advance_Batch_Loader.Services;
using Aras.IOM;
using Microsoft.AspNetCore.Mvc;

namespace Advance_Batch_Loader.Controllers
{
    [ApiController]
    [Route("api/connection")]
    public class ConnectionController : ControllerBase
    {
        private readonly ArasConnectionService _service;

        public ConnectionController(ArasConnectionService service)
        {
            _service = service;
        }

        [HttpPost("connect")]
        public IActionResult Connect([FromBody] ConnectionRequest request)
        {
            try
            {
                Innovator inn = _service.Connect(request);
                return Ok(new { message = "Connection successful" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.ToString() });
            }
        }
    }
}
