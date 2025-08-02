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
        public const string SearchSuppliers = "owners";
        public const string GetSupplierById = $"{SearchSuppliers}/{{id:long}}";
        public const string GetAllSuppliers = $"{SearchSuppliers}/all";
        
        // Command endpoints
        public const string Create = "/";
        public const string Update = GetById;
        public const string CreateSupplier = SearchSuppliers;
        public const string UpdateSupplier = GetSupplierById;
        public const string DeleteSupplier = GetSupplierById;
    }
}