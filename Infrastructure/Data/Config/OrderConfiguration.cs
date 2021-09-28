using System;
using Core.Entities.OrderAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Config
{
  public class OrderConfiguration : IEntityTypeConfiguration<Order>
  {
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        //Owned Entity
        builder.OwnsOne(o => o.ShipToAddress, b =>
        {
            //b - Address Builder, could configure the entire Owned ENtity (Address) here
            b.WithOwner();
            //...including requirer properties, value contraints, etc...
            //b.Property( a => a.LastName).IsRequired();
        
        });

        //This should also work - .WithOwner() - configures address to have no navigation property to owner
        //builder.OwnsOne(o => o.ShipToAddress).WithOwner();

        //Conversion between Enum type ans String
        builder.Property(o => o.Status).HasConversion( 
            os => os.ToString(), //Enum=>String
            s => (OrderStatus) Enum.Parse<OrderStatus>(s) //String=>Enum
        );

        builder.Property(o => o.SubTotal).HasColumnType("decimal(18,2)");

        //builder.Property(o => o.DeliveryMethod).IsRequired();
        builder.HasOne(o => o.DeliveryMethod)
          .WithMany()
          .IsRequired()
          .HasForeignKey(o => o.DeliveryMethodId);

        //Related Entities
        builder.HasMany(o => o.OrderItems)
          .WithOne()
          .IsRequired()
          .OnDelete(DeleteBehavior.Cascade);

    }
  }
}