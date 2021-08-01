using System.Text.Json.Serialization;

namespace SuperPowerBIRefresher.WebAPI.Data
{
    public class RefreshDatasetRequest
    {
        [JsonPropertyName("accountId")]
        public string AccountId { get; set; }

        [JsonPropertyName("datasetId")]
        public string DatasetId { get; set; }
    }
}
