using API.Controllers;
using Microsoft.AspNetCore.Mvc;

public class LikesController(IUnitOfWork uow) : BaseApiController
{

    [HttpPost("{targetMemberId}")]
    public async Task<ActionResult> ToggleLike (string targetMemberId)
    {
        var currentMemberId = User.GetMemberId();

        if(currentMemberId == targetMemberId ) return BadRequest("member cannot like himself");

        var existingLike = await uow.likeRepository.GetMemberLike(currentMemberId , targetMemberId);

        if (existingLike is null)
        {
            var like =  new MemberLikes
            {
              SourceMemberId = currentMemberId,
              TargetMemberId = targetMemberId   
            };

            uow.likeRepository.AddLike(like);
        }else
        {
           uow.likeRepository.DeleteLike(existingLike);
        };

        if (await uow.Complete()) return Ok();

        return BadRequest("failed to update list");
    }

    [HttpGet("list")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetCurrentMemberLikesIds()
    {
        var currentMemberId = User.GetMemberId();

        return Ok(await uow.likeRepository.GetCurrentMemberLikesIds(currentMemberId));
    }

[HttpGet]
public async Task<ActionResult<PaginationResult<Member>>> GetMemberLikes(
    [FromQuery] LikesParams likesParams)
{
    likesParams.MemberId = User.GetMemberId();
    var members = await uow.likeRepository.GetMemberLikes(likesParams);

    return Ok(members);
}
}