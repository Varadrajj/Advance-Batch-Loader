using Advance_Batch_Loader.Models;
using Advance_Batch_Loader.Services;
using Microsoft.AspNetCore.Mvc;

namespace Advance_Batch_Loader.Controllers
{
    [ApiController]
    [Route("api/aras")]
    public class ArasMetadataController : ControllerBase
    {
        private readonly ArasConnectionService _connection;

        public ArasMetadataController(ArasConnectionService connection)
        {
            _connection = connection;
        }

        [HttpPost("properties")]
        public IActionResult GetItemTypeProperties(
            [FromBody] ConnectionRequest connection,
            [FromQuery] string itemType)
        {
            try
            {
                var inn = _connection.Connect(connection);

                var aml = $@"
                <AML>
                  <Item type='ItemType' action='get'>
                    <name>{itemType}</name>
                    <Relationships>
                      <Item type='Property' action='get'>
                        <name />
                        <label />
                        <data_type />
                      </Item>
                    </Relationships>
                  </Item>
                </AML>";

                var result = inn.applyAML(aml);

                var properties = new List<ArasProperty>();

                var rels = result.getRelationships("Property");

                for (int i = 0; i < rels.getItemCount(); i++)
                {
                    var prop = rels.getItemByIndex(i);

                    properties.Add(new ArasProperty
                    {
                        Name = prop.getProperty("name"),
                        Label = prop.getProperty("label"),
                        DataType = prop.getProperty("data_type")
                    });
                }

                return Ok(properties);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}