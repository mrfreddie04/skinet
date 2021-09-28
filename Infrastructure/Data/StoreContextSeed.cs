using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Core.Entities;
using System;
using Core.Entities.OrderAggregate;

namespace Infrastructure.Data
{
    public class StoreContextSeed
    {
        public static async Task SeedAsync(StoreContext context, ILoggerFactory loggerFactory) 
        {
            try {
                if(!await context.ProductBrands.AnyAsync()) 
                {
                    //go from API project to SeedData folder in Infrastructure project
                    var brandsData = await File.ReadAllTextAsync("../Infrastructure/Data/SeedData/brands.json");
                    var brands = JsonSerializer.Deserialize<List<ProductBrand>>(brandsData);
                    context.ProductBrands.AddRange(brands);
                    await context.SaveChangesAsync();
                }

                if(!await context.ProductTypes.AnyAsync()) 
                {
                    //go from API project to SeedData folder in Infrastructure project
                    var typesData = await File.ReadAllTextAsync("../Infrastructure/Data/SeedData/types.json");
                    var types = JsonSerializer.Deserialize<List<ProductType>>(typesData);
                    context.ProductTypes.AddRange(types);
                    await context.SaveChangesAsync();
                }       

                if(!await context.Products.AnyAsync()) 
                {
                    //go from API project to SeedData folder in Infrastructure project
                    var productsData = await File.ReadAllTextAsync("../Infrastructure/Data/SeedData/products.json");
                    var products = JsonSerializer.Deserialize<List<Product>>(productsData);
                    context.Products.AddRange(products);
                    await context.SaveChangesAsync();
                }                  

                if(!await context.DeliveryMethods.AnyAsync()) 
                {
                    //go from API project to SeedData folder in Infrastructure project
                    var deliverMethodsData = await File.ReadAllTextAsync("../Infrastructure/Data/SeedData/delivery.json");
                    var deliverMethods = JsonSerializer.Deserialize<List<DeliveryMethod>>(deliverMethodsData);
                    context.DeliveryMethods.AddRange(deliverMethods);
                    await context.SaveChangesAsync();
                }                             
            }
            catch(Exception ex) {
                var logger = loggerFactory.CreateLogger<StoreContextSeed>();
                logger.LogError(ex.Message, "An error occured during data seeding");
            }
        }
    }
}