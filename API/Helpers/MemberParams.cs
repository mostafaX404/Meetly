
public class MemberParams : PaginParams
{

    public string? Gender { get; set; }
    public string? CurrentMemberId { get; set; }
    public int MinAge { get; set; } = 10 ;
    public int MaxAge { get; set; } = 100;

    public string OrderBy { get; set; } = "LastActive";

}