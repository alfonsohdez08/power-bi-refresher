using SuperPowerBIRefresher.API.Models;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace SuperPowerBIRefresher.API.Security
{
    class AccessTokenHandler : DelegatingHandler
    {
        private readonly Client _client;

        public AccessTokenHandler(Client client)
        {
            _client = client;
        }

        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            const string AuthorizationHeader = "Authorization";

            if (request.Headers.Contains(AuthorizationHeader))
                request.Headers.Remove(AuthorizationHeader);

            string accessToken = AccessTokenAcquirer.AcquireAccessToken(_client);
            request.Headers.Add(AuthorizationHeader, $"Bearer {accessToken}");

            return base.SendAsync(request, cancellationToken);
        }
    }
}
