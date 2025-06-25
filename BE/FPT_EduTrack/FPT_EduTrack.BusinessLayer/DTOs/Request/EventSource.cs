using System;
using System.Collections.Generic;

namespace GoogleCalendarAPI
{
    public class EventRequest
    {
        public EventRequest()
        {
            EventType = "default";
            Transparency = "opaque";
            Status = "confirmed";
            Visibility = "default";
            GuestsCanInviteOthers = true;
            GuestsCanModify = false;
            GuestsCanSeeOtherGuests = true;
        }
        public string EventType { get; set; }
        public string Transparency { get; set; }
        public string Status { get; set; }
        public bool? GuestsCanInviteOthers { get; set; }
        public bool? GuestsCanModify { get; set; }
        public bool? GuestsCanSeeOtherGuests { get; set; }
        public string Visibility { get; set; }
        public string Summary { get; set; } = null!;
        public string Description { get; set; } = null!;

        public EventDateTime Start { get; set; } = null!;
        public EventDateTime End { get; set; } = null!;

        public List<EventAttendee> Attendees { get; set; } = new();
        public ConferenceData? ConferenceData { get; set; }
        public EventReminders? Reminders { get; set; }
        public string? ColorId { get; set; }
        public List<string>? Recurrence { get; set; }
        public List<EventAttachment>? Attachments { get; set; }
    }

    public class EventDateTime
    {
        public DateTime? DateTime { get; set; }
        public string TimeZone { get; set; } = "Asia/Kolkata";
    }

    public class EventAttachment
    {
        public string FileId { get; set; }
        public string FileUrl { get; set; }
        public string IconLink { get; set; }
        public string MimeType { get; set; }
        public string Title { get; set; }
    }

    public class EventAttendee
    {
        public int? AdditionalGuests { get; set; }
        public string? Comment { get; set; }
        public string? DisplayName { get; set; }
        public string Email { get; set; }
        public string? Id { get; set; }
        public bool? Optional { get; set; }
        public bool? Organizer { get; set; }
        public bool? Resource { get; set; }
        public string? ResponseStatus { get; set; }
        public bool? Self { get; set; }
    }

    public class ConferenceData
    {
        public string? ConferenceId { get; set; }
        public ConferenceSolution? ConferenceSolution { get; set; }
        public CreateConferenceRequest? CreateRequest { get; set; }
        public List<EntryPoint>? EntryPoints { get; set; }
        public string? Notes { get; set; }
        public string? Signature { get; set; }
    }

    public class ConferenceSolution
    {
        public string IconUri { get; set; }
        public ConferenceSolutionKey Key { get; set; }
        public string Name { get; set; }
    }

    public class ConferenceSolutionKey
    {
        public string Type { get; set; } = "hangoutsMeet";
    }

    public class CreateConferenceRequest
    {
        public CreateConferenceRequest()
        {
            ConferenceSolutionKey = new ConferenceSolutionKey();
        }
        public string? RequestId { get; set; }
        public ConferenceSolutionKey? ConferenceSolutionKey { get; set; }
    }

    public class EntryPoint
    {
        public string AccessCode { get; set; }
        public List<string> EntryPointFeatures { get; set; }
        public string EntryPointType { get; set; }
        public string Label { get; set; }
        public string MeetingCode { get; set; }
        public string Passcode { get; set; }
        public string Password { get; set; }
        public string Pin { get; set; }
        public string RegionCode { get; set; }
        public string Uri { get; set; }
    }

    public class ConferenceParametersAddOnParameters
    {
        public Dictionary<string, string> Parameters { get; set; }
    }

    public class EventReminders
    {
        public List<EventReminder> Overrides { get; set; }
        public bool? UseDefault { get; set; }
    }

    public class EventReminder
    {
        public string Method { get; set; }
        public int? Minutes { get; set; }
    }

    public class ExtendedProperties
    {
        public Dictionary<string, string> Private { get; set; }
        public Dictionary<string, string> Shared { get; set; }
    }

    public class EventGadget
    {
        public string Display { get; set; }
        public int? Height { get; set; }
        public string IconLink { get; set; }
        public string Link { get; set; }
        public Dictionary<string, string> Preferences { get; set; }
        public string Title { get; set; }
        public string Type { get; set; }
        public int? Width { get; set; }
    }

    public class BirthdayProperties
    {
        public string Contact { get; set; }
        public string CustomTypeName { get; set; }
        public string Type { get; set; }
    }

    public class FocusTimeProperties
    {
        public string AutoDeclineMode { get; set; }
        public string ChatStatus { get; set; }
        public string DeclineMessage { get; set; }
    }

    public class EventResponse
    {
        public string Kind { get; set; }
        public string ETag { get; set; }
        public string Id { get; set; }
        public string Status { get; set; }
        public string HtmlLink { get; set; }
        public DateTime? Created { get; set; }
        public DateTime? Updated { get; set; }
        public string Summary { get; set; }
        public string Description { get; set; }
        public string Location { get; set; }
        public string ColorId { get; set; }
        public EventCreator Creator { get; set; }
        public EventOrganizer Organizer { get; set; }
        public EventDateTime Start { get; set; }
        public EventDateTime End { get; set; }
        public bool? EndTimeUnspecified { get; set; }
        public List<string> Recurrence { get; set; }
        public string RecurringEventId { get; set; }
        public EventDateTime OriginalStartTime { get; set; }
        public string Transparency { get; set; }
        public string Visibility { get; set; }
        public string ICalUID { get; set; }
        public int? Sequence { get; set; }
        public List<EventAttendee> Attendees { get; set; }
        public bool? AttendeesOmitted { get; set; }
        public ExtendedProperties ExtendedProperties { get; set; }
        public string HangoutLink { get; set; }
        public ConferenceData ConferenceData { get; set; }
        public EventGadget Gadget { get; set; }
        public bool? AnyoneCanAddSelf { get; set; }
        public bool? GuestsCanInviteOthers { get; set; }
        public bool? GuestsCanModify { get; set; }
        public bool? GuestsCanSeeOtherGuests { get; set; }
        public bool? PrivateCopy { get; set; }
        public bool? Locked { get; set; }
        public EventReminders Reminders { get; set; }
        public EventSource Source { get; set; }
        public List<EventAttachment> Attachments { get; set; }
        public string EventType { get; set; }
    }

    public class EventCreator
    {
        public string Id { get; set; }
        public string Email { get; set; }
        public string DisplayName { get; set; }
        public bool? Self { get; set; }
    }

    public class EventOrganizer
    {
        public string Id { get; set; }
        public string Email { get; set; }
        public string DisplayName { get; set; }
        public bool? Self { get; set; }
    }

    public class EventSource
    {
        public string Url { get; set; }
        public string Title { get; set; }
    }
}