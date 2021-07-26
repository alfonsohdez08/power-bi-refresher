using System.Collections.Generic;

namespace SuperPowerBIRefresher.API.Models
{
    public class SuperClient
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public IEnumerable<Dataset> Datasets { get; set; }
    }
}
