using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Dtos;
using API.Errors;
using API.Extensions;
using AutoMapper;
using Core.Entities.Identity;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;

        public AccountController(
            UserManager<AppUser> userManager, 
            SignInManager<AppUser> signInManager,
            ITokenService tokenService,
            IMapper mapper
        )
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
            _mapper = mapper;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserReadDto>> GetCurrentUser()
        {
            // var email = User.FindFirstValue(ClaimTypes.Email);
            // //You can also obtain ClaimsPrincipal from HttpContext (http context for the executing action)
            // //var email1 = HttpContext.User?.Claims?.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            // var user = await _userManager.FindByEmailAsync(email);
            
            var user = await _userManager.FindByEmailFromClaimsPrincipal(User);

            if(user == null) return NotFound(new ApiResponse(404));

            var userDto = new UserReadDto() 
            {
                Email = user.Email,
                DisplayName = user.DisplayName,
                Token = _tokenService.CreateToken(user)
            };
            
            return Ok(userDto);            
        }

        [HttpGet("emailexists")]
        public async Task<ActionResult<bool>> CheckEmailExists([FromQuery] string email)        
        {
            return Ok(await CheckEmailExistsAsync(email));
        }        

        [Authorize]
        [HttpGet("address")]
        public async Task<ActionResult<AddressDto>> GetUserAddress()        
        {
            // var email = User.FindFirstValue(ClaimTypes.Email);
            // var user = await _userManager.FindByEmailAsync(email);
            var user = await _userManager.FindByEmailWithAddressAsync(User);

            return Ok(_mapper.Map<Address,AddressDto>(user.Address));
        }            

        [Authorize]
        [HttpPut("address")]       
        public async Task<ActionResult<AddressDto>> UpdateUserAddress(AddressDto address)        
        {
            // var email = User.FindFirstValue(ClaimTypes.Email);
            // var user = await _userManager.FindByEmailAsync(email);
            var user = await _userManager.FindByEmailWithAddressAsync(User);
            user.Address = _mapper.Map<AddressDto,Address>(address, user.Address);
            var result = await _userManager.UpdateAsync(user);

            if(!result.Succeeded)
                return BadRequest(new ApiResponse(400, "Problem updating the user"));

            return Ok(_mapper.Map<Address,AddressDto>(user.Address));
        }             

        [HttpPost("login")]
        public async Task<ActionResult<UserReadDto>> UserLogIn(UserLoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);

            if(user == null) return Unauthorized(new ApiResponse(401));

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

            if(!result.Succeeded) return Unauthorized(new ApiResponse(401));

            var userDto = new UserReadDto() 
            {
                Email = user.Email,
                DisplayName = user.DisplayName,
                Token = _tokenService.CreateToken(user)
            };
            
            return Ok(userDto);
        }


        [HttpPost("register")]
        public async Task<ActionResult<UserReadDto>> UserRegister(UserRegisterDto registerDto)
        {
            if(await CheckEmailExistsAsync(registerDto.Email))
            {
                return BadRequest(new ApiValidationErrorResponse() {
                    Errors = new [] {"Email address is in use"} 
                }); 
            }

            var user = new AppUser() 
            {
                Email = registerDto.Email,
                DisplayName = registerDto.DisplayName,
                UserName = registerDto.Email,
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if(!result.Succeeded) return BadRequest(new ApiResponse(400)); 

            var userDto = new UserReadDto() 
            {
                Email = user.Email,
                DisplayName = user.DisplayName,
                Token = _tokenService.CreateToken(user)
            };
            
            return Ok(userDto);
        }        

        private async Task<bool> CheckEmailExistsAsync(string email)   
        {
            return ( await _userManager.FindByEmailAsync(email) != null);
       
        }
        
    }
}