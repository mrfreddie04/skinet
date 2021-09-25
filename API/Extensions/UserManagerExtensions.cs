using System.Security.Claims;
using System.Threading.Tasks;
using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
  public static class UserManagerExtensions
    {
        public static async Task<AppUser> FindByEmailWithAddressAsync(this UserManager<AppUser> input, ClaimsPrincipal user)
        {
            // var email = user.FindFirstValue(ClaimTypes.Email);
            // return await userManager.Users.Include( u => u.Address).SingleOrDefaultAsync( u => u.Email == email);    

            var email = user.FindFirstValue(ClaimTypes.Email);
            return await input.Users.Include(x => x.Address).SingleOrDefaultAsync(x => x.Email == email);                    
        }

         public static async Task<AppUser> FindByEmailFromClaimsPrincipal(this UserManager<AppUser> input, ClaimsPrincipal user)
         {
            var email = user.FindFirstValue(ClaimTypes.Email);
            return await input.FindByEmailAsync(email);
         }
    }
}