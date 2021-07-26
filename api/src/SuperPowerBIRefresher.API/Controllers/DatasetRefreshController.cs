using Microsoft.AspNetCore.Mvc;
using SuperPowerBIRefresher.API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SuperPowerBIRefresher.API.Controllers
{
    [Route("api/dataset-refreshes")]
    [ApiController]
    public class DatasetRefreshController : ControllerBase
    {
        private readonly PowerBiConfiguration _powerBiConfiguration;

        public DatasetRefreshController(PowerBiConfiguration powerBiConfig)
        {
            _powerBiConfiguration = powerBiConfig;
        }

        [HttpPost]
        public async Task<ActionResult> RefreshDataset([FromBody]RefreshDatasetRequest[] requests)
        {
            string[] clientIds = requests.GroupBy(r => r.ClientId).Select(c => c.Key).ToArray();
            Dictionary<string, PowerBiApiClient> powerBiApiClients = GetPowerBiApiClients(clientIds);

            foreach (var request in requests)
            {
                try
                {
                    await powerBiApiClients[request.ClientId].RefreshDataset(request.DatasetId);
                }
                catch (Exception)
                {
                    // swallows exception

                    return StatusCode(500, new { ErrorMessage = $"There was a problem when attempting to perform the dataset refresh for a particular dataset." });
                }
            }

            return Ok();
        }

        private Dictionary<string, PowerBiApiClient> GetPowerBiApiClients(string[] clientIds)
        {
            var clientIdSet = new HashSet<string>(clientIds);

            var powerBiApiClients = new Dictionary<string, PowerBiApiClient>();
            foreach (var client in _powerBiConfiguration.ApiClients.Where(c => clientIdSet.Contains(c.Id.ToString())))
                powerBiApiClients[client.Id.ToString()] = new PowerBiApiClient(client);

            return powerBiApiClients;
        }
    }
}
