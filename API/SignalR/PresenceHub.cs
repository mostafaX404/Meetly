using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;


[Authorize]
public class PresenceHub(PresenceTracker presenceTracker) : Hub
{
    public override async Task OnConnectedAsync()
    {
        await presenceTracker.UserConnected(GetUserId(),Context.ConnectionId);

        await Clients.Others.SendAsync("UserOnline",GetUserId());

        var connectedUsers = await presenceTracker.GetOnlineUsers();

        await Clients.Caller.SendAsync("GetOnlineUsers",connectedUsers);

    }


    public override async Task OnDisconnectedAsync(Exception? exception)
    {
    
        await presenceTracker.UserDisconnected(GetUserId(), Context.ConnectionId);


        await Clients.Others.SendAsync("UserOffline",GetUserId());

        await base.OnDisconnectedAsync(exception);
    }




private string GetUserId()
{
    return Context.User?.GetMemberId() 
        ?? throw new HubException("Cannot get member id");
}
}