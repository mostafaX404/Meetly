using API.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

public class MessageController(IMessageRepository messageRepository , IMemberRepository memberRepository) : BaseApiController
{


[Authorize]
[HttpPost]

public async Task<ActionResult<MessageDto>> CreateMessage(CreateMessageDto createMessageDto)
    {

        var sender = await memberRepository.GetMemberByIdAsync(User.GetMemberId());

        var recipient = await memberRepository.GetMemberByIdAsync(createMessageDto.RecipientId);

        if(sender == null || recipient == null || sender.Id == createMessageDto.RecipientId)
        {
            return BadRequest("Cannot send the message");
        }

        var message = new Message
        {
            Content = createMessageDto.Content ,
            RecipientId = createMessageDto.RecipientId ,
            SenderId = sender.Id        
        };

        messageRepository.AddMessage(message);
        if(await messageRepository.SaveAllAsync()) return Ok(message.ToDto());


        return BadRequest("Cannot send the message");

    }

[HttpGet]
public async Task<ActionResult<PaginationResult<MessageDto>>> GetMessagesByContainer(
    [FromQuery] MessageParams messageParams)
{
    messageParams.MemberId = User.GetMemberId();

    return await messageRepository.GetMessagesForMember(messageParams);
}

[HttpGet("thread/{recipientId}")]
public async Task<ActionResult<IReadOnlyList<MessageDto>>> GetMessageThread(string recipientId)
{
    return Ok(await messageRepository.GetMessageThread(User.GetMemberId(), recipientId));
}

[HttpDelete("{id}")]
public async Task<ActionResult> DeleteMessage(string id)
{
    var memberId = User.GetMemberId();

    var message = await messageRepository.GetMessage(id);

    if (message == null) return BadRequest("Cannot delete this message");

    if (message.SenderId != memberId && message.RecipientId != memberId)
        return BadRequest("You cannot delete this message");

    if (message.SenderId == memberId) message.SenderDelete = true;
    if (message.RecipientId == memberId) message.RecipientDelete = true;

    if (message is { SenderDelete: true, RecipientDelete: true })
    {
        messageRepository.DeleteMessage(message);
    }

    if (await messageRepository.SaveAllAsync()) return Ok();

    return BadRequest("Problem deleting the message");
}
}