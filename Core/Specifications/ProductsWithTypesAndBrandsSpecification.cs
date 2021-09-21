using System;
using System.Linq.Expressions;
using Core.Entities;

namespace Core.Specifications
{
    public class ProductsWithTypesAndBrandsSpecification: BaseSpecification<Product> 
    {
        public ProductsWithTypesAndBrandsSpecification(ProductSpecParams productParams): 
            base(GetCriteria(productParams.Search, productParams.BrandId, productParams.TypeId))
        {
            AddInclude( p => p.ProductBrand );
            AddInclude( p => p.ProductType );         
            AddOrderBy( p => p.Name);   
            ApplyPaging( productParams.PageSize * (productParams.PageIndex-1), productParams.PageSize);            
            
            if(!string.IsNullOrEmpty(productParams.Sort)) 
            {
                switch(productParams.Sort) 
                {
                    case "priceAsc": 
                        AddOrderBy( p => p.Price);
                        break;
                    case "priceDesc": 
                        AddOrderByDescending( p => p.Price);
                        break;  
                    default:
                        break;                          
                }
            }
        }

        public ProductsWithTypesAndBrandsSpecification(int id): base(p => p.Id == id)
        {
            AddInclude( p => p.ProductBrand );
            AddInclude( p => p.ProductType );
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