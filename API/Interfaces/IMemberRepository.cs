public interface IMemberRepository
{
    void Update(Member member);
    Task<bool> SaveAllAsync();
    Task<PaginationResult<Member>> GetMembersAsync(MemberParams memberParams);
    Task<Member?> GetMemberByIdAsync(string id);
    Task<Member?> GetMemberForUpdate(string id);
    Task<IReadOnlyList<Photo>> GetPhotosForMemberAsync(string memberId);
}