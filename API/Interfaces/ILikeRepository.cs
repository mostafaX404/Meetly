public interface ILikeRepository
{
    
    void AddLike(MemberLikes like);

    void DeleteLike(MemberLikes like);


    Task<IReadOnlyList<string>> GetCurrentMemberLikesIds(string memberId);

    Task<PaginationResult<Member?>> GetMemberLikes(LikesParams likesParams);

    Task<MemberLikes?> GetMemberLike(string sourceId,string targetId);

}