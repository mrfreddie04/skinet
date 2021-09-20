using API.Errors;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BuggyController : BaseApiController
    {
        private readonly StoreContext _context;

        public BuggyController(StoreContext context)
        {
            _context = context;                        
        }

        [HttpGet("notfound")]
        public IActionResult GetNotFoundRequest()
        {
            var thing = _context.Products.Find(42);

            if(thing == null) 
            {
                return NotFound(new ApiResponse(404));
            }

            return Ok();
        }

        [HttpGet("badrequest")]
        public IActionResult GetBadRequest()
        {
            return BadRequest(new ApiResponse(400)); //400
        }        

        [HttpGet("servererror")]
        public IActionResult GetServerError()
        {
            var thing = _context.Products.Find(42);

            //will throw exception
            var thingToReturn = thing.ToString();

            return Ok();
        }

        [HttpGet("badrequest/{id}")]
        public IActionResult GetValidationErrort(int id)
        {
            //we will pass a string - it should return validation error
            return Ok();
        }                        
    }
}