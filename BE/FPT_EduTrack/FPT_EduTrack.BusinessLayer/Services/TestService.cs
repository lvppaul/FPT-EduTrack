using FPT_EduTrack.BusinessLayer.Interfaces;
using FPT_EduTrack.BusinessLayer.DTOs.Request;
using FPT_EduTrack.BusinessLayer.DTOs.Response;
using FPT_EduTrack.BusinessLayer.Mappings;
using FPT_EduTrack.DataAccessLayer.Entities;
using FPT_EduTrack.DataAccessLayer.UnitOfWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPT_EduTrack.BusinessLayer.Services
{
    public class TestService : ITestService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICloudinaryService _cloudinaryService;

        public TestService(IUnitOfWork unitOfWork, ICloudinaryService cloudinaryService)
        {
            _unitOfWork = unitOfWork;
            _cloudinaryService = cloudinaryService;
        }

        public async Task<List<Test>> GetTestsAsync()
        {
            try
            {
                return await _unitOfWork.TestRepository.GetTestsAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error retrieving tests", ex);
            }
        }

        public async Task<List<TestResponse>> GetTestResponsesAsync()
        {
            try
            {
                var tests = await _unitOfWork.TestRepository.GetTestsAsync();
                if (tests == null || !tests.Any())
                    return new List<TestResponse>();

                return tests.Select(TestMapper.ToResponse).ToList();
            }
            catch (Exception ex)
            {
                throw new Exception("Error retrieving test responses", ex);
            }
        }

        public async Task<List<TestResponse>> GetTestsByStudentIdAsync(int studentId)
        {
            try
            {
                var allTests = await GetTestResponsesAsync();
                return allTests.Where(t => t.StudentId == studentId).ToList();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving tests for student ID {studentId}", ex);
            }
        }

        public async Task<TestResponse?> GetTestByIdAsync(int testId)
        {
            try
            {
                var test = await _unitOfWork.TestRepository.GetByIdAsync(testId);
                if (test == null)
                    return null;

                // Load navigation properties manually if needed
                var testWithIncludes = await _unitOfWork.TestRepository.GetTestsAsync();
                var foundTest = testWithIncludes.FirstOrDefault(t => t.Id == testId);
                
                return foundTest != null ? TestMapper.ToResponse(foundTest) : null;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving test with ID {testId}", ex);
            }
        }

        public async Task<TestFileUploadResponse> UploadTestFilesAsync(TestFileUploadRequest request)
        {
            try
            {
                var response = new TestFileUploadResponse
                {
                    Success = false,
                    Message = "Upload failed"
                };

                // Validate files - Support .doc, .docx, .pdf for document files
                var allowedExtensions = new List<string> { ".doc", ".docx", ".pdf", ".txt" };
                const long maxFileSize = 10 * 1024 * 1024; // 10MB

                var validFiles = new List<Microsoft.AspNetCore.Http.IFormFile>();
                var invalidFiles = new List<string>();

                foreach (var file in request.Files)
                {
                    if (!_cloudinaryService.IsValidFileType(file, allowedExtensions))
                    {
                        invalidFiles.Add($"{file.FileName} - Invalid file type. Allowed: {string.Join(", ", allowedExtensions)}");
                        continue;
                    }

                    if (!_cloudinaryService.IsValidFileSize(file, maxFileSize))
                    {
                        invalidFiles.Add($"{file.FileName} - File size exceeds 10MB limit (current: {file.Length / (1024 * 1024)}MB)");
                        continue;
                    }

                    validFiles.Add(file);
                }

                if (invalidFiles.Any())
                {
                    response.Message = $"Invalid files detected: {string.Join(", ", invalidFiles)}";
                    return response;
                }

                if (!validFiles.Any())
                {
                    response.Message = "No valid files to upload";
                    return response;
                }

                // Upload files to Cloudinary with specific folder for test files
                var uploadResults = await _cloudinaryService.UploadFilesAsync(validFiles, "test-documents");

                if (uploadResults.Any())
                {
                    response.Success = true;
                    response.Message = $"Successfully uploaded {uploadResults.Count} file(s)";
                    response.UploadedFiles = uploadResults;
                    response.TotalFilesUploaded = uploadResults.Count;
                    response.CreatedAt = DateTime.UtcNow;
                    response.Code = request.Code;
                    response.Title = request.Title;
                    response.Description = request.Description;
                    response.StudentId = request.StudentId;
                }
                else
                {
                    response.Message = "No files were successfully uploaded";
                }

                return response;
            }
            catch (Exception ex)
            {
                throw new Exception("Error uploading test files", ex);
            }
        }

        public async Task<TestResponse> CreateTestWithFilesAsync(TestFileUploadRequest request)
        {
            try
            {
                await _unitOfWork.BeginTransactionAsync();

                // Upload files first
                var uploadResult = await UploadTestFilesAsync(request);
                
                if (!uploadResult.Success)
                {
                    throw new Exception($"File upload failed: {uploadResult.Message}");
                }

                // Create test entity
                var test = new Test
                {
                    Code = request.Code?.Trim(),
                    Title = request.Title?.Trim(),
                    Content = request.Description?.Trim(),
                    StudentId = request.StudentId,
                    // Store file URLs in Link field - you might want to create a separate table for better file management
                    Link = string.Join(";", uploadResult.UploadedFiles.Select(f => f.SecureUrl))
                };

                await _unitOfWork.TestRepository.CreateAsync(test);
                await _unitOfWork.CommitTransactionAsync();

                // Return the created test
                var createdTest = await GetTestByIdAsync(test.Id);
                return createdTest ?? throw new Exception("Failed to retrieve created test");
            }
            catch (Exception)
            {
                await _unitOfWork.RollbackTransactionAsync();
                throw;
            }
        }
    }
}
