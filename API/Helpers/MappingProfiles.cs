using API.Dtos;
using AutoMapper;
using Core.Entities;
using Core.Entities.Identity;
using Core.Entities.OrderAggregate;

namespace API.Helpers
{
    public class MappingProfiles: Profile
    {
        public MappingProfiles()
        {
            CreateMap<Product, ProductReadDto>()
                .ForMember( dest => dest.ProductBrand, opt => opt.MapFrom( src => src.ProductBrand.Name))
                .ForMember( dest => dest.ProductType, opt => opt.MapFrom( src => src.ProductType.Name))
                .ForMember( dest => dest.PictureUrl, opt => opt.MapFrom<ProductUrlResolver>());

            CreateMap<Core.Entities.Identity.Address, AddressDto>();

            CreateMap<AddressDto, Core.Entities.Identity.Address>();
                // .ForMember( dest => dest.Id, opt => opt.Ignore())
                // .ForMember( dest => dest.AppUserId, opt => opt.Ignore());

            CreateMap<CustomerBasketDto, CustomerBasket>();

            CreateMap<BasketItemDto, BasketItem>();

            CreateMap<AddressDto, Core.Entities.OrderAggregate.Address>();

            CreateMap<OrderItem, OrderItemDto>()
                .ForMember( dest => dest.ProductId, opt => opt.MapFrom( src => src.ItemOrdered.ProductItemId))
                .ForMember( dest => dest.ProductName, opt => opt.MapFrom( src => src.ItemOrdered.Name))
                .ForMember( dest => dest.PictureUrl, opt => opt.MapFrom<OrderItemUrlResolver>());

            CreateMap<Order, OrderReadDto>()
                .ForMember( dest => dest.DeliveryMethod, opt => opt.MapFrom( src => src.DeliveryMethod.ShortName))
                .ForMember( dest => dest.ShippingPrice, opt => opt.MapFrom( src => src.DeliveryMethod.Price));


        }
    }
}