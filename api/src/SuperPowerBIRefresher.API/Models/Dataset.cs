using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SuperPowerBIRefresher.API.Models
{
    public class Dataset
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public bool IsRefreshable { get; set; }
        public IEnumerable<DatasetRefresh> RefreshHistory { get; set; }
    }
}
