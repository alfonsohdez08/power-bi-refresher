using Microsoft.AspNetCore.SignalR;
using SuperPowerBIRefresher.API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SuperPowerBIRefresher.API.Hubs
{
    class ClientHub: Hub
    {
        private readonly PowerBiConfiguration _powerBiConfiguration;

        public ClientHub(PowerBiConfiguration powerBiConfig)
        {
            _powerBiConfiguration = powerBiConfig;
        }

        [HubMethodName("GetClients")]
        public async Task GetClients()
        {
            try
            {
                await SendClients(_powerBiConfiguration.ApiClients);
            }
            finally
            {
                await Clients.Caller.SendAsync("finishSendingClients");
            }
        }

        private async Task SendClients(IEnumerable<Client> clients)
        {
            foreach (var client in clients)
            {
                var powerBiApiClient = new PowerBiApiClient(client);

                List<Dataset> datasets = null;
                try
                {
                    datasets = await powerBiApiClient.GetDatasets();
                }
                catch (Exception)
                {
                    continue;
                }

                var superClient = new SuperClient()
                {
                    Id = client.Id.ToString(),
                    Name = client.DisplayName,
                    Datasets = datasets
                };
                await Clients.Caller.SendAsync("getClient", superClient);
            }
        }
    }
}
