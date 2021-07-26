using System;

namespace SuperPowerBIRefresher.API.Security
{
    public class AccessToken
    {
        public static readonly int OffsetMinutes = 20;

        public string Token { get; }
        public DateTimeOffset ExpiresOn { get; }

        public AccessToken(string token, DateTimeOffset expiresOn)
        {
            Token = token;
            ExpiresOn = expiresOn;
        }

        public bool IsTokenExpired()
            => DateTime.UtcNow.AddMinutes(OffsetMinutes) >= ExpiresOn.UtcDateTime; // mark as expired the token before 20 minutes of actually being expired
    }
}
