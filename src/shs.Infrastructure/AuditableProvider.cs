using System.Security.Claims;
using Marlo.Common.EntityFrameworkCore.Interceptors.Models;
using Microsoft.AspNetCore.Http;

namespace shs.Infrastructure
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
