using Microsoft.EntityFrameworkCore;
using Core.Entities;
using Infrastructure.Data.Config;
using System.Reflection;
using System.Linq;
using System;
using Core.Entities.OrderAggregate;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Infrastructure.Data
{
  public class StoreContext: DbContext
  {
    public StoreContext(DbContextOptions<StoreContext> options): base(options)
    {            
    }

    public DbSet<Product> Products { get; set; }
    public DbSet<ProductType> ProductTypes { get; set; }
    public DbSet<ProductBrand> ProductBrands { get; set; }
    public DbSet<Order> Orders { get; set;}
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<DeliveryMethod> DeliveryMethods { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      base.OnModelCreating(modelBuilder);

      //modelBuilder.ApplyConfiguration(new ProductConfiguration());
      //Apply configurations from all IEntityTypeConfiguration instances defined in the provided assembly
      modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

      //check db provider - Database is a property of DbContext
      if(Database.ProviderName == "Microsoft.EntityFrameworkCore.Sqlite")
      {
        //convert values when requested from db
        foreach(var entityType in modelBuilder.Model.GetEntityTypes()) 
        {;
          var propertiesDecimal = entityType.ClrType.GetProperties().Where( p => p.PropertyType == typeof(decimal));
          foreach(var property in propertiesDecimal)
          {                        
              modelBuilder.Entity(entityType.Name).Property(property.Name).HasConversion<double>();
          }

          var propertiesDateTimeOffset = entityType.ClrType.GetProperties().Where( p => p.PropertyType == typeof(DateTimeOffset));
          foreach(var property in propertiesDateTimeOffset)
          {                        
              modelBuilder.Entity(entityType.Name).Property(property.Name).HasConversion(new DateTimeOffsetToBinaryConverter());
          }          
        }
      }
    }
  }
}