using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using API.Dtos;
using API.Errors;
using API.Extensions;

namespace API.Controllers
{
  [Authorize]
    public class OrdersController : BaseApiController
    {
        private readonly IOrderService _orderService;
        private readonly IMapper _mapper;

        public OrdersController(
            IOrderService orderService,
            IMapper mapper
        )
        {
            _orderService = orderService;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<ActionResult<OrderReadDto>> CreateOrder(OrderDto orderDto)
        {
            var email = User.RetrieveEmailFromPrincipal();
            var address = _mapper.Map<AddressDto,Address>(orderDto.ShipToAddress);
    
            var order = await _orderService.CreateOrderAsync(email, orderDto.DeliveryMethodId, orderDto.BasketId, address);
            if(order == null)    
                return BadRequest(new ApiResponse(400,"Problem creating order"));

            return Ok(_mapper.Map<Order, OrderReadDto>(order));
        }       

        [HttpGet("{id}")]    
        public async Task<ActionResult<OrderReadDto>> GetOrderByIdForUser(int id)
        {
            var email = User.RetrieveEmailFromPrincipal();
            var order = await _orderService.GetOrderByIdAsync(id, email);
            if(order == null)
                return NotFound(new ApiResponse(404,"Order not found"));
            return Ok(_mapper.Map<Order, OrderReadDto>(order));    
        }

        [HttpGet]    
        public async Task<ActionResult<IReadOnlyList<OrderReadDto>>> GetOrdersForUser(int id)
        {
            var email = User.RetrieveEmailFromPrincipal();
            var orders = await _orderService.GetOrdersForUserAsync(email);
            return Ok(_mapper.Map<IReadOnlyList<Order>, IReadOnlyList<OrderReadDto>>(orders));    
        }        

        [HttpGet("deliverymethods")]
        public async Task<ActionResult<IReadOnlyList<DeliveryMethod>>> GetDeliveryMethods()
        {
            var deliveryMethods = await _orderService.GetDeliveryMethodsAsync();
            return Ok(deliveryMethods);    
        }          

    }
}