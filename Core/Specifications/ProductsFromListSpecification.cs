using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Core.Entities;

namespace Core.Specifications
{
    public class ProductsFromListSpecification: BaseSpecification<Product> 
    {

        public ProductsFromListSpecification(List<int> products): 
            base(GetCriteria(products))
        {
        }

        private static Expression<Func<Product, bool>> GetCriteria(List<int> products)
        {
            return p => products.Contains(p.Id);
        }
    }
}