using System;
using System.Threading.Tasks;
using System.IO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using Stripe;
using Core.Entities;
using Core.Interfaces;
using API.Errors;
using Order = Core.Entities.OrderAggregate.Order;

namespace API.Controllers
{
  public class PaymentsController : BaseApiController
    {
        private readonly IPaymentService _paymentService;
        private readonly ILogger<PaymentsController> _logger;
        private readonly IConfiguration _config;
        private readonly string _whSecret; 
        public PaymentsController(
            IPaymentService paymentService, 
            ILogger<PaymentsController> logger,
            IConfiguration config
        )
        {
            _paymentService = paymentService;
            _logger = logger;
            _config = config;
            _whSecret = _config.GetSection("StripeSettings:WhSecret").Value;
        }

        [Authorize]
        [HttpPost("{basketId}")]
        public async Task<ActionResult<CustomerBasket>> CreateOrUpdatePaymentIntent(string basketId) 
        {
            var basket = await _paymentService.CreateOrUpdatePaymentIntent(basketId);

            if(basket == null)
                return BadRequest(new ApiResponse(400, "Problem with your basket"));

            return Ok(basket);
        }

        [HttpPost("webhook")]
        public async Task<ActionResult> StripeWebhook()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
            
            //WhSecret verification is like checking JWT signature.
            var stripeEvent = EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"], _whSecret);

            PaymentIntent intent;
            Order order; 

            Console.WriteLine($"Stripe.Event ${stripeEvent.Type}");

            switch(stripeEvent.Type) 
            {
                case "payment_intent.succeeded": 
                    intent = (PaymentIntent) stripeEvent.Data.Object;
                    Console.WriteLine($"Payment Intent ${intent.Id}");
                    _logger.LogInformation("Payment Succeeded: ", intent.Id);
                    //TODO: update order with new status
                    order = await _paymentService.UpdateOrderPaymentSucceeded(intent.Id); 
                    _logger.LogInformation("Order Updated: ", order?.Id);            
                    break;
                case "payment_intent.payment_failed":     
                    intent = (PaymentIntent) stripeEvent.Data.Object;
                    _logger.LogInformation("Payment Failed: ", intent.Id);
                    //TODO: update order with new status
                    order = await _paymentService.UpdateOrderPaymentFailed(intent.Id);
                    _logger.LogInformation("Order Updated: ", order?.Id);   
                    break;                    
            };
        
            //confirm we received
            return new EmptyResult();
        }
    }
}