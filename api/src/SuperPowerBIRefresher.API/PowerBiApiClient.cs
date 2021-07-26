using Microsoft.PowerBI.Api;
using PowerBiApiModels = Microsoft.PowerBI.Api.Models;
using Microsoft.Rest;
using SuperPowerBIRefresher.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using SuperPowerBIRefresher.API.Security;

namespace SuperPowerBIRefresher.API
{
    class PowerBiApiClient
    {
        private readonly PowerBIClient _powerBiClient;

        public Client OnBehalf { get; }

        public PowerBiApiClient(Client onBehalfClient)
        {
            OnBehalf = onBehalfClient;

            var tokenCredentials = new TokenCredentials("dummy", "Bearer");
            _powerBiClient = new PowerBIClient(tokenCredentials, new AccessTokenHandler(onBehalfClient));
        }

        public async Task<List<Dataset>> GetDatasets()
        {
            var datasets = new List<Dataset>();

            IEnumerable<PowerBiApiModels.Dataset> refreshableDatasets =
                (await _powerBiClient.Datasets.GetDatasetsAsync()).Value.Where(d => d.IsRefreshable.HasValue && d.IsRefreshable.Value);

            foreach (var dataset in refreshableDatasets)
            {
                var datasetRefreshHistory = await GetLatestDatasetRefreshHistory(dataset.Id);
                
                if (datasetRefreshHistory != null)
                    datasets.Add(new Dataset()
                    {
                        Id = dataset.Id,
                        IsRefreshable = dataset.IsRefreshable.Value,
                        Name = dataset.Name,
                        RefreshHistory = new List<DatasetRefresh>() { datasetRefreshHistory }
                    });
            }

            return datasets;
        }

        private async Task<DatasetRefresh> GetLatestDatasetRefreshHistory(string datasetId)
        {
            const int top = 1;

            var datasetRefresh = (await GetDatasetRefreshHistory(datasetId, top)).FirstOrDefault();

            return datasetRefresh;
        }

        public async Task<List<DatasetRefresh>> GetDatasetRefreshHistory(string datasetId, int? top)
        {
            var datasetRefreshes = new List<DatasetRefresh>();

            var refreshes = await _powerBiClient.Datasets.GetRefreshHistoryAsync(datasetId, top);
            foreach (var refresh in refreshes.Value)
            {
                datasetRefreshes.Add
                    (
                        new DatasetRefresh() 
                        {
                            DatasetId = datasetId
                            , StartDateInUtc = refresh.StartTime
                            , EndDateInUtc = refresh.EndTime
                            , Status = refresh.Status
                            , Error = refresh.Status == "Failed" && 
                                !string.IsNullOrEmpty(refresh.ServiceExceptionJson) ? DatasetRefreshErrorDetails.Parse(refresh.ServiceExceptionJson) : null
                        }
                    );
            }
            return datasetRefreshes;
        }

        public Task RefreshDataset(string datasetId) => _powerBiClient.Datasets.RefreshDatasetAsync(datasetId);
    }
}
