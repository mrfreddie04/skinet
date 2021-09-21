using System;
using System.Linq.Expressions;
using Core.Entities;

namespace Core.Specifications
{    
    public class ProductsWithFiltersForCountSpecification: BaseSpecification<Product> 
    {

        public ProductsWithFiltersForCountSpecification(ProductSpecParams productParams): 
            base(GetCriteria(productParams.Search, productParams.BrandId, productParams.TypeId))
        {
        }

        private static Expression<Func<Product, bool>> GetCriteria(string search, int? brandId, int? typeId)
        {
            return p => 
                (string.IsNullOrEmpty(search) || p.Name.ToLower().Contains(search)) &&
                (!brandId.HasValue || p.ProductBrandId == brandId.Value) &&
                (!typeId.HasValue || p.ProductTypeId == typeId.Value);
        }
    }
}