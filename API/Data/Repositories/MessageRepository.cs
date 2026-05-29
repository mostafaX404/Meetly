using API.Data;
using Microsoft.EntityFrameworkCore;

namespace API.Interfaces;

public class MessageRepository(AppDbContext _context) : IMessageRepository
{
    public void AddMessage(Message message)
    {
        _context.Messages.Add(message);
    }

    public void DeleteMessage(Message message)
    {
        _context.Messages.Remove(message);

    }

    public async Task<Message?> GetMessage(string messageId)
    {
       return await _context.Messages.FindAsync(messageId);
    }

    public async Task<PaginationResult<MessageDto>> GetMessagesForMember(MessageParams messageParams)
    {
        var query = _context.Messages
        .OrderByDescending(x => x.MessageSent)
        .AsQueryable();

    query = messageParams.Container switch
    {
        "Outbox" => query.Where(x => x.SenderId == messageParams.MemberId && x.SenderDelete == false),
        _ => query.Where(x => x.RecipientId == messageParams.MemberId && x.RecipientDelete == false)
    };

    var messageQuery = query.Select(MessageExtentions.ToDtoProjection());

    return await PaginationHelper.CreateAsync(messageQuery, messageParams.PageNumber, messageParams.PageSize);
    }

    public async Task<IReadOnlyList<MessageDto>> GetMessageThread(string currentMemberId, string recipientId)
    {
        await _context.Messages
        .Where(x => x.RecipientId == currentMemberId
            && x.SenderId == recipientId && x.DateRead == null)
        .ExecuteUpdateAsync(setters => setters
            .SetProperty(x => x.DateRead, DateTime.UtcNow));

    return await _context.Messages
        .Where(x => (x.RecipientId == currentMemberId && x.SenderId == recipientId && x.RecipientDelete == false)
            || (x.SenderId == currentMemberId && x.SenderDelete == false && x.RecipientId == recipientId))
        .OrderBy(x => x.MessageSent)
        .Select(MessageExtentions.ToDtoProjection())
        .ToListAsync();
    }

    public async Task<bool> SaveAllAsync()
    {
        return await _context.SaveChangesAsync() > 0 ;
    }



public void AddGroup(Group group)
    {
        _context.Groups.Add(group);
    }

    public async Task RemoveConnection(string connectionId)
    {
        await _context.Connections
            .Where(x => x.ConnectionId == connectionId)
            .ExecuteDeleteAsync();
    }

    public async Task<Connection?> GetConnection(string connectionId)
    {
        return await _context.Connections.FindAsync(connectionId);
    }

    public async Task<Group?> GetMessageGroup(string groupName)
    {
        return await _context.Groups
            .Include(x => x.Connections)
            .FirstOrDefaultAsync(x => x.Name == groupName);
    }

    public async Task<Group?> GetGroupForConnection(string connectionId)
    {
        return await _context.Groups
            .Include(x => x.Connections)
            .Where(x => x.Connections.Any(c => c.ConnectionId == connectionId))
            .FirstOrDefaultAsync();
    }



}