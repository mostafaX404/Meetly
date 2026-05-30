
using API.Data;
using Microsoft.EntityFrameworkCore;

public class MemberReopsitory(AppDbContext context) : IMemberRepository
{
    public async Task<Member?> GetMemberByIdAsync(string id)
    {
        return await context.Members.FindAsync(id);
    }

    public async Task<Member?> GetMemberForUpdate(string id)
    {
        return await context.Members.Include(x => x.User).Include(x => x.Photos).SingleOrDefaultAsync(x => x.Id == id);
    }

    public async Task<PaginationResult<Member>> GetMembersAsync(MemberParams memberParams)
    {

        var query = context.Members.AsQueryable();


        query = query.Where(m => m.Id != memberParams.CurrentMemberId);

        if (memberParams.Gender is not null) { query = query.Where(m => m.Gender == memberParams.Gender); }

        var minDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-memberParams.MaxAge - 1));
        var maxDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-memberParams.MinAge));

        query = query.Where(m=>m.DateOfBirth >=minDob && m.DateOfBirth <= maxDob );
        
        query = memberParams.OrderBy switch
        {
            "created" => query.OrderByDescending(m=>m.Created),
            _ => query.OrderByDescending(m=>m.LastActive)

        };

        Console.WriteLine(memberParams);

        return await PaginationHelper.CreateAsync(query, memberParams.PageNumber, memberParams.PageSize);
    }

    public async Task<IReadOnlyList<Photo>> GetPhotosForMemberAsync(string memberId)
    {
        return await context.Members.Where(x => x.Id == memberId).SelectMany(x => x.Photos).ToListAsync();
    }


    public void Update(Member member)
    {
        context.Entry(member).State = EntityState.Modified;
    }
}