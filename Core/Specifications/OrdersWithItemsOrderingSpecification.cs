using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Core.Entities.OrderAggregate;

namespace Core.Specifications
{
    public class OrdersWithItemsOrderingSpecification: BaseSpecification<Order> 
    {
        public OrdersWithItemsOrderingSpecification(string email): 
            base(o => o.BuyerEmail.ToLower() == email.ToLower())
        {
            AddInclude( o => o.DeliveryMethod );
            AddInclude( o => o.OrderItems );
            AddOrderByDescending( o => o.OrderDate);
        }        
        
        public OrdersWithItemsOrderingSpecification(int id, string email): 
            base(o => o.BuyerEmail.ToLower() == email.ToLower() && o.Id == id)
        {
            AddInclude( o => o.DeliveryMethod );
            AddInclude( o => o.OrderItems );
        }             
        
        // //o => o.Id == id
        // private static Expression<Func<Order, bool>> GetCriteria(string email, int? id = null)
        // {
        //     var one = Expression.Constant(1, typeof(int));
        //     return o => 
        //         (string.IsNullOrEmpty(email) || o.BuyerEmail.ToLower() == email.ToLower()) &&
        //         (!id.HasValue || o.Id == id.Value);
        // }        
    }
}