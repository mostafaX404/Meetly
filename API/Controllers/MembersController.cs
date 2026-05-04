using System.Security.Claims;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class MembersController(IMemberRepository memberRepository, IPhotoService photoService) : BaseApiController
    {

        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<Member>>> GetMembers()
        {
            return Ok(await memberRepository.GetMembersAsync());
        }

        [HttpGet("check")]

        // public async Task<IActionResult> Check()
        // {
        //     var count = await context.Users.CountAsync();
        //     return Ok(new { Count = count });
        // }

        [HttpGet("{id}")]
        public async Task<ActionResult<Member>> GetMember(string id)
        {
            var member = await memberRepository.GetMemberByIdAsync(id);

            if (member == null) return NotFound();

            return member;
        }

        [HttpGet("{id}/photos")]
        public async Task<ActionResult<IReadOnlyList<Photo>>> GetMemberPhoto(string id)
        {
            return Ok(await memberRepository.GetPhotosForMemberAsync(id));
        }

        [HttpPut()]
        public async Task<ActionResult> UpdateMember(UpdateMemberDto memberUpdateDto)
        {
            var memberId = User.GetMemberId();

            var member = await memberRepository.GetMemberForUpdate(memberId);

            if (member == null) return BadRequest("Could not get member");

            member.DisplayName = memberUpdateDto.DisplayName ?? member.DisplayName;
            member.Description = memberUpdateDto.Description ?? member.Description;
            member.City = memberUpdateDto.City ?? member.City;
            member.Country = memberUpdateDto.Country ?? member.Country;

            member.User.DisplayName = memberUpdateDto?.DisplayName ?? member.User.DisplayName;

            memberRepository.Update(member); // optional

            if (await memberRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to update member");
        }

        [HttpPost("add-photo")]
        public async Task<ActionResult<Photo>> AddPhoto([FromForm] IFormFile file)
        {
            var member = await memberRepository.GetMemberForUpdate(User.GetMemberId());

            if (member is null) return BadRequest("Cannot Find User");

            var result = await photoService.UploadPhotoAsync(file);

            if (result.Error is not null) return BadRequest("Failed to upload photo");

            var photo = new Photo
            {
                PublicId = result.PublicId,
                URL = result.SecureUrl.AbsoluteUri,
                MemberId = User.GetMemberId()
            };

            if (member.ImageUrl == null)
            {
                member.ImageUrl = photo.URL;
                member.User.ImageUrl = photo.URL;
            }

            
            member.Photos.Add(photo);

            if (await memberRepository.SaveAllAsync()) return photo;

            return BadRequest("Problem adding photo");
        }

        [HttpPut("set-main-image/{imageId}")]
        public async Task<ActionResult> SetMainImage(int imageId)
        {

            var member = await memberRepository.GetMemberForUpdate(User.GetMemberId());

            if (member is null) return BadRequest("No user with this token");

            var photo = member.Photos.SingleOrDefault(x => x.Id == imageId);

            if (photo is null || photo?.URL == member.ImageUrl) return BadRequest("Cannot set this photo");

            member.ImageUrl = photo?.URL;
            member.User.ImageUrl = photo?.URL;

            if (await memberRepository.SaveAllAsync()) return NoContent();

            return BadRequest("problem at setting photo");

        }


        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var member = await memberRepository.GetMemberForUpdate(User.GetMemberId());

            if (member == null) return BadRequest("Cannot get member from token");

            var photo = member.Photos.SingleOrDefault(x => x.Id == photoId);

            if (photo == null || photo.URL == member.ImageUrl)
            {
                return BadRequest("This photo cannot be deleted");
            }

            if (photo.PublicId != null)
            {
                var result = await photoService.DeletePhotoAsync(photo.PublicId);
                if (result.Error != null) return BadRequest(result.Error.Message);
            }

            member.Photos.Remove(photo);

            if (await memberRepository.SaveAllAsync()) return Ok();

            return BadRequest("Problem deleting the photo");
        }

    }



}
