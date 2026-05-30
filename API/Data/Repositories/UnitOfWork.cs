using API.Data;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;

    private readonly Lazy<IMemberRepository> _memberRepository;
    private readonly Lazy<ILikeRepository> _likeRepository;
    private readonly Lazy<IMessageRepository> _messageRepository;

    public UnitOfWork(AppDbContext context)
    {
        _context = context;

        _memberRepository = new Lazy<IMemberRepository>(
            () => new MemberReopsitory(_context));

        _likeRepository = new Lazy<ILikeRepository>(
            () => new LikeRepository(_context));

        _messageRepository = new Lazy<IMessageRepository>(
            () => new MessageRepository(_context));
    }

    public IMemberRepository memberRepository => _memberRepository.Value;

    public ILikeRepository likeRepository => _likeRepository.Value;

    public IMessageRepository messageRepository => _messageRepository.Value;

    public async Task<bool> Complete()
    {
        try
        {
            return await _context.SaveChangesAsync() > 0;
        }
        catch (DbUpdateException ex)
        {
            throw new Exception("An error occured while saving changes", ex);
        }
    }

    public bool HasChanges()
    {
        return _context.ChangeTracker.HasChanges();
    }
}