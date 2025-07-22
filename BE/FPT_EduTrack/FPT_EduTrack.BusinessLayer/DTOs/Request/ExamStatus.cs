using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPT_EduTrack.BusinessLayer.DTOs.Request
{
    public enum ExamStatus
    {
        /// <summary>
        /// Exam is currently ongoing, students are taking the exam
        /// </summary>
        InProgress,

        /// <summary>
        /// Exam has been completed, no more examination activities
        /// </summary>
        Completed,

        /// <summary>
        /// Exam papers are being graded by the organizing committee
        /// </summary>
        Grading,

        /// <summary>
        /// Exam results have been published to students
        /// </summary>
        ResultsPublished,

        /// <summary>
        /// Students have requested score review, and the organizing committee is processing appeals
        /// </summary>
        UnderReview,

        /// <summary>
        /// Exam has been postponed or rescheduled due to some reason (weather, technical issues, etc.)
        /// </summary>
        Postponed,

        /// <summary>
        /// Exam has been completely cancelled and will not be held
        /// </summary>
        Cancelled
    }
}
