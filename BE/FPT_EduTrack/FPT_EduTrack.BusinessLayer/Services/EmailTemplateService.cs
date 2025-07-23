using GoogleCalendarAPI;
using FPT_EduTrack.BusinessLayer.Interfaces;

namespace FPT_EduTrack.BusinessLayer.Services
{
    public class EmailTemplateService : IEmailTemplateService
    {
        public string GetMeetingInvitationSubject()
        {
            return "Lời mời tham gia cuộc họp Google Meet";
        }

        public string GetMeetingUpdateSubject()
        {
            return "Cập nhật cuộc họp Google Meet";
        }

        public string GetMeetingInvitationBody(EventResponse response, string organizerEmail)
        {
            return $@"Xin chào,<br/><br/>
            Bạn được mời tham gia cuộc họp ""{response.Summary}"" do {organizerEmail} tổ chức.<br/><br/>
            - 🗓 **Thời gian**: {response.Start.DateTime:dd/MM/yyyy HH:mm} - {response.End.DateTime:HH:mm}<br/>
            - 📍 **Hình thức họp**: Trực tuyến qua Google Meet<br/>
            - 🔗 **Link tham gia**: {response.HangoutLink}<br/><br/>
            Vui lòng tham gia đúng giờ và kiểm tra thiết bị trước cuộc họp.<br/><br/>
            Trân trọng,<br/>Đội ngũ hỗ trợ";
        }

        public string GetMeetingUpdateBody(EventResponse response, string organizerEmail)
        {
            return $@"Xin chào,<br/><br/>
            Cuộc họp ""{response.Summary}"" do {organizerEmail} tổ chức đã được cập nhật.<br/><br/>
            - 🗓 **Thời gian mới**: {response.Start.DateTime:dd/MM/yyyy HH:mm} - {response.End.DateTime:HH:mm}<br/>
            - 📍 **Hình thức họp**: Trực tuyến qua Google Meet<br/>
            - 🔗 **Link tham gia**: {response.HangoutLink}<br/><br/>
            Vui lòng kiểm tra lại lịch trình cá nhân và tham gia đúng giờ.<br/><br/>
            Trân trọng,<br/>Đội ngũ hỗ trợ";
        }
    }
}
