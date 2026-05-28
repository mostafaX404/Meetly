
    public interface IMessageRepository
    {

        void AddMessage (Message message);
        void DeleteMessage (Message message);

        Task<Message?> GetMessage(string messageId);

        Task<PaginationResult<MessageDto>> GetMessagesForMember (MessageParams messageParams);

        Task<IReadOnlyList<MessageDto>> GetMessageThread(string currentMemberId , string recipientId);

        Task<bool> SaveAllAsync();




    

}
