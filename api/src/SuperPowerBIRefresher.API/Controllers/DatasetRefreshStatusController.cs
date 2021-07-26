using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace SuperPowerBIRefresher.API.Controllers
{
    [Route("api/refresh-statuses")]
    [ApiController]
    public class DatasetRefreshStatusController : ControllerBase
    {

        [HttpGet]
        public ActionResult<IEnumerable<string>> GetAll() => new string[] { "Unknown", "Completed", "Failed", "Disabled" };
    }
}
