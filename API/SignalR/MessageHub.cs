using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

[Authorize]
public class MessageHub(IMessageRepository _messageRepository,
IMemberRepository _memberReopsitory, IHubContext<PresenceHub> presenceHub) : Hub
{


    public override async Task OnConnectedAsync()
    {
        var httpContext = Context.GetHttpContext();
        var otherUser = httpContext?.Request.Query["userId"].ToString()
            ?? throw new HubException("Other user not found");

        var groupName = GetGroupName(GetUserId(), otherUser);
        await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        await AddToGroup(groupName);
        var messages = await _messageRepository.GetMessageThread(GetUserId(), otherUser);

        await Clients.Group(groupName).SendAsync("ReceiveMessageThread", messages);
    }


    public async Task SendMessage(CreateMessageDto createMessageDto)
    {
        var sender = await _memberReopsitory.GetMemberByIdAsync(GetUserId());
        var recipient = await _memberReopsitory.GetMemberByIdAsync(createMessageDto.RecipientId);

        if (recipient == null || sender == null || sender.Id == createMessageDto.RecipientId)
            throw new HubException("Cannot send message");

        var message = new Message
        {
            SenderId = sender.Id,
            RecipientId = recipient.Id,
            Content = createMessageDto.Content
        };


        var groupName = GetGroupName(sender.Id, recipient.Id);
        var group = await _messageRepository.GetMessageGroup(groupName);
        var userInGroup = group != null && group.Connections.Any(x => x.UserId == message.RecipientId);
        if (userInGroup)
        {
            message.DateRead = DateTime.UtcNow;
        }

        _messageRepository.AddMessage(message);

        if (await _messageRepository.SaveAllAsync())
        {
            await Clients.Group(groupName).SendAsync("NewMessage", message.ToDto());

            var connections = await PresenceTracker.GetConnectionsForUser(recipient.Id);

            if (connections != null && connections.Count > 0 && !userInGroup)
            {
                await presenceHub.Clients.Clients(connections)
                    .SendAsync("NewMessageReceived", message.ToDto());
            }
        }


    }


    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await _messageRepository.RemoveConnection(Context.ConnectionId);
        await base.OnDisconnectedAsync(exception);
    }

    private static string GetGroupName(string? caller, string? other)
    {
        var stringCompare = string.CompareOrdinal(caller, other) < 0;
        return stringCompare ? $"{caller}-{other}" : $"{other}-{caller}";
    }


    private async Task<bool> AddToGroup(string groupName)
    {
        var group = await _messageRepository.GetMessageGroup(groupName);
        var connection = new Connection(Context.ConnectionId, GetUserId());

        if (group == null)
        {
            group = new Group(groupName);
            _messageRepository.AddGroup(group);
        }

        group.Connections.Add(connection);

        return await _messageRepository.SaveAllAsync();
    }


    private string GetUserId()
    {
        return Context.User?.GetMemberId()
            ?? throw new HubException("Cannot get member id");
    }
}