public class LikesParams : PaginParams
{
    public string MemberId { get; set; } = "";
    public string Predicate { get; set; } = "liked";
}