 namespace shs.Domain.Security;

public interface IIdentityProvider
{
    bool IsAuthenticated();
    bool IsInRole(string role);

    Guid UserId { get; }
    
    string DriverId { get; }

    string Email { get; }


}