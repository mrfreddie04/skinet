using API.Dtos;
using AutoMapper;
using Core.Entities;
using Microsoft.Extensions.Configuration;

namespace API.Helpers
{
    public class ProductUrlResolver : IValueResolver<Product, ProductReadDto, string>
    {
        private readonly IConfiguration _config;

        public ProductUrlResolver(IConfiguration config)
        {
            _config = config;
        }

        public string Resolve(Product source, ProductReadDto destination, string destMember, ResolutionContext context)
        {            
            if(!string.IsNullOrEmpty(source.PictureUrl)) 
            {
                var apiUrl = _config["ApiUrl"];
                return $"{apiUrl}{source.PictureUrl}";
            }
            return null;
        }
    }
}