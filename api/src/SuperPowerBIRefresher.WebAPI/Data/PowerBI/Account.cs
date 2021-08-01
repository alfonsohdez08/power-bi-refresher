using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace SuperPowerBIRefresher.WebAPI.Data.PowerBI
{
    class Account
    {
        public string Id { get; } = Guid.NewGuid().ToString();
        public string DisplayName { get; set; }
        public Credentials ApiCredentials { get; set; }
    }

    class AccountComparer : EqualityComparer<Account>
    {
        public override bool Equals(Account x, Account y)
        {
            if (x == null && y == null)
                return true;
            else if (x == null || y == null)
                return false;

            return x.Id == y.Id;
        }

        public override int GetHashCode([DisallowNull] Account obj) => obj.Id.GetHashCode();
    }
}
