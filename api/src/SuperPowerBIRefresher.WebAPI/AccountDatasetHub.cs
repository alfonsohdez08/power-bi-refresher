using Microsoft.AspNetCore.SignalR;
using SuperPowerBIRefresher.WebAPI.Data;
using SuperPowerBIRefresher.WebAPI.Data.PowerBI;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SuperPowerBIRefresher.WebAPI
{
    class AccountDatasetHub: Hub
    {
        private readonly PowerBIAccounts _accounts;

        public AccountDatasetHub(PowerBIAccounts powerBIAccounts)
        {
            _accounts = powerBIAccounts;
        }

        [HubMethodName("GetAccountsDatasets")]
        public async Task GetAccountsDatasets()
        {
            try
            {
                await SendAccountsDatasets();
            }
            finally
            {
                await Clients.Caller.SendAsync("finishSendingAccountsDatasets");
            }
        }

        private async Task SendAccountsDatasets()
        {
            foreach (var powerBIApiClient in PowerBIApiClient.Create(_accounts.Accounts))
            {
                List<Dataset> datasets = null;
                try
                {
                    datasets = await powerBIApiClient.GetDatasets();
                }
                catch (Exception)
                {
                    continue;
                }

                var account = powerBIApiClient.Account;
                var accountDatasets = new AccountDatasets()
                {
                    AccountId = account.Id,
                    AccountDisplayName = account.DisplayName,
                    Datasets = datasets
                };

                await Clients.Caller.SendAsync("getAccountDatasets", accountDatasets);
            }
        }
    }
}
