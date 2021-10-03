using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.IO;

namespace API.Controllers
{
    [Route("[controller]")]
    public class FallbackController : Controller
    {
        [HttpGet]
        public IActionResult Index()
        {
            return PhysicalFile(
                Path.Combine(Directory.GetCurrentDirectory(), "wwwroot","index.html"),
                "text/html"
            );
        }
    }
}