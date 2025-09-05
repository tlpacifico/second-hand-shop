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
        
        // Query endpoints
        public const string Search = "";
        public const string GetById = "{id:long}";
        
        // Command endpoints
        public const string Create = "/";
        public const string Update = GetById;
        public const string AddNewItem = "{consignmentId:long}/items";
        public const string UpdateItem = "{consignmentId:long}/items/{itemId:long}";
        public const string DeleteItem = "{consignmentId:long}/items/{itemId:long}";
    }
    
    public static class SupplierRoutes
    {
        public const string Path = $"{Routes.Base}/suppliers";
        
        // Query endpoints
        public const string Search = "";
        public const string GetById = "{id:long}";
        public const string GetAll = "all";
        
        // Command endpoints
        public const string Create = "/";
        public const string Update = GetById;
        public const string Delete = GetById;
    }
}