using Microsoft.Identity.Client;
using SuperPowerBIRefresher.API.Models;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Security;
using System.Threading.Tasks;

namespace SuperPowerBIRefresher.API.Security
{
    static class AccessTokenAcquirer
    {
        private static readonly ConcurrentDictionary<Client, object> _lockers = new ConcurrentDictionary<Client, object>(new ClientComparer());
        private static readonly Dictionary<Client, AccessToken> _tokens = new Dictionary<Client, AccessToken>(new ClientComparer());

        public static string AcquireAccessToken(Client client)
        {
            string token = string.Empty;

            object locker = new object();
            locker = _lockers.GetOrAdd(client, locker);

            lock (locker)
            {
                if (!_tokens.TryGetValue(client, out var accessTokenDetails) || accessTokenDetails.IsTokenExpired())
                {
                    accessTokenDetails = AcquireAccessToken(client.PowerBiApiCredentials).ConfigureAwait(false).GetAwaiter().GetResult();

                    _tokens[client] = accessTokenDetails;
                }
                
                token = accessTokenDetails.Token;
            }

            return token;
        }

        private static async Task<AccessToken> AcquireAccessToken(ApiCredentials apiCredentials)
        {
            // Code from: https://github.com/microsoft/PowerBI-Developer-Samples/blob/master/.NET%20Core/Embed%20for%20your%20customers/AppOwnsData/Services/AadService.cs

            const string authorityUrl = "https://login.microsoftonline.com/organizations/";

            string[] scopes = new string[] { "https://analysis.windows.net/powerbi/api/.default" };
            IPublicClientApplication clientApp =
                PublicClientApplicationBuilder.Create(apiCredentials.ClientId).WithAuthority(authorityUrl).Build();

            var password = new SecureString();
            foreach (char character in apiCredentials.Password)
                password.AppendChar(character);

            AuthenticationResult authenticationResult = 
                await clientApp.AcquireTokenByUsernamePassword(scopes, apiCredentials.Username, password).ExecuteAsync();

            return new AccessToken(authenticationResult.AccessToken, authenticationResult.ExpiresOn);
        }
    }
}
