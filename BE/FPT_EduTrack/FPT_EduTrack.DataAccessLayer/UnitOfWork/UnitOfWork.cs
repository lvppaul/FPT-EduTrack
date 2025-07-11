using FPT_EduTrack.DataAccessLayer.Context;
using FPT_EduTrack.DataAccessLayer.Interfaces;
using FPT_EduTrack.DataAccessLayer.Repositories;
using Microsoft.EntityFrameworkCore.Storage;

namespace FPT_EduTrack.DataAccessLayer.UnitOfWork
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly FptEduTrackContext _context;
        private IDbContextTransaction _transaction;
        // Repositories
        private IUserRepository _userRepository;
        private IRoleRepository _roleRepository;
        private IReportRepository _reportRepository;
        private IMeetingRepository _meetingRepository;
        private IMeetingDetailRepository _meetingDetailRepository;
        private ITestRepository _testRepository;

        // Constructor to initialize the context
        public UnitOfWork() => _context ??= new FptEduTrackContext();

        //Lazy loading of repositories
        public IUserRepository UserRepository
        {
            get { return _userRepository ??= new UserRepository(_context); }
        }

        public IRoleRepository RoleRepository
        {
            get { return _roleRepository ??= new RoleRepository(_context); }
        }
        public IReportRepository ReportRepository
        {
            get { return _reportRepository ??= new ReportRepository(_context); }
        }
        public IMeetingRepository MeetingRepository
        {
            get { return _meetingRepository ??= new MeetingRepository(_context); }
        }
        public IMeetingDetailRepository MeetingDetailRepository
        {
            get { return _meetingDetailRepository ??= new MeetingDetailRepository(_context); }
        }

        public ITestRepository TestRepository
        {
            get { return _testRepository ??= new TestRepository(_context); }
        }
        // Transaction Management
        public async Task BeginTransactionAsync()
        {
            _transaction = await _context.Database.BeginTransactionAsync();
        }

        public async Task CommitTransactionAsync()
        {
            try
            {
                await _context.SaveChangesAsync();
                if (_transaction != null)
                {
                    await _transaction.CommitAsync();
                }
            }
            catch
            {
                await RollbackTransactionAsync();
                throw;
            }
            finally
            {
                if (_transaction != null)
                {
                    await _transaction.DisposeAsync();
                    _transaction = null;
                }
            }
        }

        public async Task RollbackTransactionAsync()
        {
            if (_transaction != null)
            {
                await _transaction.RollbackAsync();
                await _transaction.DisposeAsync();
                _transaction = null;
            }
        }

        // Save Methods (sử dụng các method có sẵn trong GenericRepository)
        //public int Save()
        //{
        //    return _context.SaveChanges();
        //}

        public async Task<int> SaveAsync()
        {
            return await _context.SaveChangesAsync();
        }

        // Async Dispose
        public async ValueTask DisposeAsync()
        {
            if (_transaction != null)
            {
                await _transaction.DisposeAsync();
                _transaction = null;
            }

            await _context.DisposeAsync();
        }
    }
}
