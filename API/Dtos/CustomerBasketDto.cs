using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace API.Dtos
{
  public class CustomerBasketDto
    {
        [Required]
        public string Id { get; set; } 
        public int? DeliveryMethodId { get; set; }
        public decimal ShippingPrice { get; set; }
        public string ClientSecret { get; set; }
        public string PaymentIntentId { get; set; }        
        public List<BasketItemDto> Items { get; set; } 
    }
}