using System.Security.Claims;
using Marlo.Common.EntityFrameworkCore.Interceptors.Models;

namespace shs.Api.Infrastructure
{
    public class AuditableProvider : IAuditableUserDataProvider
    {
        private readonly ClaimsPrincipal? _claimsPrincipal;

        public AuditableProvider(IHttpContextAccessor httpContextAccessor)
        {
            _claimsPrincipal = httpContextAccessor.HttpContext?.User;
        }

        public string Username
        {
            get
            {
                if (_claimsPrincipal is null) return "Unknown";
                return _claimsPrincipal.Identity?.Name ?? "Unknown";
            }
        }

    }
}
