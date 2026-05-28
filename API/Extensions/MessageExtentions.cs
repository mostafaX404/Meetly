using System.Linq.Expressions;

public static class MessageExtentions
{
    public static MessageDto ToDto(this Message message)
{
    return new MessageDto
    {
        Id = message.Id,
        SenderId = message.SenderId,
        SenderDisplayName = message.Sender.DisplayName,
        SenderImageUrl = message.Sender.ImageUrl,
        RecipientId = message.RecipientId,
        RecipientDisplayName = message.Recipient.DisplayName,
        RecipientImageUrl = message.Recipient.ImageUrl,
        Content = message.Content,
        DateRead = message.DateRead,
        MessageSent = message.MessageSent
    };
}
    

    public static Expression<Func<Message, MessageDto>> ToDtoProjection()
{
    return message => new MessageDto
    {
        Id = message.Id,
        SenderId = message.SenderId,
        SenderDisplayName = message.Sender.DisplayName,
        SenderImageUrl = message.Sender.ImageUrl,
        RecipientId = message.RecipientId,
        RecipientDisplayName = message.Recipient.DisplayName,
        RecipientImageUrl = message.Recipient.ImageUrl,
        Content = message.Content,
        DateRead = message.DateRead,
        MessageSent = message.MessageSent
    };
}
}