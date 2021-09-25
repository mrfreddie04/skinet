using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Identity
{
    public class AppIdentityDbContextSeed
    {
         public static async Task SeedUserAsync(UserManager<AppUser> userManager) 
         {
             if(! await userManager.Users.AnyAsync()) 
             {
                //seed users
                var user = new AppUser() 
                {
                    DisplayName = "Bob",
                    Email ="bob@test.com",
                    UserName ="bob@test.com",
                    Address = new Address()
                    {
                        FirstName = " Bob",
                        LastName = "Bobbity",
                        Street = "123 Main St",
                        City = "New York",
                        State = "NY",
                        ZipCode = "10310"
                    }
                };

                await userManager.CreateAsync(user, "Apteka$1");
             }
         }
    }
}