USE [FPT_EduTrack]
GO
/****** Object:  Table [dbo].[Exams]    Script Date: 7/26/2025 9:31:48 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Exams](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[code] [nvarchar](50) NULL,
	[created_at] [datetime] NULL,
	[name] [nvarchar](100) NULL,
	[examiner_id] [int] NULL,
	[duration] [int] NULL,
	[is_deleted] [bit] NULL,
	[status] [nvarchar](50) NULL,
 CONSTRAINT [PK__Exams__3213E83FFCBF6A48] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Lecturers_Tests_Detail]    Script Date: 7/26/2025 9:31:48 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Lecturers_Tests_Detail](
	[test_id] [int] NOT NULL,
	[lecturer_id] [int] NOT NULL,
	[score] [float] NULL,
	[reason] [nvarchar](max) NULL,
	[is_grading] [bit] NULL,
 CONSTRAINT [PK__Lecturer__FEB201A960272DB1] PRIMARY KEY CLUSTERED 
(
	[test_id] ASC,
	[lecturer_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Meetings]    Script Date: 7/26/2025 9:31:48 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Meetings](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](100) NULL,
	[created_at] [datetime] NULL,
	[is_deleted] [bit] NULL,
	[link] [nvarchar](max) NULL,
	[meeting_status_id] [int] NULL,
	[meeting_gg_id] [nvarchar](100) NULL,
	[end_time] [datetime] NULL,
	[start_time] [datetime] NULL,
 CONSTRAINT [PK__Meetings__3213E83FDDFCD55F] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Meetings_Detail]    Script Date: 7/26/2025 9:31:48 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Meetings_Detail](
	[MeetingId] [int] NOT NULL,
	[UserId] [int] NOT NULL,
 CONSTRAINT [PK_Meetings_Detail] PRIMARY KEY CLUSTERED 
(
	[MeetingId] ASC,
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Meetings_Status]    Script Date: 7/26/2025 9:31:48 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Meetings_Status](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](100) NULL,
	[is_deleted] [bit] NULL,
 CONSTRAINT [PK__Meetings__3213E83F10968B67] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[MeetingUser]    Script Date: 7/26/2025 9:31:48 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[MeetingUser](
	[MeetingsId] [int] NOT NULL,
	[UsersId] [int] NOT NULL,
 CONSTRAINT [PK_MeetingUser] PRIMARY KEY CLUSTERED 
(
	[MeetingsId] ASC,
	[UsersId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Report]    Script Date: 7/26/2025 9:31:48 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Report](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[title] [nvarchar](200) NULL,
	[content] [nvarchar](max) NULL,
	[is_deleted] [bit] NULL,
	[is_second] [bit] NULL,
	[created_at] [datetime] NULL,
	[student_id] [int] NULL,
	[report_status_id] [int] NULL,
	[test_id] [int] NULL,
 CONSTRAINT [PK__Report__3213E83F976C4D9F] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Report_Feedback_Status]    Script Date: 7/26/2025 9:31:48 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Report_Feedback_Status](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](100) NULL,
	[is_deleted] [bit] NULL,
 CONSTRAINT [PK__Report_F__3213E83F98424F8C] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Report_Feedbacks]    Script Date: 7/26/2025 9:31:48 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Report_Feedbacks](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[report_id] [int] NULL,
	[examiner_id] [int] NULL,
	[feedback] [nvarchar](max) NULL,
	[created_at] [datetime] NULL,
	[report_feedback_status_id] [int] NULL,
	[re_exam_score] [float] NULL,
 CONSTRAINT [PK__Report_F__3213E83F321DE8A4] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Report_Status]    Script Date: 7/26/2025 9:31:48 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Report_Status](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](100) NULL,
	[is_deleted] [bit] NULL,
 CONSTRAINT [PK__Report_S__3213E83FA0238267] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Roles]    Script Date: 7/26/2025 9:31:48 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Roles](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](100) NULL,
	[is_deleted] [bit] NULL,
 CONSTRAINT [PK__Roles__3213E83F8AFA5467] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Tests]    Script Date: 7/26/2025 9:31:48 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Tests](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[code] [nvarchar](50) NULL,
	[title] [nvarchar](200) NULL,
	[content] [nvarchar](max) NULL,
	[link] [nvarchar](max) NULL,
	[student_id] [int] NULL,
	[exam_id] [int] NULL,
	[is_deleted] [bit] NULL,
	[score] [real] NULL,
 CONSTRAINT [PK__Tests__3213E83F3115D372] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Tests_Score]    Script Date: 7/26/2025 9:31:48 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Tests_Score](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[score] [float] NULL,
	[is_final] [bit] NULL,
	[test_id] [int] NULL,
 CONSTRAINT [PK__Tests_Sc__3213E83F455B4163] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 7/26/2025 9:31:48 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[email] [nvarchar](255) NULL,
	[password] [nvarchar](255) NULL,
	[fullname] [nvarchar](100) NULL,
	[refresh_token] [nvarchar](max) NULL,
	[expired_refresh_token] [datetime] NULL,
	[Google_refresh_token] [nvarchar](max) NULL,
	[Google_access_token] [nvarchar](max) NULL,
	[created_at] [datetime] NULL,
	[is_active] [bit] NULL,
	[is_deleted] [bit] NULL,
	[role_id] [int] NULL,
	[GoogleAccessTokenExpiredAt] [datetime2](7) NULL,
 CONSTRAINT [PK__Users__3213E83FAF6D8416] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Exams] ON 

INSERT [dbo].[Exams] ([id], [code], [created_at], [name], [examiner_id], [duration], [is_deleted], [status]) VALUES (1, N'FINAL_FA24', CAST(N'2025-11-07T00:00:00.000' AS DateTime), N'Kỳ thi cuối kỳ - Fall 2024', 1, 60, 0, N'Completed')
INSERT [dbo].[Exams] ([id], [code], [created_at], [name], [examiner_id], [duration], [is_deleted], [status]) VALUES (2, N'FINAL_FA25', CAST(N'2025-07-18T23:34:54.963' AS DateTime), N'Kỳ thi cuối kỳ - Fall 2025', 1, 120, 0, N'Completed')
INSERT [dbo].[Exams] ([id], [code], [created_at], [name], [examiner_id], [duration], [is_deleted], [status]) VALUES (3, N'FINAL_FA26', CAST(N'2025-07-18T23:48:11.650' AS DateTime), N'Kỳ thi cuối kỳ - Fall 2026', 1, 90, 0, N'Completed')
INSERT [dbo].[Exams] ([id], [code], [created_at], [name], [examiner_id], [duration], [is_deleted], [status]) VALUES (4, N'FINAL_FA27', CAST(N'2025-07-18T23:48:36.743' AS DateTime), N'Kỳ thi cuối kỳ - Fall 2027', 1, 60, 0, N'Completed')
INSERT [dbo].[Exams] ([id], [code], [created_at], [name], [examiner_id], [duration], [is_deleted], [status]) VALUES (5, N'FINAL_FA28', CAST(N'2025-07-18T23:49:20.557' AS DateTime), N'Kỳ thi cuối kỳ - Fall 2028', 1, 70, 0, N'Completed')
INSERT [dbo].[Exams] ([id], [code], [created_at], [name], [examiner_id], [duration], [is_deleted], [status]) VALUES (6, N'FINAL_FA29', CAST(N'2025-07-18T23:49:40.757' AS DateTime), N'Kỳ thi cuối kỳ - Fall 2029', 1, 90, 0, N'Completed')
INSERT [dbo].[Exams] ([id], [code], [created_at], [name], [examiner_id], [duration], [is_deleted], [status]) VALUES (7, N'test', CAST(N'2025-07-23T04:48:42.390' AS DateTime), N'abc', 1, 100, 0, N'InProgress')
INSERT [dbo].[Exams] ([id], [code], [created_at], [name], [examiner_id], [duration], [is_deleted], [status]) VALUES (8, N'E08', CAST(N'2025-07-23T13:03:33.163' AS DateTime), N'E08', 1, 90, 0, N'InProgress')
INSERT [dbo].[Exams] ([id], [code], [created_at], [name], [examiner_id], [duration], [is_deleted], [status]) VALUES (9, N'E09', CAST(N'2025-07-23T13:04:07.047' AS DateTime), N'E09', 1, 80, 0, N'InProgress')
INSERT [dbo].[Exams] ([id], [code], [created_at], [name], [examiner_id], [duration], [is_deleted], [status]) VALUES (10, N'E10', CAST(N'2025-07-23T13:04:11.973' AS DateTime), N'E10', 1, 60, 0, N'InProgress')
INSERT [dbo].[Exams] ([id], [code], [created_at], [name], [examiner_id], [duration], [is_deleted], [status]) VALUES (11, N'E11', CAST(N'2025-07-23T13:04:37.730' AS DateTime), N'E11', 1, 50, 0, N'InProgress')
INSERT [dbo].[Exams] ([id], [code], [created_at], [name], [examiner_id], [duration], [is_deleted], [status]) VALUES (12, N'abc', CAST(N'2025-07-23T08:55:06.653' AS DateTime), N'abc', 1, 60, 0, N'Completed')
INSERT [dbo].[Exams] ([id], [code], [created_at], [name], [examiner_id], [duration], [is_deleted], [status]) VALUES (14, N'SPRING_haha', CAST(N'2025-07-23T09:04:58.413' AS DateTime), N'hahahahaha', 9, 60, 0, N'Completed')
INSERT [dbo].[Exams] ([id], [code], [created_at], [name], [examiner_id], [duration], [is_deleted], [status]) VALUES (15, N'SPRING_haha', CAST(N'2025-07-23T09:14:16.207' AS DateTime), N'hahahahaha', 9, 60, 0, N'InProgress')
INSERT [dbo].[Exams] ([id], [code], [created_at], [name], [examiner_id], [duration], [is_deleted], [status]) VALUES (16, N'53063', CAST(N'2025-07-23T09:14:29.863' AS DateTime), N'hahahahaha', 9, 79, 0, N'InProgress')
INSERT [dbo].[Exams] ([id], [code], [created_at], [name], [examiner_id], [duration], [is_deleted], [status]) VALUES (18, N'exam01', CAST(N'2025-07-24T13:52:45.750' AS DateTime), N'chill', 7, 60, 0, N'InProgress')
INSERT [dbo].[Exams] ([id], [code], [created_at], [name], [examiner_id], [duration], [is_deleted], [status]) VALUES (19, N'Exam02', CAST(N'2025-07-24T13:54:12.043' AS DateTime), N'Thi Chill', 9, 60, 0, N'InProgress')
INSERT [dbo].[Exams] ([id], [code], [created_at], [name], [examiner_id], [duration], [is_deleted], [status]) VALUES (22, N'Exam03', CAST(N'2025-07-24T13:58:24.570' AS DateTime), N'Thi chill chill tôi thủ khoa lúc nào không hay', 9, 60, 0, N'InProgress')
INSERT [dbo].[Exams] ([id], [code], [created_at], [name], [examiner_id], [duration], [is_deleted], [status]) VALUES (23, N'Exam04', CAST(N'2025-07-24T20:06:50.743' AS DateTime), N'Test Xem get re-grading và grading api', 9, 60, 0, N'Grading')
INSERT [dbo].[Exams] ([id], [code], [created_at], [name], [examiner_id], [duration], [is_deleted], [status]) VALUES (24, N'Hôm Nay Chill', CAST(N'2025-07-25T05:43:19.707' AS DateTime), N'Tôi Chill', 9, 60, 0, N'InProgress')
INSERT [dbo].[Exams] ([id], [code], [created_at], [name], [examiner_id], [duration], [is_deleted], [status]) VALUES (25, N'E001', CAST(N'2025-07-25T09:18:11.890' AS DateTime), N'pgm201c', 9, 60, 0, N'InProgress')
SET IDENTITY_INSERT [dbo].[Exams] OFF
GO
INSERT [dbo].[Lecturers_Tests_Detail] ([test_id], [lecturer_id], [score], [reason], [is_grading]) VALUES (2, 2, 10, N'oke', 1)
INSERT [dbo].[Lecturers_Tests_Detail] ([test_id], [lecturer_id], [score], [reason], [is_grading]) VALUES (2, 3, 10, N'excellent', 0)
INSERT [dbo].[Lecturers_Tests_Detail] ([test_id], [lecturer_id], [score], [reason], [is_grading]) VALUES (2, 15, 0, N'', 1)
INSERT [dbo].[Lecturers_Tests_Detail] ([test_id], [lecturer_id], [score], [reason], [is_grading]) VALUES (4, 2, 10, N'test 4 oke', 1)
INSERT [dbo].[Lecturers_Tests_Detail] ([test_id], [lecturer_id], [score], [reason], [is_grading]) VALUES (5, 2, 10, N'test 5 oke', 1)
INSERT [dbo].[Lecturers_Tests_Detail] ([test_id], [lecturer_id], [score], [reason], [is_grading]) VALUES (8, 3, 0, N'', 0)
INSERT [dbo].[Lecturers_Tests_Detail] ([test_id], [lecturer_id], [score], [reason], [is_grading]) VALUES (14, 3, 0, N'abc', 0)
INSERT [dbo].[Lecturers_Tests_Detail] ([test_id], [lecturer_id], [score], [reason], [is_grading]) VALUES (16, 3, 8, N'abc', 0)
INSERT [dbo].[Lecturers_Tests_Detail] ([test_id], [lecturer_id], [score], [reason], [is_grading]) VALUES (17, 3, 10, N'abc', 0)
INSERT [dbo].[Lecturers_Tests_Detail] ([test_id], [lecturer_id], [score], [reason], [is_grading]) VALUES (18, 3, 9, N'Cũng tàm tạm', 0)
INSERT [dbo].[Lecturers_Tests_Detail] ([test_id], [lecturer_id], [score], [reason], [is_grading]) VALUES (19, 3, 8, N'string', 0)
INSERT [dbo].[Lecturers_Tests_Detail] ([test_id], [lecturer_id], [score], [reason], [is_grading]) VALUES (20, 3, 9, N'hay', 0)
INSERT [dbo].[Lecturers_Tests_Detail] ([test_id], [lecturer_id], [score], [reason], [is_grading]) VALUES (21, 3, 10, N'test update mới', 0)
INSERT [dbo].[Lecturers_Tests_Detail] ([test_id], [lecturer_id], [score], [reason], [is_grading]) VALUES (22, 3, 10, N'hay', 0)
INSERT [dbo].[Lecturers_Tests_Detail] ([test_id], [lecturer_id], [score], [reason], [is_grading]) VALUES (23, 3, 10, N'a', 0)
INSERT [dbo].[Lecturers_Tests_Detail] ([test_id], [lecturer_id], [score], [reason], [is_grading]) VALUES (24, 3, 10, N'350', 0)
INSERT [dbo].[Lecturers_Tests_Detail] ([test_id], [lecturer_id], [score], [reason], [is_grading]) VALUES (25, 3, 10, N'a', 0)
INSERT [dbo].[Lecturers_Tests_Detail] ([test_id], [lecturer_id], [score], [reason], [is_grading]) VALUES (26, 3, 8, N'a', 0)
INSERT [dbo].[Lecturers_Tests_Detail] ([test_id], [lecturer_id], [score], [reason], [is_grading]) VALUES (27, 3, 4, N'xui', 0)
INSERT [dbo].[Lecturers_Tests_Detail] ([test_id], [lecturer_id], [score], [reason], [is_grading]) VALUES (27, 15, 8, N'cố gắng', 0)
INSERT [dbo].[Lecturers_Tests_Detail] ([test_id], [lecturer_id], [score], [reason], [is_grading]) VALUES (28, 3, 3, N'sử dụng ai', 0)
INSERT [dbo].[Lecturers_Tests_Detail] ([test_id], [lecturer_id], [score], [reason], [is_grading]) VALUES (28, 16, 8, N'hơi dơ', 0)
INSERT [dbo].[Lecturers_Tests_Detail] ([test_id], [lecturer_id], [score], [reason], [is_grading]) VALUES (29, 3, 10, N'Tốt', 0)
INSERT [dbo].[Lecturers_Tests_Detail] ([test_id], [lecturer_id], [score], [reason], [is_grading]) VALUES (30, 16, 0, N'', 1)
GO
SET IDENTITY_INSERT [dbo].[Meetings] ON 

INSERT [dbo].[Meetings] ([id], [name], [created_at], [is_deleted], [link], [meeting_status_id], [meeting_gg_id], [end_time], [start_time]) VALUES (3, N'abc', CAST(N'2025-07-22T08:07:24.180' AS DateTime), 0, N'https://meet.google.com/czp-ntna-yja', 2, N'felivnpbvblv1u4oplr7brdo2o', CAST(N'2025-07-25T14:50:48.000' AS DateTime), CAST(N'2025-07-22T14:50:48.000' AS DateTime))
INSERT [dbo].[Meetings] ([id], [name], [created_at], [is_deleted], [link], [meeting_status_id], [meeting_gg_id], [end_time], [start_time]) VALUES (4, N'abc', CAST(N'2025-07-22T08:10:26.840' AS DateTime), 0, N'https://meet.google.com/wtx-ogto-huv', 1, N'9r1f2jcvl3f9aia2bpa3s1kn9o', CAST(N'2025-07-25T14:50:48.000' AS DateTime), CAST(N'2025-07-22T14:50:48.000' AS DateTime))
INSERT [dbo].[Meetings] ([id], [name], [created_at], [is_deleted], [link], [meeting_status_id], [meeting_gg_id], [end_time], [start_time]) VALUES (5, N'ègh', CAST(N'2025-07-22T08:13:10.170' AS DateTime), 0, N'https://meet.google.com/aop-cvaj-auq', 1, N'6f6956jqb087vjqeb5h655c8oo', CAST(N'2025-07-23T14:50:48.000' AS DateTime), CAST(N'2025-07-23T14:50:48.000' AS DateTime))
INSERT [dbo].[Meetings] ([id], [name], [created_at], [is_deleted], [link], [meeting_status_id], [meeting_gg_id], [end_time], [start_time]) VALUES (6, N'12:00', CAST(N'2025-07-24T17:03:04.147' AS DateTime), 0, N'https://meet.google.com/ebh-xepn-eas', 1, N'rtlhjkbl41t144okkce339l118', CAST(N'2025-07-24T17:01:13.000' AS DateTime), CAST(N'2025-07-24T17:00:13.000' AS DateTime))
INSERT [dbo].[Meetings] ([id], [name], [created_at], [is_deleted], [link], [meeting_status_id], [meeting_gg_id], [end_time], [start_time]) VALUES (7, N'12:00', CAST(N'2025-07-24T17:06:09.403' AS DateTime), 0, N'https://meet.google.com/hvp-uhse-bya', 1, N'q6dplgdvr1nrulrkfv8653nr10', CAST(N'2025-07-24T17:01:13.000' AS DateTime), CAST(N'2025-07-24T17:00:13.000' AS DateTime))
INSERT [dbo].[Meetings] ([id], [name], [created_at], [is_deleted], [link], [meeting_status_id], [meeting_gg_id], [end_time], [start_time]) VALUES (8, N'12:00', CAST(N'2025-07-24T17:06:25.610' AS DateTime), 0, N'https://meet.google.com/cwj-ekai-ziz', 1, N'9cbtugpdd2e9progehbmnruthg', CAST(N'2025-07-25T17:01:13.000' AS DateTime), CAST(N'2025-07-25T17:00:13.000' AS DateTime))
INSERT [dbo].[Meetings] ([id], [name], [created_at], [is_deleted], [link], [meeting_status_id], [meeting_gg_id], [end_time], [start_time]) VALUES (9, N'Tạo phòng meetings', CAST(N'2025-07-24T18:18:55.557' AS DateTime), 0, N'https://meet.google.com/odp-uoju-ncw', 3, N'v8r0c6e2n2ae2vdeco8lke3fi8', CAST(N'2025-07-28T13:21:00.000' AS DateTime), CAST(N'2025-07-26T16:20:00.000' AS DateTime))
INSERT [dbo].[Meetings] ([id], [name], [created_at], [is_deleted], [link], [meeting_status_id], [meeting_gg_id], [end_time], [start_time]) VALUES (10, N'Tạo meetings', CAST(N'2025-07-25T05:31:10.950' AS DateTime), 0, N'https://meet.google.com/ooi-dkov-muh', 1, N'mo0majdr1lvvtp27u26mpd4hmo', CAST(N'2025-07-26T04:35:00.000' AS DateTime), CAST(N'2025-07-26T00:00:00.000' AS DateTime))
INSERT [dbo].[Meetings] ([id], [name], [created_at], [is_deleted], [link], [meeting_status_id], [meeting_gg_id], [end_time], [start_time]) VALUES (11, N'Test 12:33', CAST(N'2025-07-25T05:34:16.150' AS DateTime), 0, N'https://meet.google.com/fpr-pxtn-ibt', 1, N'l3g1anprspr0tve6ms56en6qq8', CAST(N'2025-07-26T06:39:00.000' AS DateTime), CAST(N'2025-07-26T04:37:00.000' AS DateTime))
SET IDENTITY_INSERT [dbo].[Meetings] OFF
GO
INSERT [dbo].[Meetings_Detail] ([MeetingId], [UserId]) VALUES (9, 2)
INSERT [dbo].[Meetings_Detail] ([MeetingId], [UserId]) VALUES (9, 3)
INSERT [dbo].[Meetings_Detail] ([MeetingId], [UserId]) VALUES (9, 7)
INSERT [dbo].[Meetings_Detail] ([MeetingId], [UserId]) VALUES (9, 8)
INSERT [dbo].[Meetings_Detail] ([MeetingId], [UserId]) VALUES (9, 10)
INSERT [dbo].[Meetings_Detail] ([MeetingId], [UserId]) VALUES (9, 11)
INSERT [dbo].[Meetings_Detail] ([MeetingId], [UserId]) VALUES (9, 15)
INSERT [dbo].[Meetings_Detail] ([MeetingId], [UserId]) VALUES (6, 16)
INSERT [dbo].[Meetings_Detail] ([MeetingId], [UserId]) VALUES (7, 16)
INSERT [dbo].[Meetings_Detail] ([MeetingId], [UserId]) VALUES (8, 16)
INSERT [dbo].[Meetings_Detail] ([MeetingId], [UserId]) VALUES (9, 16)
INSERT [dbo].[Meetings_Detail] ([MeetingId], [UserId]) VALUES (10, 16)
INSERT [dbo].[Meetings_Detail] ([MeetingId], [UserId]) VALUES (11, 16)
INSERT [dbo].[Meetings_Detail] ([MeetingId], [UserId]) VALUES (7, 18)
INSERT [dbo].[Meetings_Detail] ([MeetingId], [UserId]) VALUES (8, 18)
INSERT [dbo].[Meetings_Detail] ([MeetingId], [UserId]) VALUES (10, 18)
INSERT [dbo].[Meetings_Detail] ([MeetingId], [UserId]) VALUES (11, 18)
GO
SET IDENTITY_INSERT [dbo].[Meetings_Status] ON 

INSERT [dbo].[Meetings_Status] ([id], [name], [is_deleted]) VALUES (1, N'Scheduled', 0)
INSERT [dbo].[Meetings_Status] ([id], [name], [is_deleted]) VALUES (2, N'In Progress', 0)
INSERT [dbo].[Meetings_Status] ([id], [name], [is_deleted]) VALUES (3, N'Completed
', 0)
INSERT [dbo].[Meetings_Status] ([id], [name], [is_deleted]) VALUES (4, N'Cancelled', 0)
SET IDENTITY_INSERT [dbo].[Meetings_Status] OFF
GO
SET IDENTITY_INSERT [dbo].[Report] ON 

INSERT [dbo].[Report] ([id], [title], [content], [is_deleted], [is_second], [created_at], [student_id], [report_status_id], [test_id]) VALUES (1, N'abc', N'abc', 1, 0, NULL, 2, 1, 2)
INSERT [dbo].[Report] ([id], [title], [content], [is_deleted], [is_second], [created_at], [student_id], [report_status_id], [test_id]) VALUES (2, N'abc', N'abc', 0, 0, CAST(N'2025-07-21T20:26:07.747' AS DateTime), 3, 1, 2)
INSERT [dbo].[Report] ([id], [title], [content], [is_deleted], [is_second], [created_at], [student_id], [report_status_id], [test_id]) VALUES (3, N'Phúc Khảo', N'Làm bài quá hoàn hảo', 0, 0, CAST(N'2025-07-24T17:45:56.577' AS DateTime), 2, 5, 19)
INSERT [dbo].[Report] ([id], [title], [content], [is_deleted], [is_second], [created_at], [student_id], [report_status_id], [test_id]) VALUES (4, N'Test Update Report', N'Test Update Report', 0, 0, CAST(N'2025-07-25T02:12:18.710' AS DateTime), 2, 2, 21)
INSERT [dbo].[Report] ([id], [title], [content], [is_deleted], [is_second], [created_at], [student_id], [report_status_id], [test_id]) VALUES (5, N'Re-Grading', N'Re-Grading', 0, 0, CAST(N'2025-07-25T03:09:59.287' AS DateTime), 2, 2, 25)
INSERT [dbo].[Report] ([id], [title], [content], [is_deleted], [is_second], [created_at], [student_id], [report_status_id], [test_id]) VALUES (6, N'Re-Grading-326', N'Re-Grading-326', 0, 0, CAST(N'2025-07-25T03:28:32.433' AS DateTime), 2, 2, 26)
INSERT [dbo].[Report] ([id], [title], [content], [is_deleted], [is_second], [created_at], [student_id], [report_status_id], [test_id]) VALUES (7, N'Re-Grading-518', N'Re-Grading-518', 0, 0, CAST(N'2025-07-25T05:18:34.910' AS DateTime), 2, 2, 27)
INSERT [dbo].[Report] ([id], [title], [content], [is_deleted], [is_second], [created_at], [student_id], [report_status_id], [test_id]) VALUES (8, N'test1101', N'test1101', 0, 0, CAST(N'2025-07-25T04:08:40.520' AS DateTime), 2, 1, 4)
INSERT [dbo].[Report] ([id], [title], [content], [is_deleted], [is_second], [created_at], [student_id], [report_status_id], [test_id]) VALUES (9, N'Phúc khảo bài test: Test xem 2 api  lấy để re-grading và grading', N'hay', 0, 0, CAST(N'2025-07-25T04:24:20.003' AS DateTime), 2, 1, 23)
INSERT [dbo].[Report] ([id], [title], [content], [is_deleted], [is_second], [created_at], [student_id], [report_status_id], [test_id]) VALUES (10, N'Phúc khảo bài test: Get Re-Grading', N'a', 0, 0, CAST(N'2025-07-25T04:25:40.203' AS DateTime), 2, 1, 24)
INSERT [dbo].[Report] ([id], [title], [content], [is_deleted], [is_second], [created_at], [student_id], [report_status_id], [test_id]) VALUES (11, N'Phúc khảo bài test: Tiêu Đề bài test', N'Hơi ít', 0, 0, CAST(N'2025-07-25T05:49:35.033' AS DateTime), 18, 5, 28)
SET IDENTITY_INSERT [dbo].[Report] OFF
GO
SET IDENTITY_INSERT [dbo].[Report_Status] ON 

INSERT [dbo].[Report_Status] ([id], [name], [is_deleted]) VALUES (1, N'Pending', 0)
INSERT [dbo].[Report_Status] ([id], [name], [is_deleted]) VALUES (2, N'Grading', 0)
INSERT [dbo].[Report_Status] ([id], [name], [is_deleted]) VALUES (3, N'Graded', 0)
INSERT [dbo].[Report_Status] ([id], [name], [is_deleted]) VALUES (4, N'WaitingForMeeting', 0)
INSERT [dbo].[Report_Status] ([id], [name], [is_deleted]) VALUES (5, N'Confirm', 0)
INSERT [dbo].[Report_Status] ([id], [name], [is_deleted]) VALUES (6, N'Reject', 0)
SET IDENTITY_INSERT [dbo].[Report_Status] OFF
GO
SET IDENTITY_INSERT [dbo].[Roles] ON 

INSERT [dbo].[Roles] ([id], [name], [is_deleted]) VALUES (1, N'examiner', 0)
INSERT [dbo].[Roles] ([id], [name], [is_deleted]) VALUES (2, N'lecturer', 0)
INSERT [dbo].[Roles] ([id], [name], [is_deleted]) VALUES (3, N'headofdepartment', 0)
INSERT [dbo].[Roles] ([id], [name], [is_deleted]) VALUES (4, N'student', 0)
SET IDENTITY_INSERT [dbo].[Roles] OFF
GO
SET IDENTITY_INSERT [dbo].[Tests] ON 

INSERT [dbo].[Tests] ([id], [code], [title], [content], [link], [student_id], [exam_id], [is_deleted], [score]) VALUES (2, N'haha', N'ahahah', N'haha', N'https://res.cloudinary.com/dlwwvdhnj/raw/upload/v1752249305/test-documents/test-documents/a6620b18-f83c-4a1c-9c5a-0326e7d8c359_SRS-full.docx', 1, 1, 0, 10)
INSERT [dbo].[Tests] ([id], [code], [title], [content], [link], [student_id], [exam_id], [is_deleted], [score]) VALUES (3, N'abc', N'abc', N'abc', NULL, 1, 1, 0, 10)
INSERT [dbo].[Tests] ([id], [code], [title], [content], [link], [student_id], [exam_id], [is_deleted], [score]) VALUES (4, N'test03', N'test03', N'test03', NULL, 2, 2, 0, 10)
INSERT [dbo].[Tests] ([id], [code], [title], [content], [link], [student_id], [exam_id], [is_deleted], [score]) VALUES (5, N'test04', N'test04', N'test04', NULL, 3, 2, 0, 10)
INSERT [dbo].[Tests] ([id], [code], [title], [content], [link], [student_id], [exam_id], [is_deleted], [score]) VALUES (6, N'string', N'string', N'string', N'https://res.cloudinary.com/dlwwvdhnj/raw/upload/v1753325289/test-documents/test-documents/a18b45a4-c1df-4ea5-b1dc-e8ca068540f6_key.docx', 3, 1, 0, 10)
INSERT [dbo].[Tests] ([id], [code], [title], [content], [link], [student_id], [exam_id], [is_deleted], [score]) VALUES (7, N'abc', N'abc', N'abc', N'https://res.cloudinary.com/dlwwvdhnj/raw/upload/v1753325378/test-documents/test-documents/274831f6-c82a-4a94-8e9a-e638b4fd09c0_SRS-full.docx', 1, 1, 0, 10)
INSERT [dbo].[Tests] ([id], [code], [title], [content], [link], [student_id], [exam_id], [is_deleted], [score]) VALUES (8, N'abc', N'abc', N'abc', N'https://res.cloudinary.com/dlwwvdhnj/raw/upload/v1753325593/test-documents/test-documents/d01acb2f-5d98-485a-868e-004c48c41420_SRS-full.docx', 3, 1, 0, 0)
INSERT [dbo].[Tests] ([id], [code], [title], [content], [link], [student_id], [exam_id], [is_deleted], [score]) VALUES (9, N'string', N'string', N'string', N'https://res.cloudinary.com/dlwwvdhnj/raw/upload/v1753326015/test-documents/test-documents/2ec493e1-fef2-4889-973a-3ce1482e3f36_SRS-full.docx', 3, 1, 0, 0)
INSERT [dbo].[Tests] ([id], [code], [title], [content], [link], [student_id], [exam_id], [is_deleted], [score]) VALUES (10, N'string', N'string', N'string', N'https://res.cloudinary.com/dlwwvdhnj/raw/upload/v1753326485/test-documents/test-documents/541e61df-eb88-4805-b0c3-5f41f5a3d913_key.docx', 3, 1, 0, 0)
INSERT [dbo].[Tests] ([id], [code], [title], [content], [link], [student_id], [exam_id], [is_deleted], [score]) VALUES (11, N'string', N'string', N'string', N'https://res.cloudinary.com/dlwwvdhnj/raw/upload/v1753326796/test-documents/test-documents/00b5e954-60f4-4910-a12c-871ea3010b5d_SRS-full.docx', 3, 1, 0, 0)
INSERT [dbo].[Tests] ([id], [code], [title], [content], [link], [student_id], [exam_id], [is_deleted], [score]) VALUES (12, N'string', N'string', N'string', N'https://res.cloudinary.com/dlwwvdhnj/raw/upload/v1753327194/test-documents/test-documents/59c39e7e-4992-4fc9-9019-3795144d6db0_key.docx', 3, 1, 0, 0)
INSERT [dbo].[Tests] ([id], [code], [title], [content], [link], [student_id], [exam_id], [is_deleted], [score]) VALUES (13, N'1', N'a', N'a', N'https://res.cloudinary.com/dlwwvdhnj/raw/upload/v1753327296/test-documents/test-documents/42b40f88-21a4-4712-9ba9-ca38e1d42242_key.docx', 3, 1, 0, 0)
INSERT [dbo].[Tests] ([id], [code], [title], [content], [link], [student_id], [exam_id], [is_deleted], [score]) VALUES (14, N'1', N'a', N'a', N'https://res.cloudinary.com/dlwwvdhnj/raw/upload/v1753327518/test-documents/test-documents/08ee4d63-c660-445a-9993-7b6a04566605_SRS-full.docx', 3, 1, 0, 0)
INSERT [dbo].[Tests] ([id], [code], [title], [content], [link], [student_id], [exam_id], [is_deleted], [score]) VALUES (15, N'3', N'aa', N'a', N'https://res.cloudinary.com/dlwwvdhnj/raw/upload/v1753327597/test-documents/test-documents/896d82d0-8fe5-4012-9916-505d91443963_SRS-full.docx', 3, 3, 0, 0)
INSERT [dbo].[Tests] ([id], [code], [title], [content], [link], [student_id], [exam_id], [is_deleted], [score]) VALUES (16, N'3', N'1035', N'1035', N'https://res.cloudinary.com/dlwwvdhnj/raw/upload/v1753328128/test-documents/test-documents/3e118f81-8cb8-4130-ad8a-f8b19136dcf8_SWD392 – Software Architecture and Design_PracticalExam_Final.docx', 3, 3, 0, 8)
INSERT [dbo].[Tests] ([id], [code], [title], [content], [link], [student_id], [exam_id], [is_deleted], [score]) VALUES (17, N'16', N'1039', N'1039', N'https://res.cloudinary.com/dlwwvdhnj/raw/upload/v1753328390/test-documents/test-documents/c0dffe1c-e11c-4ae9-b346-42d23ad8f291_SWD392 – Software Architecture and Design_PracticalExam_Final.docx', 3, 16, 0, 10)
INSERT [dbo].[Tests] ([id], [code], [title], [content], [link], [student_id], [exam_id], [is_deleted], [score]) VALUES (18, N'16', N'1053', N'1053', N'https://res.cloudinary.com/dlwwvdhnj/raw/upload/v1753329201/test-documents/test-documents/66fc4d78-655f-48fa-a168-3b00c06822ad_SWD392 – Software Architecture and Design_PracticalExam_Final.docx', 2, 16, 0, 9)
INSERT [dbo].[Tests] ([id], [code], [title], [content], [link], [student_id], [exam_id], [is_deleted], [score]) VALUES (19, N'15', N'Test cho vui', N'Làm Test cho vui', N'https://res.cloudinary.com/dlwwvdhnj/raw/upload/v1753335955/test-documents/test-documents/036b75b2-8c04-4cef-b72b-96ea49d1b09d_key.docx', 2, 15, 0, 8)
INSERT [dbo].[Tests] ([id], [code], [title], [content], [link], [student_id], [exam_id], [is_deleted], [score]) VALUES (20, N'22', N'Tiêu đề Test 22', N'Mô tả của test 22', N'https://res.cloudinary.com/dlwwvdhnj/raw/upload/v1753374677/test-documents/test-documents/8b5f4cee-fe77-47c0-9a8c-954699bd7b72_036b75b2-8c04-4cef-b72b-96ea49d1b09d_key.docx', 10, 22, 0, 9)
INSERT [dbo].[Tests] ([id], [code], [title], [content], [link], [student_id], [exam_id], [is_deleted], [score]) VALUES (21, N'22', N'Test Update Report', N'update report status', N'https://res.cloudinary.com/dlwwvdhnj/raw/upload/v1753384432/test-documents/test-documents/48fca97f-737f-4a8a-ac82-fd85c7ec1e86_Nowadays.docx', 2, 22, 0, 10)
INSERT [dbo].[Tests] ([id], [code], [title], [content], [link], [student_id], [exam_id], [is_deleted], [score]) VALUES (22, N'22', N'Test trường is grading', N'a', N'https://res.cloudinary.com/dlwwvdhnj/raw/upload/v1753386406/test-documents/test-documents/8c952918-a67e-4b8d-92e2-17a11fff9233_036b75b2-8c04-4cef-b72b-96ea49d1b09d_key.docx', 5, 22, 0, 10)
INSERT [dbo].[Tests] ([id], [code], [title], [content], [link], [student_id], [exam_id], [is_deleted], [score]) VALUES (23, N'22', N'Test xem 2 api  lấy để re-grading và grading', NULL, N'https://res.cloudinary.com/dlwwvdhnj/raw/upload/v1753387333/test-documents/test-documents/dfb15a7e-6860-4f7f-be2f-8286aad21fb5_d01acb2f-5d98-485a-868e-004c48c41420_SRS-full.docx', 2, 22, 0, 10)
INSERT [dbo].[Tests] ([id], [code], [title], [content], [link], [student_id], [exam_id], [is_deleted], [score]) VALUES (24, N'23', N'Get Re-Grading', NULL, N'https://res.cloudinary.com/dlwwvdhnj/raw/upload/v1753387645/test-documents/test-documents/73e67cb9-2815-4b5c-974a-eaa437aa5d5a_d01acb2f-5d98-485a-868e-004c48c41420_SRS-full %282%29.docx', 2, 23, 0, 10)
INSERT [dbo].[Tests] ([id], [code], [title], [content], [link], [student_id], [exam_id], [is_deleted], [score]) VALUES (25, N'23', N'Grading', NULL, N'https://res.cloudinary.com/dlwwvdhnj/raw/upload/v1753387760/test-documents/test-documents/971c04b3-e232-4e28-903a-3f864e8ffa5c_d01acb2f-5d98-485a-868e-004c48c41420_SRS-full.docx', 2, 23, 0, 10)
INSERT [dbo].[Tests] ([id], [code], [title], [content], [link], [student_id], [exam_id], [is_deleted], [score]) VALUES (26, N'23', N'Re-Grading-326', NULL, N'https://res.cloudinary.com/dlwwvdhnj/raw/upload/v1753388837/test-documents/test-documents/45dcadd4-0bc7-4721-9925-99fa389b5fc5_Nowadays.docx', 2, 23, 0, 8)
INSERT [dbo].[Tests] ([id], [code], [title], [content], [link], [student_id], [exam_id], [is_deleted], [score]) VALUES (27, N'23', N'516', N'516', N'https://res.cloudinary.com/dlwwvdhnj/raw/upload/v1753395377/test-documents/test-documents/d3afdefe-cc70-4f1a-a46d-501eb823a16f_d01acb2f-5d98-485a-868e-004c48c41420_SRS-full.docx', 2, 23, 0, 8)
INSERT [dbo].[Tests] ([id], [code], [title], [content], [link], [student_id], [exam_id], [is_deleted], [score]) VALUES (28, N'24', N'Tiêu Đề bài test', N'Mô tả bài test', N'https://res.cloudinary.com/dlwwvdhnj/raw/upload/v1753422238/test-documents/test-documents/0504bf62-f35f-4b25-8a04-066aa9faede1_Nowadays.docx', 18, 24, 0, 3)
INSERT [dbo].[Tests] ([id], [code], [title], [content], [link], [student_id], [exam_id], [is_deleted], [score]) VALUES (29, N'24', N'Test Test', N'Mô tả test', N'https://res.cloudinary.com/dlwwvdhnj/raw/upload/v1753423372/test-documents/test-documents/1b285304-1157-4a10-875a-bdb1bd8650dd_Nowadays.docx', 18, 24, 0, 10)
INSERT [dbo].[Tests] ([id], [code], [title], [content], [link], [student_id], [exam_id], [is_deleted], [score]) VALUES (30, N'25', N'Pmg201-419', N'mô tả', N'https://res.cloudinary.com/dlwwvdhnj/raw/upload/v1753435180/test-documents/test-documents/e764b17d-c1bb-4085-9a83-7bd108ab17a4_036b75b2-8c04-4cef-b72b-96ea49d1b09d_key.docx', 18, 25, 0, 0)
SET IDENTITY_INSERT [dbo].[Tests] OFF
GO
SET IDENTITY_INSERT [dbo].[Tests_Score] ON 

INSERT [dbo].[Tests_Score] ([id], [score], [is_final], [test_id]) VALUES (1, 10, 0, 2)
INSERT [dbo].[Tests_Score] ([id], [score], [is_final], [test_id]) VALUES (2, 10, 0, 3)
SET IDENTITY_INSERT [dbo].[Tests_Score] OFF
GO
SET IDENTITY_INSERT [dbo].[Users] ON 

INSERT [dbo].[Users] ([id], [email], [password], [fullname], [refresh_token], [expired_refresh_token], [Google_refresh_token], [Google_access_token], [created_at], [is_active], [is_deleted], [role_id], [GoogleAccessTokenExpiredAt]) VALUES (1, N'examiner@gmail.com', N'$2a$11$cUA6pEr62p4xbNdVSkoa0uR4ihBKdxCaQ7R9Utb0a2LsWWRfGZXBa', N'admin', N'U/wwgzRgs86WPm939S840nynrupBtbXuacnVvBH/V64=', CAST(N'2025-07-29T07:39:57.837' AS DateTime), NULL, NULL, CAST(N'2025-07-11T13:04:45.880' AS DateTime), 0, 0, 1, NULL)
INSERT [dbo].[Users] ([id], [email], [password], [fullname], [refresh_token], [expired_refresh_token], [Google_refresh_token], [Google_access_token], [created_at], [is_active], [is_deleted], [role_id], [GoogleAccessTokenExpiredAt]) VALUES (2, N'student@gmail.com', N'$2a$11$WjtPTONMp4n36gQcGPRQ1e03h19EB1TXodnAI0rashC0WHoqP0S/C', N'Tran Binh An', N'IO/aC42d/BrQtZLs8JCer+tsLDtXBEvkWTjDUr/BxHQ=', CAST(N'2025-08-01T05:18:58.400' AS DateTime), NULL, NULL, CAST(N'2025-07-11T16:23:19.823' AS DateTime), 1, 0, 4, NULL)
INSERT [dbo].[Users] ([id], [email], [password], [fullname], [refresh_token], [expired_refresh_token], [Google_refresh_token], [Google_access_token], [created_at], [is_active], [is_deleted], [role_id], [GoogleAccessTokenExpiredAt]) VALUES (3, N'lecturer@gmail.com', N'$2a$11$A82I.zM.wEXyYpLh56Pcve23q8UBjWz15SrXixBLqaGk1VOZDeAju', N'lecturer', N'k6WuUqmrGz6ivogxYJOyLeJSH+BHogfO+TFJwJFiqQg=', CAST(N'2025-08-01T08:32:47.470' AS DateTime), NULL, NULL, CAST(N'2025-07-11T17:31:10.747' AS DateTime), 1, 0, 2, NULL)
INSERT [dbo].[Users] ([id], [email], [password], [fullname], [refresh_token], [expired_refresh_token], [Google_refresh_token], [Google_access_token], [created_at], [is_active], [is_deleted], [role_id], [GoogleAccessTokenExpiredAt]) VALUES (4, N'head@gmail.com', N'$2a$11$wzw1eCSUAwuBQnshjFUefOte1nMshIlEnP07rZB/KMIQrPElY4dfm', N'head', N'0wn/8fXEBfbqLOqURZopZsZjZibjWUogySymb9F/RtY=', CAST(N'2025-08-01T05:52:40.550' AS DateTime), NULL, NULL, CAST(N'2025-07-16T04:28:09.903' AS DateTime), 1, 0, 3, NULL)
INSERT [dbo].[Users] ([id], [email], [password], [fullname], [refresh_token], [expired_refresh_token], [Google_refresh_token], [Google_access_token], [created_at], [is_active], [is_deleted], [role_id], [GoogleAccessTokenExpiredAt]) VALUES (5, N'student5@gmail.com', N'$2a$11$Pqd4J3aXS6deR0LeT3GEue9pkOHpcgOwjYjMN.jXaWB2dvj2MVwNK', N'Phat', NULL, NULL, NULL, NULL, CAST(N'2025-07-22T04:36:19.013' AS DateTime), 1, 0, 4, NULL)
INSERT [dbo].[Users] ([id], [email], [password], [fullname], [refresh_token], [expired_refresh_token], [Google_refresh_token], [Google_access_token], [created_at], [is_active], [is_deleted], [role_id], [GoogleAccessTokenExpiredAt]) VALUES (6, N'phat@gmail.com', N'$2a$11$VqQEuS4nBtArjkhVlUYHQOrS1m3Li0bcbgKocawNZdIpOLU/5ZPlq', N'Phát', NULL, NULL, NULL, NULL, CAST(N'2025-07-22T05:53:40.490' AS DateTime), 1, 0, 4, NULL)
INSERT [dbo].[Users] ([id], [email], [password], [fullname], [refresh_token], [expired_refresh_token], [Google_refresh_token], [Google_access_token], [created_at], [is_active], [is_deleted], [role_id], [GoogleAccessTokenExpiredAt]) VALUES (7, N'phat1@gmail.com', N'$2a$11$zuAiWcUQKzOB5xJZ0FckluLR9tyL00hzI7SbT1M8pSRziW2GzKSRC', N'phatlv1', NULL, NULL, NULL, NULL, CAST(N'2025-07-22T05:56:23.757' AS DateTime), 1, 0, 4, NULL)
INSERT [dbo].[Users] ([id], [email], [password], [fullname], [refresh_token], [expired_refresh_token], [Google_refresh_token], [Google_access_token], [created_at], [is_active], [is_deleted], [role_id], [GoogleAccessTokenExpiredAt]) VALUES (8, N'phat12@gmail.com', N'$2a$11$91jQokvqMh7rV1csf4T9levxB/dcLSV5ZFqkUfrK/W7rZIveF926K', N'phat12', NULL, NULL, NULL, NULL, CAST(N'2025-07-22T06:01:36.493' AS DateTime), 1, 0, 4, NULL)
INSERT [dbo].[Users] ([id], [email], [password], [fullname], [refresh_token], [expired_refresh_token], [Google_refresh_token], [Google_access_token], [created_at], [is_active], [is_deleted], [role_id], [GoogleAccessTokenExpiredAt]) VALUES (9, N'levinhphat790@gmail.com', N'$2a$11$3I7GKf5LY7xCFFULSSwdku57lKRrCM8jYawLnmnDr9dPP2XSMyvlO', N'phat', N'kd1dilkjRMlHOWHiKc6PTls5nLHIRbk8HyfLojCBJ3Y=', CAST(N'2025-08-01T09:17:21.433' AS DateTime), N'1//0gWMPAJr4_T7UCgYIARAAGBASNwF-L9IrX1UL7UZ6PvMI9GNNttvU8GbckElCB9drYCk0QlKMAFE6Oy3DKCp2pDDMELgU6WopcJY', N'ya29.A0AS3H6NwIXcDDF4J5QMLEuhfdSchr7SytO6eRmZImzSXaIVUlNM8D2E1aOTxVbuEAbIZb_SP4WfItWdnBa15S29MH0GH-glnAWyyOa1RGdNzGN99y1AZI9m0Ia3xorTY3erfUCiXt75GlIyvsZ4W4FV4CLRlmNcr3hbw98QMWmEsro448ll2JgqStl5yh4Rcoo_IGEK4aCgYKAdYSARUSFQHGX2Mif-dEgFxr3anbVQzg9mT-hw0206', CAST(N'2025-07-22T07:40:51.203' AS DateTime), 1, 0, 1, CAST(N'2025-07-25T09:19:10.0361980' AS DateTime2))
INSERT [dbo].[Users] ([id], [email], [password], [fullname], [refresh_token], [expired_refresh_token], [Google_refresh_token], [Google_access_token], [created_at], [is_active], [is_deleted], [role_id], [GoogleAccessTokenExpiredAt]) VALUES (10, N'student2@gmail.com', N'$2a$11$8fWqhaWqj9Wrje8QOjv52OJINGZaHo/eC2zC7VgDUDTAF159p.7N2', N'student2', NULL, NULL, NULL, NULL, CAST(N'2025-07-23T00:41:25.110' AS DateTime), 1, 0, 4, NULL)
INSERT [dbo].[Users] ([id], [email], [password], [fullname], [refresh_token], [expired_refresh_token], [Google_refresh_token], [Google_access_token], [created_at], [is_active], [is_deleted], [role_id], [GoogleAccessTokenExpiredAt]) VALUES (11, N'student3@gmail.com', N'$2a$11$ZY6ReFFFJVonHUtuYsfPAe9UHXSKzT1XkyIoOMiPBj2GoFw/BrMc.', N'student3', NULL, NULL, NULL, NULL, CAST(N'2025-07-23T00:41:44.450' AS DateTime), 1, 0, 4, NULL)
INSERT [dbo].[Users] ([id], [email], [password], [fullname], [refresh_token], [expired_refresh_token], [Google_refresh_token], [Google_access_token], [created_at], [is_active], [is_deleted], [role_id], [GoogleAccessTokenExpiredAt]) VALUES (12, N'student4@gmail.com', N'$2a$11$ZEzUfFXo5xUe0c3AduqBGOr.jGEXti08h/DULcMPJcCWSNSTRJtMW', N'student4', NULL, NULL, NULL, NULL, CAST(N'2025-07-23T00:42:33.553' AS DateTime), 1, 0, 1, NULL)
INSERT [dbo].[Users] ([id], [email], [password], [fullname], [refresh_token], [expired_refresh_token], [Google_refresh_token], [Google_access_token], [created_at], [is_active], [is_deleted], [role_id], [GoogleAccessTokenExpiredAt]) VALUES (13, N'student6@gmail.com', N'$2a$11$U1xZ8YUFobuBQiFIdX4XaO6whshO9UyUxZ7i1Ze48tvHRY2Ayg2pm', N'student6', NULL, NULL, NULL, NULL, CAST(N'2025-07-23T01:08:17.487' AS DateTime), 1, 0, 4, NULL)
INSERT [dbo].[Users] ([id], [email], [password], [fullname], [refresh_token], [expired_refresh_token], [Google_refresh_token], [Google_access_token], [created_at], [is_active], [is_deleted], [role_id], [GoogleAccessTokenExpiredAt]) VALUES (14, N'phat789@gmail.com', N'$2a$11$YUPk0d.ov2JMqj.2Q7Auoe.AhTMo5MqhVa/pViC4oNj/OYvuHyNMC', N'phat789', NULL, NULL, NULL, NULL, CAST(N'2025-07-23T07:17:24.377' AS DateTime), 1, 0, 4, NULL)
INSERT [dbo].[Users] ([id], [email], [password], [fullname], [refresh_token], [expired_refresh_token], [Google_refresh_token], [Google_access_token], [created_at], [is_active], [is_deleted], [role_id], [GoogleAccessTokenExpiredAt]) VALUES (15, N'lecturer2@gmail.com', N'$2a$11$10aK7rViYUEsN51AVS8GvOIlx1IA9hURekRykVdNYwA7hXWvO123e', N'giảng viên 1', N'T2mv03otvjOkFlEqW4tg4Uc/LNe9PE/0A4KuH/YaU+w=', CAST(N'2025-07-31T22:28:05.143' AS DateTime), NULL, NULL, CAST(N'2025-07-24T06:32:39.150' AS DateTime), 1, 0, 2, NULL)
INSERT [dbo].[Users] ([id], [email], [password], [fullname], [refresh_token], [expired_refresh_token], [Google_refresh_token], [Google_access_token], [created_at], [is_active], [is_deleted], [role_id], [GoogleAccessTokenExpiredAt]) VALUES (16, N'minhquan141104@gmail.com', N'$2a$11$qDHjc00Fhy4OR0bgBX44VOcY4CSs2fRprKpchG5TnnvTvWGA71hzm', N'quan', N'uZtUgajXTQARzcK8ePV98IJFxg8WkAqXfReaixzxAgQ=', CAST(N'2025-08-01T09:20:34.823' AS DateTime), NULL, NULL, CAST(N'2025-07-24T11:08:46.037' AS DateTime), 1, 0, 2, NULL)
INSERT [dbo].[Users] ([id], [email], [password], [fullname], [refresh_token], [expired_refresh_token], [Google_refresh_token], [Google_access_token], [created_at], [is_active], [is_deleted], [role_id], [GoogleAccessTokenExpiredAt]) VALUES (17, N'levinhphat123@gmail.com', N'$2a$11$KnWlFa7UJSekd7kjiZ.T0.hZG5BBMP0QaZDzSifKxPKwMelshQZs.', N'levinhphat123', NULL, NULL, NULL, NULL, CAST(N'2025-07-24T13:55:02.507' AS DateTime), 1, 0, 2, NULL)
INSERT [dbo].[Users] ([id], [email], [password], [fullname], [refresh_token], [expired_refresh_token], [Google_refresh_token], [Google_access_token], [created_at], [is_active], [is_deleted], [role_id], [GoogleAccessTokenExpiredAt]) VALUES (18, N'kinawa2004@gmail.com', N'$2a$11$ZRvG0T1BJN8/zs/wLy3Tse76nYFtohV0cHG5qJEzz/3TkOWIhfI7.', N'Thang', N'w5QUt3j8kZY7Fwb7ZWuVRQROnwOpfKw08B/taVK8ftw=', CAST(N'2025-08-01T08:36:39.587' AS DateTime), NULL, NULL, CAST(N'2025-07-24T17:05:45.910' AS DateTime), 1, 0, 4, NULL)
SET IDENTITY_INSERT [dbo].[Users] OFF
GO
ALTER TABLE [dbo].[Exams] ADD  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[Exams] ADD  DEFAULT (CONVERT([bit],(0))) FOR [is_deleted]
GO
ALTER TABLE [dbo].[Meetings] ADD  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[Meetings] ADD  DEFAULT (CONVERT([bit],(0))) FOR [is_deleted]
GO
ALTER TABLE [dbo].[Meetings_Status] ADD  DEFAULT (CONVERT([bit],(0))) FOR [is_deleted]
GO
ALTER TABLE [dbo].[Report] ADD  DEFAULT (CONVERT([bit],(0))) FOR [is_deleted]
GO
ALTER TABLE [dbo].[Report] ADD  DEFAULT (CONVERT([bit],(0))) FOR [is_second]
GO
ALTER TABLE [dbo].[Report] ADD  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[Report_Feedback_Status] ADD  DEFAULT (CONVERT([bit],(0))) FOR [is_deleted]
GO
ALTER TABLE [dbo].[Report_Feedbacks] ADD  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[Report_Status] ADD  DEFAULT (CONVERT([bit],(0))) FOR [is_deleted]
GO
ALTER TABLE [dbo].[Roles] ADD  DEFAULT (CONVERT([bit],(0))) FOR [is_deleted]
GO
ALTER TABLE [dbo].[Tests_Score] ADD  DEFAULT (CONVERT([bit],(0))) FOR [is_final]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT (CONVERT([bit],(1))) FOR [is_active]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT (CONVERT([bit],(0))) FOR [is_deleted]
GO
ALTER TABLE [dbo].[Exams]  WITH CHECK ADD  CONSTRAINT [FK__Exams__examiner___5441852A] FOREIGN KEY([examiner_id])
REFERENCES [dbo].[Users] ([id])
GO
ALTER TABLE [dbo].[Exams] CHECK CONSTRAINT [FK__Exams__examiner___5441852A]
GO
ALTER TABLE [dbo].[Lecturers_Tests_Detail]  WITH CHECK ADD  CONSTRAINT [FK__Lecturers__lectu__5EBF139D] FOREIGN KEY([lecturer_id])
REFERENCES [dbo].[Users] ([id])
GO
ALTER TABLE [dbo].[Lecturers_Tests_Detail] CHECK CONSTRAINT [FK__Lecturers__lectu__5EBF139D]
GO
ALTER TABLE [dbo].[Lecturers_Tests_Detail]  WITH CHECK ADD  CONSTRAINT [FK__Lecturers__test___5DCAEF64] FOREIGN KEY([test_id])
REFERENCES [dbo].[Tests] ([id])
GO
ALTER TABLE [dbo].[Lecturers_Tests_Detail] CHECK CONSTRAINT [FK__Lecturers__test___5DCAEF64]
GO
ALTER TABLE [dbo].[Meetings]  WITH CHECK ADD  CONSTRAINT [FK__Meetings__meetin__797309D9] FOREIGN KEY([meeting_status_id])
REFERENCES [dbo].[Meetings_Status] ([id])
GO
ALTER TABLE [dbo].[Meetings] CHECK CONSTRAINT [FK__Meetings__meetin__797309D9]
GO
ALTER TABLE [dbo].[Meetings_Detail]  WITH CHECK ADD  CONSTRAINT [FK_Meetings_Detail_Meetings_MeetingId] FOREIGN KEY([MeetingId])
REFERENCES [dbo].[Meetings] ([id])
GO
ALTER TABLE [dbo].[Meetings_Detail] CHECK CONSTRAINT [FK_Meetings_Detail_Meetings_MeetingId]
GO
ALTER TABLE [dbo].[Meetings_Detail]  WITH CHECK ADD  CONSTRAINT [FK_Meetings_Detail_Users_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([id])
GO
ALTER TABLE [dbo].[Meetings_Detail] CHECK CONSTRAINT [FK_Meetings_Detail_Users_UserId]
GO
ALTER TABLE [dbo].[MeetingUser]  WITH CHECK ADD  CONSTRAINT [FK_MeetingUser_Meetings_MeetingsId] FOREIGN KEY([MeetingsId])
REFERENCES [dbo].[Meetings] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[MeetingUser] CHECK CONSTRAINT [FK_MeetingUser_Meetings_MeetingsId]
GO
ALTER TABLE [dbo].[MeetingUser]  WITH CHECK ADD  CONSTRAINT [FK_MeetingUser_Users_UsersId] FOREIGN KEY([UsersId])
REFERENCES [dbo].[Users] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[MeetingUser] CHECK CONSTRAINT [FK_MeetingUser_Users_UsersId]
GO
ALTER TABLE [dbo].[Report]  WITH CHECK ADD  CONSTRAINT [FK__Report__report_s__68487DD7] FOREIGN KEY([report_status_id])
REFERENCES [dbo].[Report_Status] ([id])
GO
ALTER TABLE [dbo].[Report] CHECK CONSTRAINT [FK__Report__report_s__68487DD7]
GO
ALTER TABLE [dbo].[Report]  WITH CHECK ADD  CONSTRAINT [FK__Report__student___6754599E] FOREIGN KEY([student_id])
REFERENCES [dbo].[Users] ([id])
GO
ALTER TABLE [dbo].[Report] CHECK CONSTRAINT [FK__Report__student___6754599E]
GO
ALTER TABLE [dbo].[Report]  WITH CHECK ADD  CONSTRAINT [FK__Report__test_id__693CA210] FOREIGN KEY([test_id])
REFERENCES [dbo].[Tests] ([id])
GO
ALTER TABLE [dbo].[Report] CHECK CONSTRAINT [FK__Report__test_id__693CA210]
GO
ALTER TABLE [dbo].[Report_Feedbacks]  WITH CHECK ADD  CONSTRAINT [FK__Report_Fe__exami__70DDC3D8] FOREIGN KEY([examiner_id])
REFERENCES [dbo].[Users] ([id])
GO
ALTER TABLE [dbo].[Report_Feedbacks] CHECK CONSTRAINT [FK__Report_Fe__exami__70DDC3D8]
GO
ALTER TABLE [dbo].[Report_Feedbacks]  WITH CHECK ADD  CONSTRAINT [FK__Report_Fe__repor__6FE99F9F] FOREIGN KEY([report_id])
REFERENCES [dbo].[Report] ([id])
GO
ALTER TABLE [dbo].[Report_Feedbacks] CHECK CONSTRAINT [FK__Report_Fe__repor__6FE99F9F]
GO
ALTER TABLE [dbo].[Report_Feedbacks]  WITH CHECK ADD  CONSTRAINT [FK__Report_Fe__repor__71D1E811] FOREIGN KEY([report_feedback_status_id])
REFERENCES [dbo].[Report_Feedback_Status] ([id])
GO
ALTER TABLE [dbo].[Report_Feedbacks] CHECK CONSTRAINT [FK__Report_Fe__repor__71D1E811]
GO
ALTER TABLE [dbo].[Tests]  WITH CHECK ADD  CONSTRAINT [FK__Tests__exam_id__5AEE82B9] FOREIGN KEY([exam_id])
REFERENCES [dbo].[Exams] ([id])
GO
ALTER TABLE [dbo].[Tests] CHECK CONSTRAINT [FK__Tests__exam_id__5AEE82B9]
GO
ALTER TABLE [dbo].[Tests]  WITH CHECK ADD  CONSTRAINT [FK__Tests__student_i__571DF1D5] FOREIGN KEY([student_id])
REFERENCES [dbo].[Users] ([id])
GO
ALTER TABLE [dbo].[Tests] CHECK CONSTRAINT [FK__Tests__student_i__571DF1D5]
GO
ALTER TABLE [dbo].[Tests_Score]  WITH CHECK ADD  CONSTRAINT [FK__Tests_Sco__test___5AEE82B9] FOREIGN KEY([test_id])
REFERENCES [dbo].[Tests] ([id])
GO
ALTER TABLE [dbo].[Tests_Score] CHECK CONSTRAINT [FK__Tests_Sco__test___5AEE82B9]
GO
ALTER TABLE [dbo].[Users]  WITH CHECK ADD  CONSTRAINT [FK__Users__role_id__5070F446] FOREIGN KEY([role_id])
REFERENCES [dbo].[Roles] ([id])
GO
ALTER TABLE [dbo].[Users] CHECK CONSTRAINT [FK__Users__role_id__5070F446]
GO
