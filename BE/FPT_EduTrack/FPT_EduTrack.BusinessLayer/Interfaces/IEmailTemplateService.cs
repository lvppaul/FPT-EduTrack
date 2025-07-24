using FPT_EduTrack.DataAccessLayer.Entities;
using GoogleCalendarAPI;

namespace FPT_EduTrack.BusinessLayer.Interfaces
{
    public interface IEmailTemplateService
    {
        string GetMeetingInvitationSubject();
        string GetMeetingInvitationBody(EventResponse response, string organizerEmail);
        string GetMeetingUpdateSubject();
        string GetMeetingUpdateBody(EventResponse response, string organizerEmail);
        string GetMeetingCancelSubject();
        string GetMeetingCancelBody(Meeting meeting, string organizerEmail);
    }
}
