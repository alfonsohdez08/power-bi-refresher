using System;
using System.Text.Json;

namespace SuperPowerBIRefresher.API.Models
{
    public class DatasetRefresh
    {
        public string DatasetId { get; set; }
        public string Status { get; set; }
        public DateTime? StartDateInUtc { get; set; }
        public DateTime? EndDateInUtc { get; set; }
        public DatasetRefreshErrorDetails Error { get; set; }
    }

    public class DatasetRefreshErrorDetails
    {
        public string ErrorCode { get; set; }
        public string Description { get; set; }


        private DatasetRefreshErrorDetails()
        {

        }

        public static DatasetRefreshErrorDetails Parse(string errorJson)
        {
            DatasetRefreshErrorDetails errorDetails = null;

            using (var jsonDocument = JsonDocument.Parse(errorJson))
            {
                JsonElement jsonRootElement = jsonDocument.RootElement;
                
                /*
                    It seems there is a bug either with the Power BI REST API wrapper by Microsoft or the API itself because
                    the "errorCode" field would hold either a simple string or a JSON object as string which is not well formed.
                 */
                string errorCode = jsonRootElement.GetProperty("errorCode").GetString();
                if (!IsJsonObject(errorCode))
                    errorDetails = new DatasetRefreshErrorDetails()
                    {
                        ErrorCode = errorCode,
                        Description = jsonRootElement.TryGetProperty("errorDescription", out var descriptionElement) ? descriptionElement.GetString() : ""
                    };
            }

            // This is a naive approach to check if it is a "stringified" JSON
            static bool IsJsonObject(string json) => json.StartsWith("{");

            return errorDetails;
        }
    }
}