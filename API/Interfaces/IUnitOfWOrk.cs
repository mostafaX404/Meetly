public interface IUnitOfWork
{
    
     IMemberRepository memberRepository { get; }
     ILikeRepository likeRepository { get;  }
     IMessageRepository messageRepository { get; }

    Task<bool> Complete();

    bool HasChanges();
}