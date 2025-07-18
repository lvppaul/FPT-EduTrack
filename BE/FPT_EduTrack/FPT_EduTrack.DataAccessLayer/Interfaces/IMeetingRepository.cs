using FPT_EduTrack.DataAccessLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPT_EduTrack.DataAccessLayer.Interfaces
{
    public interface IMeetingRepository : IGenericRepository<Meeting>
    {
        public Task<List<Meeting>> GetAllMeetingsAsync();
        public Task<Meeting?> GetByGoogleMeetingIdAsync(string id);
        public Task<List<Meeting>> GetMeetingsByGoogleIdsAsync(List<string> googleIds);
        public Task<List<Meeting>> GetMeetingsByUserIdAsync(int userId);
        public Task<List<Meeting>> GetMeetingsByStatusAsync(int statusId);
        public Task<List<Meeting>> GetMeetingsByDateAsync(DateTime date);
        public Task<List<string>> GetMeetingAttendees(int meetingId);
    }
}
