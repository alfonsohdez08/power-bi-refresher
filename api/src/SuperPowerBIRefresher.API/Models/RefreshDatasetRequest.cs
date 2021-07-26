using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace SuperPowerBIRefresher.API.Models
{
    public class RefreshDatasetRequest
    {
        [JsonPropertyName("clientId")]
        public string ClientId { get; set; }

        [JsonPropertyName("datasetId")]
        public string DatasetId { get; set; }
    }
}
