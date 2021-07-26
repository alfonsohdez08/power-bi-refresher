using SuperPowerBIRefresher.API.Models;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace SuperPowerBIRefresher.API
{
    class ClientComparer : EqualityComparer<Client>
    {
        public override bool Equals([AllowNull] Client x, [AllowNull] Client y)
        {
            if (x == null && y == null)
                return true;
            else if (x == null || y == null)
                return false;

            return x.Id == y.Id;
        }

        public override int GetHashCode([DisallowNull] Client obj) => obj.Id.GetHashCode();
    }
}
