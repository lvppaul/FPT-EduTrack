﻿using FPT_EduTrack.DataAccessLayer.Interfaces;

namespace FPT_EduTrack.DataAccessLayer.UnitOfWork
{
    public interface IUnitOfWork : IAsyncDisposable
    {
        // Repository access
        IUserRepository UserRepository { get; }
        IRoleRepository RoleRepository { get; }
        IReportRepository ReportRepository { get; }
        IReportFeedbackRepository ReportFeedbackRepository { get; }
        IMeetingRepository MeetingRepository { get; }
        IMeetingDetailRepository MeetingDetailRepository { get; }
        ITestRepository TestRepository { get; }
        IExamRepository ExamRepository { get; }
        ILecturerTestDetailRepository LecturerTestDetailRepository { get; }
        // Transaction management
        Task BeginTransactionAsync();
        Task CommitTransactionAsync();
        Task RollbackTransactionAsync();

        // Save changes
        Task<int> SaveAsync();
        //Không cần viết lại DisposeAsync() vì nó đã được kế thừa từ IAsyncDisposable.
    }
}
