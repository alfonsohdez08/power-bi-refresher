using SuperPowerBIRefresher.WebAPI.Data.PowerBI;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace SuperPowerBIRefresher.WebAPI.Auth
{
    class AccessTokenHttpHandler : DelegatingHandler
    {
        private readonly Account _powerBIAccount;

        public AccessTokenHttpHandler(Account powerBIAccount)
        {
            _powerBIAccount = powerBIAccount;
        }

        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            const string AuthorizationHeader = "Authorization";

            if (request.Headers.Contains(AuthorizationHeader))
                request.Headers.Remove(AuthorizationHeader);

            string accessToken = AccessTokenAcquirer.AcquireAccessToken(_powerBIAccount);
            request.Headers.Add(AuthorizationHeader, $"Bearer {accessToken}");

            return base.SendAsync(request, cancellationToken);
        }
    }
}
