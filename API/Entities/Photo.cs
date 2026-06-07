using System.Text.Json.Serialization;

public class Photo
{
    
    public int Id { get; set; }

    [JsonPropertyName("url")]
    public required string URL { get; set; }
    public string? PublicId { get; set; }

    //Nav Prop.
    [JsonIgnore]
    public Member member { get; set; }=null!;

    public string MemberId { get; set; } = null!;
}