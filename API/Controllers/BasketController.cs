using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BasketController : BaseApiController 
    {
        private readonly IBasketRepository _basketRepo;

        public BasketController(IBasketRepository basketRepo)
        {            
            _basketRepo = basketRepo;
        }

        [HttpGet]
        public async Task<ActionResult<CustomerBasket>> GetBasketById([FromQuery] string id)
        {
            //Console.WriteLine($"Basket Id: {id}");
            var basket = await _basketRepo.GetBasketAsync(id);
            return Ok(basket ?? new CustomerBasket(id));
        }

        [HttpPost]
        public async Task<ActionResult<CustomerBasket>> UpdateBasket(CustomerBasket basket)
        {
            var updatedBasket = await _basketRepo.UpdateBasketAsync(basket);
            return Ok(updatedBasket);// ?? new CustomerBasket(basket.Id));
        }        

        [HttpDelete]
        public async Task<ActionResult<CustomerBasket>> DeleteBasket([FromQuery] string id)
        {
            await _basketRepo.DeleteBasketAsync(id);
            return Ok();
        }             
    }    
}