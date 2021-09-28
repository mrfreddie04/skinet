using System;
using Core.Entities.OrderAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Config
{
    public class OrderItemConfiguration : IEntityTypeConfiguration<OrderItem>
    {
        public void Configure(EntityTypeBuilder<OrderItem> builder)
        {
            builder.OwnsOne(oi => oi.ItemOrdered, b =>
            {
                //b - ProductItemOrdered Builder, could configure the entire Owned Entity (ProductItemOrdered) here
                b.WithOwner();
                //...including requirer properties, value contraints, etc...
                b.Property( poi => poi.Name).IsRequired();        
            });
            
            builder.Property(oi => oi.Price).HasColumnType("decimal(18,2)");
        }
    }
}