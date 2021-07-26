using SuperPowerBIRefresher.API.Security;
using System;
using System.Collections.Generic;
using Xunit;

namespace SuperPowerBIRefresher.Tests
{
    public class AccessTokenTests
    {
        public static IEnumerable<object[]> FutureExpirationDates = new List<object[]>
        {
            new object[]{ DateTimeOffset.UtcNow.AddDays(1) },
            new object[]{ DateTimeOffset.UtcNow.AddHours(1) },
            new object[]{ DateTimeOffset.UtcNow.AddMinutes(30) }
        };


        public static IEnumerable<object[]> ElapsedExpirationDates = new List<object[]>
        {
            new object[]{ DateTimeOffset.UtcNow.AddDays(-1) },
            new object[]{ DateTimeOffset.UtcNow.AddHours(-2) },
            new object[]{ DateTimeOffset.UtcNow.AddMinutes(-30) },
            new object[]{ DateTimeOffset.UtcNow.AddMinutes(AccessToken.OffsetMinutes).AddMinutes(-5) },
        };

        public static IEnumerable<object[]> FutureExpirationDatesWithinOffsetRange = new List<object[]>
        {
            new object[]{ DateTimeOffset.UtcNow.AddMinutes(AccessToken.OffsetMinutes).AddMinutes(-15) },
            new object[]{ DateTimeOffset.UtcNow.AddMinutes(AccessToken.OffsetMinutes).AddMinutes(-5) },
        };


        [Theory]
        [MemberData(nameof(FutureExpirationDates), DisableDiscoveryEnumeration = true)]
        public void IsTokenExpired_PassAFutureExpirationDate_ShouldSayTokenIsNotExpired(DateTimeOffset expiresOn)
        {
            var accessToken = GetAccessToken(expiresOn);

            Assert.False(accessToken.IsTokenExpired());
        }

        [Theory]
        [MemberData(nameof(ElapsedExpirationDates), DisableDiscoveryEnumeration = true)]
        public void IsTokenExpired_PassAnElapsedExpirationDate_ShouldSayTokenIsExpired(DateTimeOffset expiresOn)
        {
            var accessToken = GetAccessToken(expiresOn);

            Assert.True(accessToken.IsTokenExpired());
        }

        [Theory]
        [MemberData(nameof(FutureExpirationDatesWithinOffsetRange), DisableDiscoveryEnumeration = true)]
        public void IsTokenExpired_PassAFutureExpirationDateWhichIsInTheExpirationOffsetRange_ShouldSayTokenIsExpired(DateTimeOffset expiresOn)
        {
            var accessToken = GetAccessToken(expiresOn);

            Assert.True(accessToken.IsTokenExpired());
        }

        private AccessToken GetAccessToken(DateTimeOffset expiresOn) => new AccessToken(string.Empty, expiresOn);
    }
}
