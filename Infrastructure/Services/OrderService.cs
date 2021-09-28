using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Core.Specifications;

namespace Infrastructure.Services
{
  public class OrderService : IOrderService
  {
    private readonly IUnitOfWork _unitOfWork;
    private readonly IBasketRepository _basketRepo;

    public OrderService(
      IBasketRepository basketRepo,
      IUnitOfWork unitOfWork
    )
    {
      _unitOfWork = unitOfWork;
      _basketRepo = basketRepo;
    }

    public async Task<Order> CreateOrderAsync(string buyerEmail, int deliveryMethodId, string basketId, Address shippingAddress)
    {
      //TODO:
      //get basket from basket repo (we will trust only items & quantity), we will get price from db
      //get products from product repo (based on id from the basket)
      //get delivery method from repo (based on id)
      //calc subtotal
      //create order items      
      //create order and add items
      //save order to db
      //if successful, then delete the basket
      //return the order

      //1. get basket from basket repo 
      var basket = await _basketRepo.GetBasketAsync(basketId);

      //2. get products from product repo and build oderItems list

      // Using specification pattern
      // var items = basket.Items.Select( item => item.Id).ToList();
      // var specs = new ProductsFromListSpecification(items);
      // var products = await _productsRepo.ListAsync(specs);
          
      var orderItems = new List<OrderItem>();
      foreach(var item in basket.Items)
      {
        //For specification pattern
        //products.First( p => p.Id == item.Id); 
        var productItem = await _unitOfWork.Repository<Product>().GetByIdAsync(item.Id);
        var productItemOrdered = new ProductItemOrdered(productItem.Id,productItem.Name,productItem.PictureUrl);
        var orderItem = new OrderItem(productItemOrdered, productItem.Price, item.Quantity);
        orderItems.Add(orderItem);
      }

      //3. get delivery method from repo (based on id)
      var deliveryMethod = await _unitOfWork.Repository<DeliveryMethod>().GetByIdAsync(deliveryMethodId);

      //4. calculate subtotal
      var subtotal = orderItems.Sum( oi => oi.Price * oi.Quantity);

      //5. Create Order object
      var order = new Order(orderItems, buyerEmail, shippingAddress, deliveryMethod.Id, subtotal);

      //6. Add order to db - need to create functionality to add 
      _unitOfWork.Repository<Order>().Add(order);

      //7. Save to DB
      var result = await _unitOfWork.Complete();

      if(result <= 0)
        return null;

      //8. Delete the basket
      await _basketRepo.DeleteBasketAsync(basketId);  

      return order;
    }

    public async Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethodsAsync()
    {
      return await _unitOfWork.Repository<DeliveryMethod>().ListAllAsync();
    }

    public async Task<Order> GetOrderByIdAsync(int id, string buyerEmail)
    {
      var spec = new OrdersWithItemsOrderingSpecification(id, buyerEmail);
      return await _unitOfWork.Repository<Order>().GetEntityWithSpec(spec);
    }

    public async Task<IReadOnlyList<Order>> GetOrdersForUserAsync(string buyerEmail)
    {
      var spec = new OrdersWithItemsOrderingSpecification(buyerEmail);
      return await _unitOfWork.Repository<Order>().ListAsync(spec);
    }
  }
}