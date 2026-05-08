using API.Controllers;
using Microsoft.AspNetCore.Mvc;

public class LikesController : BaseApiController
{
   private readonly ILikeRepository _likeRepository;

    public LikesController(ILikeRepository likeRepository)
    {
        _likeRepository = likeRepository;
    }

    [HttpPost("{targetMemberId}")]
    public async Task<ActionResult> ToggleLike (string targetMemberId)
    {
        var currentMemberId = User.GetMemberId();

        if(currentMemberId == targetMemberId ) return BadRequest("member cannot like himself");

        var existingLike = await _likeRepository.GetMemberLike(currentMemberId , targetMemberId);

        if (existingLike is null)
        {
            var like =  new MemberLikes
            {
              SourceMemberId = currentMemberId,
              TargetMemberId = targetMemberId   
            };

            _likeRepository.AddLike(like);
        }else
        {
           _likeRepository.DeleteLike(existingLike);
        };

        if (await _likeRepository.SaveChangesAsync()) return Ok();

        return BadRequest("failed to update list");
    }

    [HttpGet("list")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetCurrentMemberLikesIds()
    {
        var currentMemberId = User.GetMemberId();

        return Ok(await _likeRepository.GetCurrentMemberLikesIds(currentMemberId));
    }

[HttpGet]
public async Task<ActionResult<PaginationResult<Member>>> GetMemberLikes(
    [FromQuery] LikesParams likesParams)
{
    likesParams.MemberId = User.GetMemberId();
    var members = await _likeRepository.GetMemberLikes(likesParams);

    return Ok(members);
}
}