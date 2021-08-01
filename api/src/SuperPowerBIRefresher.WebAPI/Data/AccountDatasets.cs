using SuperPowerBIRefresher.WebAPI.Data.PowerBI;
using System.Collections.Generic;

namespace SuperPowerBIRefresher.WebAPI.Data
{
    class AccountDatasets
    {
        public string AccountId { get; set; }
        public string AccountDisplayName { get; set; }
        public List<Dataset> Datasets { get; set; }
    }
}
