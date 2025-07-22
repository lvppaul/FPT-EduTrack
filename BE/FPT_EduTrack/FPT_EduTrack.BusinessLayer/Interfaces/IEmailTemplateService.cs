using GoogleCalendarAPI;

namespace FPT_EduTrack.BusinessLayer.Interfaces
{
    public interface IEmailTemplateService
    {
        string GetMeetingInvitationSubject();
        string GetMeetingInvitationBody(EventResponse response, string organizerEmail);
        string GetMeetingUpdateSubject();
        string GetMeetingUpdateBody(EventResponse response, string organizerEmail);
    }
}
