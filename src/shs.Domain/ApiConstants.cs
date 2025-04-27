namespace shs.Domain;

public static class ApiConstants
{
    public static class Routes
    {
        public const string Base = "/api";
    }
    
    public static class ConsignmentRoutes
    {
        public const string Path = $"{Routes.Base}/consignments";
        public const string Consignments = "";
        public const string ConsignmentById = "{id:long}";
        public const string Owners = "owners";
        public const string OwnersById = $"{Owners}/{{id:long}}";
        public const string OwnersAll = $"{Owners}/all";
        public const string Create = "/";
    }
}