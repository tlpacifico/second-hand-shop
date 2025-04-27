

using System.Net.Http.Json;

namespace shs.Api.Tests;

public class ApiCookieHandler : DelegatingHandler
{
    protected override async Task<HttpResponseMessage> SendAsync(
        HttpRequestMessage request,
        CancellationToken cancellationToken)
    {
        var client = new HttpClient()
        {
            BaseAddress = new Uri(TestConstants.BaseUrl)
        };
        var userData = new
        {
            email = TestConstants.TestUserId,
            password = "Password12!",
        };
        var result = await client.PostAsJsonAsync("login?useCookies=true", userData, CancellationToken.None);

        var loginResponse = await client.PostAsJsonAsync("login?useCookies=true", userData, cancellationToken);
        
        // Ensure the request was successful
        loginResponse.EnsureSuccessStatusCode();
        
        // Extract cookies from the response and add them to the outgoing request
        if (loginResponse.Headers.TryGetValues(".AspNetCore.Identity.Application", out var cookies))
        {
            foreach (var cookie in cookies)
            {
                request.Headers.Add(".AspNetCore.Identity.Application", cookie);
            }
        }

        return await base.SendAsync(request, cancellationToken);
    }
}