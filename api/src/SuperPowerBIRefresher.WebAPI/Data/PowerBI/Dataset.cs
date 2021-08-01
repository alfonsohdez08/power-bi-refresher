namespace SuperPowerBIRefresher.WebAPI.Data.PowerBI
{
    class Dataset
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public DatasetRefresh MostRecentRefresh { get; set; }
    }
}
