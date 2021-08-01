using Microsoft.PowerBI.Api;
using Microsoft.Rest;
using SuperPowerBIRefresher.WebAPI.Auth;
using SuperPowerBIRefresher.WebAPI.Data.PowerBI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MicrosoftPowerBIModels = Microsoft.PowerBI.Api.Models;

namespace SuperPowerBIRefresher.WebAPI
{
    class PowerBIApiClient
    {
        private readonly PowerBIClient _powerBIClient;

        public Account Account { get; }

        private PowerBIApiClient(Account account)
        {
            Account = account;

            var tokenCredentials = new TokenCredentials("dummy", "Bearer");
            _powerBIClient = new PowerBIClient(tokenCredentials, new AccessTokenHttpHandler(account));
        }

        public static PowerBIApiClient Create(Account account) => new PowerBIApiClient(account);

        public static List<PowerBIApiClient> Create(IEnumerable<Account> accounts)
        {
            var clients = new List<PowerBIApiClient>();
            foreach (var account in accounts)
                clients.Add(Create(account));

            return clients;
        }

        public async Task<List<Dataset>> GetDatasets()
        {
            var datasets = new List<Dataset>();

            IEnumerable<MicrosoftPowerBIModels.Dataset> refreshableDatasets =
                (await _powerBIClient.Datasets.GetDatasetsAsync()).Value.Where(d => d.IsRefreshable.HasValue && d.IsRefreshable.Value);

            foreach (var dataset in refreshableDatasets)
            {
                var datasetRefreshHistory = await GetMostRecentDatasetRefresh(dataset.Id);

                datasets.Add(new Dataset()
                {
                    Id = dataset.Id,
                    Name = dataset.Name,
                    MostRecentRefresh = datasetRefreshHistory
                });
            }

            return datasets;
        }

        private async Task<DatasetRefresh> GetMostRecentDatasetRefresh(string datasetId)
        {
            var refreshes = await GetDatasetRefreshHistory(datasetId, 1);

            return refreshes.SingleOrDefault();
        }

        private async Task<List<DatasetRefresh>> GetDatasetRefreshHistory(string datasetId, int? top)
        {
            var datasetRefreshHistory = new List<DatasetRefresh>();

            var refreshes = await _powerBIClient.Datasets.GetRefreshHistoryAsync(datasetId, top);
            foreach (var refresh in refreshes.Value)
            {
                RefreshStatus refreshStatus = Enum.Parse<RefreshStatus>(refresh.Status);

                datasetRefreshHistory.Add(
                    new DatasetRefresh()
                        {
                            DatasetId = datasetId,
                            StartDateInUtc = refresh.StartTime,
                            EndDateInUtc = refresh.EndTime,
                            Status = refreshStatus,
                            Error = refreshStatus == RefreshStatus.Failed &&
                                !string.IsNullOrEmpty(refresh.ServiceExceptionJson) ? DatasetRefreshErrorDetails.Parse(refresh.ServiceExceptionJson) : null
                        }
                );
            }
            return datasetRefreshHistory;
        }

        public Task RefreshDataset(string datasetId) => _powerBIClient.Datasets.RefreshDatasetAsync(datasetId);
    }
}
