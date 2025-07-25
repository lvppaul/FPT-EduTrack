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
            return await _context.Meetings.Include(m => m.MeetingStatus)
                .Where(m => m.IsDeleted != true)
                .ToListAsync();
        }

        public async Task<Meeting?> GetByGoogleMeetingIdAsync(string id)
        {
            return await _context.Meetings
                .Where(m => m.GoogleMeetingId == id && m.IsDeleted != true)
                .FirstOrDefaultAsync();
        }

        public async Task<List<Meeting>> GetMeetingsByGoogleIdsAsync(List<string> googleIds)
        {
            return await _context.Meetings.Include(m => m.MeetingStatus).Include(m => m.MeetingDetails).ThenInclude(d=>d.User).ThenInclude(d=>d.Role)
                .Where(m => googleIds.Contains(m.GoogleMeetingId) && m.IsDeleted != true).OrderByDescending(m => m.Id)
                .ToListAsync();
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

        public async Task<List<string>> GetMeetingAttendees(int meetingId)
        {
            return await _context.Meetings
                .Where(m => m.Id.Equals(meetingId))
                .Include(m => m.MeetingDetails)
                    .ThenInclude(md => md.User)
                .SelectMany(m => m.MeetingDetails.Select(md => md.User.Email))
                .Where(email => !string.IsNullOrEmpty(email))
                .ToListAsync();
        }

        public async Task<Meeting?> GetMeetingByIdAsync(int id)
        {
            return await _context.Meetings
                .Where(m => m.Id == id && m.IsDeleted != true)
                .Include(m => m.MeetingDetails)
                    .ThenInclude(md => md.User)
                .Include(m => m.MeetingStatus)
                .FirstOrDefaultAsync();
        }
    }
}
