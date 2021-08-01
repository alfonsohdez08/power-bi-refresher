using Microsoft.Identity.Client;
using SuperPowerBIRefresher.WebAPI.Data.PowerBI;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Security;
using System.Threading.Tasks;

namespace SuperPowerBIRefresher.WebAPI.Auth
{
    static class AccessTokenAcquirer
    {
        private static readonly ConcurrentDictionary<Account, object> _lockers = new ConcurrentDictionary<Account, object>(new AccountComparer());
        private static readonly Dictionary<Account, AccessToken> _tokens = new Dictionary<Account, AccessToken>(new AccountComparer());

        public static string AcquireAccessToken(Account powerBIAccount)
        {
            string token = string.Empty;

            object locker = new object();
            locker = _lockers.GetOrAdd(powerBIAccount, locker);

            lock (locker)
            {
                if (!_tokens.TryGetValue(powerBIAccount, out var accessTokenDetails) || accessTokenDetails.IsTokenExpired())
                {
                    accessTokenDetails = AcquireAccessToken(powerBIAccount.ApiCredentials).ConfigureAwait(false).GetAwaiter().GetResult();

                    _tokens[powerBIAccount] = accessTokenDetails;
                }

                token = accessTokenDetails.Token;
            }
            
            return token;
        }

        private static async Task<AccessToken> AcquireAccessToken(Credentials apiCredentials)
        {
            // Code from: https://github.com/microsoft/PowerBI-Developer-Samples/blob/master/.NET%20Core/Embed%20for%20your%20customers/AppOwnsData/Services/AadService.cs

            const string authorityUrl = "https://login.microsoftonline.com/organizations/";

            string[] scopes = new string[] { "https://analysis.windows.net/powerbi/api/.default" };
            IPublicClientApplication clientApp =
                PublicClientApplicationBuilder.Create(apiCredentials.ApiClientId).WithAuthority(authorityUrl).Build();

            var password = new SecureString();
            foreach (char character in apiCredentials.Password)
                password.AppendChar(character);

            AuthenticationResult authenticationResult =
                await clientApp.AcquireTokenByUsernamePassword(scopes, apiCredentials.Username, password).ExecuteAsync();

            return new AccessToken(authenticationResult.AccessToken, authenticationResult.ExpiresOn);
        }
    }
}
