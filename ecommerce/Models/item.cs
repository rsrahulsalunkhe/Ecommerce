namespace ecommerce.Models
{
  public class item
  {
    public int Id { get; set; }
    public required string Name { get; set; }
    public string? Image { get; set; }
    public int Price { get; set; }
    public int Rating { get; set; }
  }
}
