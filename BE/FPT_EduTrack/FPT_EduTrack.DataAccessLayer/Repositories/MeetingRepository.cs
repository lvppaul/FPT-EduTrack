using FPT_EduTrack.DataAccessLayer.Context;
using FPT_EduTrack.DataAccessLayer.Entities;
using FPT_EduTrack.DataAccessLayer.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPT_EduTrack.DataAccessLayer.Repositories
{
    public class MeetingRepository : GenericRepository<Meeting>, IMeetingRepository
    {
        public MeetingRepository(FptEduTrackContext context) : base(context)
        {
        }
        
        public async Task<List<Meeting>> GetAllMeetingsAsync()
        {
            return await _context.Meetings
                .Where(m => m.IsDeleted != true)
                .ToListAsync();
        }

        public Task<Meeting?> GetMeetingByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<List<Meeting>> GetMeetingsByUserIdAsync(int userId)
        {
            throw new NotImplementedException();
        }

        public Task<List<Meeting>> GetMeetingsByStatusAsync(int statusId)
        {
            throw new NotImplementedException();
        }

        public Task<List<Meeting>> GetMeetingsByDateAsync(DateTime date)
        {
            throw new NotImplementedException();
        }
    }

}
