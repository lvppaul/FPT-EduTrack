import type { User } from "./userType";

export interface CreateMeetingsRequest {
  summary: string;
  description: string;
  startTime: {
    dateTime: string; // ISO 8601 format
  };
  endTime: {
    dateTime: string; // ISO 8601 format
  };
  attendeeEmails: AttendeeEmail[];
}

export interface AttendeeEmail {
  email: string;
}

// getMeetingsResponse.ts

export interface MeetingDetail {
  meetingId: number;
  userId: number;
  user: User;
}

export interface Meeting {
  id: number;
  name: string;
  createdAt: string;
  link: string;
  meetingStatusId: number;
  meetingStatusName: string;
  meetingDetails: MeetingDetail[];
}

export interface GetMeetingsResponse {
  success: boolean;
  message: string;
  data: Meeting[];
  count: number;
}
