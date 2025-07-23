using FPT_EduTrack.BusinessLayer.DTOs.Request;
using FPT_EduTrack.BusinessLayer.DTOs.Response;
using FPT_EduTrack.DataAccessLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPT_EduTrack.BusinessLayer.Interfaces
{
    public interface ITestService
    {
        Task<List<Test>> GetTestsAsync();
        Task<List<TestResponse>> GetTestResponsesAsync();
        Task<List<TestResponse>> GetTestResponsesByExamIdAsync(int examId);
        Task<List<TestResponse>> GetTestResponsesByExamIdAndStudentIdAsync(int examId,int studentId);
        Task<List<TestResponse>> GetTestResponsesByExamIdAndLecturerIdIsGradingAsync(int examId, int lecturerId);
        Task<List<TestResponse>> GetTestsByStudentIdAsync(int studentId);
      
        Task<TestResponse?> GetTestByIdAsync(int testId);
        Task<TestFileUploadResponse> UploadTestFilesAsync(TestFileUploadRequest request);
        Task<TestResponse> CreateTestWithFilesAsync(TestFileUploadRequest request);
        Task<TestUpdateResponse> UpdateTestAsync(TestUpdateRequest request);
        Task<bool> DeleteTestAsync(int testId);

        //---------Examiner     ---------//
        Task<List<TestResponse>> GetCurrentExamTestAsync(int status, int pageSize, int pageNumber);
    }
}
