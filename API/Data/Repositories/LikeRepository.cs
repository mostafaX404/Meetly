
using System.Threading.Tasks;
using API.Data;
using Microsoft.EntityFrameworkCore;

public class LikeRepository(AppDbContext _context) : ILikeRepository
{
    public void AddLike(MemberLikes like)
    {
        _context.Likes.Add(like);
    }

    public void DeleteLike(MemberLikes like)
    {
        _context.Likes.Remove(like);
    }

    public async Task<IReadOnlyList<string>> GetCurrentMemberLikesIds(string memberId)
    {
        return await _context.Likes.Where(l=>l.SourceMemberId == memberId).Select(l=>l.TargetMemberId).ToListAsync();
    }

    public async Task<MemberLikes?> GetMemberLike(string sourceId, string targetId)
    {
        return await _context.Likes.FindAsync(sourceId,targetId);
    }

   public async Task<PaginationResult<Member>> GetMemberLikes(LikesParams likesParams)
{
    var query = _context.Likes.AsQueryable();
    IQueryable<Member> result;

    switch (likesParams.Predicate)
    {
        case "liked":
            result = query
                .Where(like => like.SourceMemberId == likesParams.MemberId)
                .Select(like => like.TargetMember) ;
            break;

        case "likedBy":
            result = query
                .Where(like => like.TargetMemberId == likesParams.MemberId)
                .Select(like => like.SourceMember);
            break;

        default: // mutual
            var likeIds = await GetCurrentMemberLikesIds(likesParams.MemberId);

            result = query
                .Where(x => x.TargetMemberId == likesParams.MemberId 
                    && likeIds.Contains(x.SourceMemberId))
                .Select(x => x.SourceMember);
            break;
    }

    return await PaginationHelper.CreateAsync(result, 
        likesParams.PageNumber, likesParams.PageSize);
}

    public async Task<bool> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync() > 0 ;
    }
}