public class MessageParams : PaginParams
{
    public string? MemberId { get; set; }
    public string Container { get; set; } = "Inbox";
}

