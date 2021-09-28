using System;
using AutoMapper;
using API.Dtos;
using Core.Entities.OrderAggregate;
using Microsoft.Extensions.Configuration;

namespace API.Helpers
{
  public class OrderItemUrlResolver : IValueResolver<OrderItem, OrderItemDto, string>
  {
    private readonly IConfiguration _config;

    public OrderItemUrlResolver(IConfiguration config)    
    {
        _config = config;    
    }

    public string Resolve(OrderItem source, OrderItemDto destination, string destMember, ResolutionContext context)
    {
        if(!string.IsNullOrEmpty(source.ItemOrdered.PictureUrl)) 
        {
            string baseApi =_config["ApiUrl"];
            return $"{baseApi}{source.ItemOrdered.PictureUrl}";
        }
        return null;
    }
  }
}