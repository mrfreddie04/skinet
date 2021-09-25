using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Dtos;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BasketController : BaseApiController 
    {
        private readonly IBasketRepository _basketRepo;
        private readonly IMapper _mapper;

        public BasketController(
            IBasketRepository basketRepo,
            IMapper mapper
        )
        {            
            _basketRepo = basketRepo;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<CustomerBasket>> GetBasketById([FromQuery] string id)
        {
            //Console.WriteLine($"Basket Id: {id}");
            var basket = await _basketRepo.GetBasketAsync(id);
            return Ok(basket ?? new CustomerBasket(id));
        }

        [HttpPost]
        public async Task<ActionResult<CustomerBasket>> UpdateBasket(CustomerBasketDto basketDto)
        {
            var basket = _mapper.Map<CustomerBasketDto,CustomerBasket>(basketDto);
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