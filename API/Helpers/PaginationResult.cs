using Microsoft.CodeAnalysis;
using Microsoft.EntityFrameworkCore;

public class PaginationResult<T>
{
    
    public PaginationMetaData MetaData { get; set; } = default!;

    public List<T> Items { get; set; } = default!;


}

public class PaginationMetaData
{
    public int TotalPages { get; set; }
    public int CurrentPage { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }
}

public class PaginationHelper
{
    
    public static async Task<PaginationResult<T>> CreateAsync<T>(IQueryable<T> query , int pageNumber , int pageSize)
    {
        
        var count = await query.CountAsync();
        var items = await query.Skip((pageNumber - 1 ) * pageSize).Take(pageSize).ToListAsync();
        
        return new PaginationResult<T>
        {
            MetaData = new PaginationMetaData
            {
                TotalPages = (int)Math.Ceiling(count / (float)pageSize),
                CurrentPage = pageNumber,
                PageSize = pageSize,
                TotalCount = count
            }
            ,Items = items     
            
        };

    } 
}