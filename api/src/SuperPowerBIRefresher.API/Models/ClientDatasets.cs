using System;
using System.Collections.Generic;

namespace SuperPowerBIRefresher.API.Models
{
    public class ClientDatasets
    {
        public Guid ClientId { get; set; }
        public string ClientDisplayName { get; set; }
        public IEnumerable<Dataset> Datasets { get; set; }
    }
}
