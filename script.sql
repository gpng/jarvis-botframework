USE [JARVISCHATBOT]
GO

/* CREATE TABLE [START] */
/****** Object:  Table [dbo].[tbl_dialog]    Script Date: 25/6/2017 1:09:54 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

SET ANSI_PADDING ON
GO

CREATE TABLE [dbo].[tbl_dialog](
	[intent] [varchar](255) NULL,
	[step] [int] NULL,
	[text] [varchar](255) NULL,
	[description] [varchar](255) NULL,
	[attachment_url] [varchar](255) NULL
) ON [PRIMARY]

GO

SET ANSI_PADDING OFF
GO

/* CREATE TABLE [END] */

/* INSERT DATA [START] */

INSERT [dbo].[tbl_dialog] ([intent], [step], [text], [description], [attachment_url]) VALUES (N'ss_account_change_password', 1, N'Log into EAIM (url here)', N'', N'')
INSERT [dbo].[tbl_dialog] ([intent], [step], [text], [description], [attachment_url]) VALUES (N'ss_account_change_password', 2, N'Under "Systems with Self-Service Facility", click on "Change Password"', N'', N'')
INSERT [dbo].[tbl_dialog] ([intent], [step], [text], [description], [attachment_url]) VALUES (N'ss_account_change_password', 3, N'Select the ID/System you need to change password. (e.g. Change Oracle password)', N'', N'')
INSERT [dbo].[tbl_dialog] ([intent], [step], [text], [description], [attachment_url]) VALUES (N'ss_account_change_password', 4, N'Click "Submit"', N'', N'')
INSERT [dbo].[tbl_dialog] ([intent], [step], [text], [description], [attachment_url]) VALUES (N'ss_account_unlock', 1, N'account unlock step 1', N'', N'')
INSERT [dbo].[tbl_dialog] ([intent], [step], [text], [description], [attachment_url]) VALUES (N'ss_cannot_start_outlook', 1, N'account unlock step 1', N'', N'')
INSERT [dbo].[tbl_dialog] ([intent], [step], [text], [description], [attachment_url]) VALUES (N'ss_mail_mailbox_owner', 1, N'account unlock step 1', N'', N'')
INSERT [dbo].[tbl_dialog] ([intent], [step], [text], [description], [attachment_url]) VALUES (N'ss_phone_check_voicemail', 1, N'account unlock step 1', N'', N'')
INSERT [dbo].[tbl_dialog] ([intent], [step], [text], [description], [attachment_url]) VALUES (N'ss_phone_record_greeting', 1, N'account unlock step 1', N'', N'')
INSERT [dbo].[tbl_dialog] ([intent], [step], [text], [description], [attachment_url]) VALUES (N'ss_printer_setup', 1, N'account unlock step 1', N'', N'')
INSERT [dbo].[tbl_dialog] ([intent], [step], [text], [description], [attachment_url]) VALUES (N'ss_account_unlock', 2, N'account unlock step 2', N'', N'')
INSERT [dbo].[tbl_dialog] ([intent], [step], [text], [description], [attachment_url]) VALUES (N'ss_account_unlock', 3, N'account unlock step 3', N'', N'')
INSERT [dbo].[tbl_dialog] ([intent], [step], [text], [description], [attachment_url]) VALUES (N'ss_account_unlock', 4, N'account unlock step 4', N'', N'')

/* INSERT DATA [END] */