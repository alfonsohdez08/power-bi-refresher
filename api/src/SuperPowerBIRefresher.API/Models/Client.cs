using System;

namespace SuperPowerBIRefresher.API.Models
{
    public class Client
    {
        public Guid Id { get; } = Guid.NewGuid();
        public string DisplayName { get; set; }
        public ApiCredentials PowerBiApiCredentials { get; set; }
    }
}
