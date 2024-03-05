using ecommerce.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace ecommerce.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class ItemsController : ControllerBase
  {
    private readonly itemDbContext _context;

    public ItemsController(itemDbContext context)
    {
      _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetItems([FromQuery] int page = 0, [FromQuery] int perPage = 10)
    {
      try
      {
        var result = _context.items
            .Skip(page * perPage)
            .Take(perPage)
            .ToList();

        var total = _context.items.Count();
        var totalPages = (int)Math.Ceiling((double)total / perPage);

        return Ok(new
        {
          items = result,
          total,
          page,
          perPage,
          totalPages
        });
      }
      catch (Exception ex)
      {
        Console.WriteLine(ex);
        return StatusCode(500, "Internal Server Error");
      }
    }

    [HttpPost]
    public IActionResult AddClothes([FromBody] item newItem)
    {
      try
      {
        _context.items.Add(newItem);
        _context.SaveChanges();

        return StatusCode(201, newItem);
      }
      catch (Exception ex)
      {
        Console.WriteLine(ex);
        return StatusCode(500, "Internal Server Error");
      }
    }

    [HttpPut("{id}")]
    public IActionResult UpdateClothes(int id, [FromBody] item updatedItem)
    {
      try
      {
        var existingItem = _context.items.FirstOrDefault(c => c.Id == id);
        if (existingItem == null)
        {
          return NotFound();
        }

        existingItem.Image = updatedItem.Image;
        existingItem.Name = updatedItem.Name;
        existingItem.Price = updatedItem.Price;
        existingItem.Rating = updatedItem.Rating;

        _context.SaveChanges();

        return Ok(existingItem);
      }
      catch (Exception ex)
      {
        Console.WriteLine(ex);
        return StatusCode(500, "Internal Server Error");
      }
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteClothes(int id)
    {
      try
      {
        var existingItem = _context.items.FirstOrDefault(c => c.Id == id);
        if (existingItem == null)
        {
          return NotFound();
        }

        _context.items.Remove(existingItem);
        _context.SaveChanges();

        return NoContent();
      }
      catch (Exception ex)
      {
        Console.WriteLine(ex);
        return StatusCode(500, "Internal Server Error");
      }
    }
  }
}
