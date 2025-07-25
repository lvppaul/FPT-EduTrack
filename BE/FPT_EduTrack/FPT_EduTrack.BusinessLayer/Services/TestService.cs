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
                    response.ExamId = request.ExamId;   
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
                    ExamId = request.ExamId,
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

        public async Task<TestUpdateResponse> UpdateTestAsync(TestUpdateRequest request)
        {
            try
            {
                await _unitOfWork.BeginTransactionAsync();

                var response = new TestUpdateResponse
                {
                    Success = false,
                    Message = "Update failed",
                    UpdatedAt = DateTime.UtcNow
                };

                // Get existing test
                var existingTest = await _unitOfWork.TestRepository.GetByIdAsync(request.Id);
                if (existingTest == null)
                {
                    response.Message = $"Test with ID {request.Id} not found";
                    return response;
                }

                // Update basic test information
                existingTest.Code = request.Code?.Trim() ?? existingTest.Code;
                existingTest.Title = request.Title?.Trim() ?? existingTest.Title;
                existingTest.Content = request.Content?.Trim() ?? existingTest.Content;
                existingTest.StudentId = request.StudentId ?? existingTest.StudentId;
                existingTest.ExamId = request.ExamId ?? existingTest.ExamId;

                // Handle file management
                var currentFileUrls = new List<string>();
                if (!string.IsNullOrEmpty(existingTest.Link))
                {
                    currentFileUrls = existingTest.Link.Split(';', StringSplitOptions.RemoveEmptyEntries).ToList();
                }

                // Remove files if specified
                var removedFiles = new List<string>();
                if (request.FilesToRemove != null && request.FilesToRemove.Any())
                {
                    foreach (var publicIdToRemove in request.FilesToRemove)
                    {
                        try
                        {
                            var deleted = await _cloudinaryService.DeleteFileAsync(publicIdToRemove);
                            if (deleted)
                            {
                                removedFiles.Add(publicIdToRemove);
                                // Remove URL from current files (this is simplified - you might want to store publicId separately)
                                var urlToRemove = currentFileUrls.FirstOrDefault(url => url.Contains(publicIdToRemove));
                                if (urlToRemove != null)
                                {
                                    currentFileUrls.Remove(urlToRemove);
                                }
                            }
                        }
                        catch (Exception ex)
                        {
                            // Log warning but continue with other operations
                            Console.WriteLine($"Warning: Failed to delete file {publicIdToRemove}: {ex.Message}");
                        }
                    }
                }

                // Upload new files if provided
                var newUploadedFiles = new List<FileUploadResponse>();
                if (request.NewFiles != null && request.NewFiles.Any())
                {
                    // Validate new files
                    var allowedExtensions = new List<string> { ".doc", ".docx", ".pdf", ".txt" };
                    const long maxFileSize = 10 * 1024 * 1024; // 10MB

                    var validFiles = new List<Microsoft.AspNetCore.Http.IFormFile>();
                    var invalidFiles = new List<string>();

                    foreach (var file in request.NewFiles)
                    {
                        var (isValid, errorMessage) = _cloudinaryService.ValidateDocumentFile(file, 10);
                        if (!isValid)
                        {
                            invalidFiles.Add($"{file.FileName}: {errorMessage}");
                            continue;
                        }
                        validFiles.Add(file);
                    }

                    if (invalidFiles.Any())
                    {
                        await _unitOfWork.RollbackTransactionAsync();
                        response.Message = $"Invalid files detected: {string.Join(", ", invalidFiles)}";
                        return response;
                    }

                    if (validFiles.Any())
                    {
                        try
                        {
                            newUploadedFiles = await _cloudinaryService.UploadFilesAsync(validFiles, "test-documents");
                            currentFileUrls.AddRange(newUploadedFiles.Select(f => f.SecureUrl));
                        }
                        catch (Exception ex)
                        {
                            await _unitOfWork.RollbackTransactionAsync();
                            response.Message = $"File upload failed: {ex.Message}";
                            return response;
                        }
                    }
                }

                // Handle file replacement logic
                if (!request.KeepExistingFiles && request.NewFiles != null && request.NewFiles.Any())
                {
                    // Replace all existing files with new ones
                    // First, try to delete all existing files
                    var existingUrls = existingTest.Link?.Split(';', StringSplitOptions.RemoveEmptyEntries) ?? Array.Empty<string>();
                    foreach (var url in existingUrls)
                    {
                        try
                        {
                            // Extract public ID from URL (this is simplified)
                            var publicId = ExtractPublicIdFromUrl(url);
                            if (!string.IsNullOrEmpty(publicId))
                            {
                                await _cloudinaryService.DeleteFileAsync(publicId);
                            }
                        }
                        catch
                        {
                            // Continue even if some deletions fail
                        }
                    }
                    currentFileUrls = newUploadedFiles.Select(f => f.SecureUrl).ToList();
                }

                // Update the link field with current file URLs
                existingTest.Link = currentFileUrls.Any() ? string.Join(";", currentFileUrls) : null;

                // Save changes to database
                var updateResult = await _unitOfWork.TestRepository.UpdateAsync(existingTest);
                if (updateResult == 0)
                {
                    await _unitOfWork.RollbackTransactionAsync();
                    response.Message = "Failed to update test in database";
                    return response;
                }

                await _unitOfWork.CommitTransactionAsync();

                // Get updated test for response
                var updatedTest = await GetTestByIdAsync(request.Id);

                response.Success = true;
                response.Message = "Test updated successfully";
                response.UpdatedTest = updatedTest;
                response.NewFilesUploaded = newUploadedFiles;
                response.FilesRemoved = removedFiles;
                response.TotalNewFilesUploaded = newUploadedFiles.Count;
                response.TotalFilesRemoved = removedFiles.Count;

                return response;
            }
            catch (Exception ex)
            {
                await _unitOfWork.RollbackTransactionAsync();
                throw new Exception("Error updating test", ex);
            }
        }

        public async Task<bool> DeleteTestAsync(int testId)
        {
            try
            {
                await _unitOfWork.BeginTransactionAsync();

                var test = await _unitOfWork.TestRepository.GetByIdAsync(testId);
                if (test == null)
                {
                    return false;
                }

                // Delete associated files from Cloudinary
                if (!string.IsNullOrEmpty(test.Link))
                {
                    var fileUrls = test.Link.Split(';', StringSplitOptions.RemoveEmptyEntries);
                    foreach (var url in fileUrls)
                    {
                        try
                        {
                            var publicId = ExtractPublicIdFromUrl(url);
                            if (!string.IsNullOrEmpty(publicId))
                            {
                                await _cloudinaryService.DeleteFileAsync(publicId);
                            }
                        }
                        catch
                        {
                            // Continue even if some file deletions fail
                        }
                    }
                }

                // Delete test from database
                var deleted = await _unitOfWork.TestRepository.RemoveAsync(test);
                if (!deleted)
                {
                    await _unitOfWork.RollbackTransactionAsync();
                    return false;
                }

                await _unitOfWork.CommitTransactionAsync();
                return true;
            }
            catch (Exception)
            {
                await _unitOfWork.RollbackTransactionAsync();
                throw;
            }
        }

        /// <summary>
        /// Extracts public ID from Cloudinary URL
        /// This is a simplified version - you might want to improve this based on your URL structure
        /// </summary>
        private string ExtractPublicIdFromUrl(string url)
        {
            try
            {
                if (string.IsNullOrEmpty(url))
                    return string.Empty;

                // Cloudinary URLs typically have format: https://res.cloudinary.com/{cloud_name}/{resource_type}/{delivery_type}/{folder}/{public_id}.{format}
                var uri = new Uri(url);
                var segments = uri.AbsolutePath.Split('/', StringSplitOptions.RemoveEmptyEntries);
                
                if (segments.Length >= 4)
                {
                    // Get the public ID (usually the last segment without extension)
                    var lastSegment = segments[segments.Length - 1];
                    var publicId = Path.GetFileNameWithoutExtension(lastSegment);
                    
                    // Include folder structure if exists
                    if (segments.Length > 4)
                    {
                        var folderParts = segments.Skip(3).Take(segments.Length - 4).ToList();
                        folderParts.Add(publicId);
                        return string.Join("/", folderParts);
                    }
                    
                    return publicId;
                }
                
                return string.Empty;
            }
            catch
            {
                return string.Empty;
            }
        }

        public async Task<List<TestResponse>> GetTestResponsesByExamIdAsync(int examId)
        {
            try
            {
                if (examId <= 0)
                    throw new ArgumentException("Invalid exam ID");

                var tests = await _unitOfWork.TestRepository.GetTestsAsync();
                if (tests == null || !tests.Any())
                    return new List<TestResponse>();

                // Filter tests by examId and convert to TestResponse
                var filteredTests = tests.Where(t => t.ExamId == examId).ToList();
                return filteredTests.Select(TestMapper.ToResponse).ToList();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving tests for exam ID {examId}", ex);
            }
        }

        public async Task<List<TestResponse>> GetTestResponsesByExamIdAndStudentIdAsync(int examId, int studentId)
        {
            try
            {
                if (examId <= 0)
                    throw new ArgumentException("Invalid exam ID");
                
                if (studentId <= 0)
                    throw new ArgumentException("Invalid student ID");

                var tests = await _unitOfWork.TestRepository.GetTestsAsync();
                if (tests == null || !tests.Any())
                    return new List<TestResponse>();

                // Filter tests by both examId and studentId, then convert to TestResponse
                var filteredTests = tests
                    .Where(t => t.ExamId == examId && t.StudentId == studentId)
                    .ToList();
                
                return filteredTests.Select(TestMapper.ToResponse).ToList();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving tests for exam ID {examId} and student ID {studentId}", ex);
            }
        }

        public async Task<List<TestResponse>> GetTestResponsesByExamIdAndLecturerIdIsGradingAsync(int examId, int lecturerId)
        {
            try
            {
                if (examId <= 0)
                    throw new ArgumentException("Invalid exam ID");

                if (lecturerId <= 0)
                    throw new ArgumentException("Invalid student ID");

                var tests = await _unitOfWork.TestRepository.GetTestsAsync();
                if (tests == null || !tests.Any())
                    return new List<TestResponse>();

                
                var filteredTests = tests
                    .Where(t => t.ExamId == examId).Where( t => t.LecturersTestsDetails.Any(ltd =>  ltd.isGrading == true))
                    .ToList();

                

                return filteredTests.Select(TestMapper.ToResponse).ToList();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving tests for exam ID {examId} and lecturer ID {lecturerId}", ex);
            }
        }

        public async Task<List<TestResponse>> GetCurrentExamTestAsync(int status, int pageSize, int pageNumber)
        {
            try
            {
                if (pageSize <= 0)
                    throw new ArgumentException("Page size must be greater than 0");
                
                if (pageNumber <= 0)
                    throw new ArgumentException("Page number must be greater than 0");

                // Get all tests with their exams
                var tests = await _unitOfWork.TestRepository.GetTestsAsync();
                if (tests == null || !tests.Any())
                    return new List<TestResponse>();

                // Filter tests based on exam status - exclude Cancelled, Postponed, Completed
                var excludedStatuses = new List<string>
                {
                    ExamStatus.Cancelled.ToString(),
                    ExamStatus.Postponed.ToString(),
                    ExamStatus.Completed.ToString()
                };

                var filteredTests = tests
                    .Where(t => t.Exam != null && 
                               !t.isDeleted.GetValueOrDefault() &&
                               !string.IsNullOrEmpty(t.Exam.Status) &&
                               !excludedStatuses.Contains(t.Exam.Status))
                    .OrderBy(t => t.Exam.CreatedAt ?? DateTime.MinValue) // Order by exam creation date, then by test ID
                    .ThenBy(t => t.Id)
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();

                return filteredTests.Select(TestMapper.ToResponse).ToList();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving current exam tests with pagination (PageSize: {pageSize}, PageNumber: {pageNumber})", ex);
            }
        }

        public async Task<AssignLecturerDto> AssignLecturerToTest(AssignLecturerDto dto)
        {
            try
            {
                var test = await _unitOfWork.TestRepository.GetByIdAsync(dto.TestId);
                var lecturer = await _unitOfWork.UserRepository.GetByIdAsync(dto.LecturerId);

                if (test == null || lecturer == null)
                    return null;

                var existed = await _unitOfWork.TestRepository.IsLecturerAssigned(dto.LecturerId, dto.TestId);

                if (existed)
                    return null;
                var link = new LecturersTestsDetail
                {
                    TestId = dto.TestId,
                    LecturerId = dto.LecturerId,
                    Score = dto.Score ?? 0,
                    Reason = dto.Reason,
                    isGrading = dto.isGrading ?? true
                };
                await _unitOfWork.LecturerTestDetailRepository.CreateAsync(link);
                return new AssignLecturerDto
                {
                    TestId = dto.TestId,
                    LecturerId = dto.LecturerId,
                    Score = link.Score,
                    Reason = link.Reason,
                    isGrading = link.isGrading
                };
            }
            catch (Exception e)
            {

                throw new Exception("Error at AssignLecturerToTest"+ e);
            }
           
        }

        public async Task<List<TestResponse>> GetTestsDontHaveReportByLecturer(int lecturerId, bool isGrading = true)
        {
            try
            {
               var tests = await _unitOfWork.LecturerTestDetailRepository.GetTestsByLecturer(lecturerId, isGrading);
                if (tests == null || !tests.Any())
                    return null;
                var allReports = await _unitOfWork.ReportRepository.GetAllAsync(); // await trước!

                var testIdsWithReports = allReports
                    .Where(r => r.TestId != null)
                    .Select(r => r.TestId.Value)
                    .Distinct()
                    .ToHashSet();

                var validTests = tests
     .Where(t => t.Test != null
              && t.Test.isDeleted == false
              && !testIdsWithReports.Contains(t.Test.Id))
     .Select(t => TestMapper.ToResponse(t.Test))
     .ToList();
                return validTests;
            }
            catch (Exception e)
            {

                throw new Exception("Error at GetTestsByLecturer" + e);
            }
        }

        public async Task<bool> UpdateLecturerTestDetailChangeReportStatus(int reportId,int reportStatusId,AssignLecturerDto dto)
        {
            try
            {
                var reportStatus = await _unitOfWork.ReportRepository.UpdateReportStatusAsync(reportId,reportStatusId);
                if (reportStatus == 0)
                {
                    throw new Exception($"Failed to update report status for ReportId: {reportId}");
                }
                var result = await _unitOfWork.LecturerTestDetailRepository.GetLecturerTestDetailByLecturerIdAndTestId(dto.LecturerId, dto.TestId);
                if (result == null)
                {
                    throw new Exception($"No lecturer test detail found for LecturerId: {dto.LecturerId} and TestId: {dto.TestId}");
                }

                // Update trực tiếp vào entity đang được tracked
                result.Score = dto.Score ?? 0;
                result.Reason = dto.Reason;
                result.isGrading = dto.isGrading ?? true;

                var test = await _unitOfWork.TestRepository.GetByIdAsync(dto.TestId);
                if (test == null)
                {
                    throw new Exception($"Test with ID {dto.TestId} not found");
                }
                test.Score = (float)result.Score;

                var updateLecturerTestDetail = await _unitOfWork.LecturerTestDetailRepository.UpdateAsync(result);
                var updateTest = await _unitOfWork.TestRepository.UpdateAsync(test);

                if (updateLecturerTestDetail == 0 || updateTest == 0)
                {
                    throw new Exception("Failed to update lecturer test detail or test");
                }
                return true;
            }
            catch (Exception e)
            {
                throw new Exception("Error at UpdateLecturerTestDetail: " + e.Message, e);
            }
        }

        public async Task<bool> UpdateLecturerTestDetail( AssignLecturerDto dto)
        {
            try
            {
               
                var result = await _unitOfWork.LecturerTestDetailRepository.GetLecturerTestDetailByLecturerIdAndTestId(dto.LecturerId, dto.TestId);
                if (result == null)
                {
                    throw new Exception($"No lecturer test detail found for LecturerId: {dto.LecturerId} and TestId: {dto.TestId}");
                }

                // Update trực tiếp vào entity đang được tracked
                result.Score = dto.Score ?? 0;
                result.Reason = dto.Reason;
                result.isGrading = dto.isGrading ?? false;

                var test = await _unitOfWork.TestRepository.GetByIdAsync(dto.TestId);
                if (test == null)
                {
                    throw new Exception($"Test with ID {dto.TestId} not found");
                }
                test.Score = (float)result.Score;

                var updateLecturerTestDetail = await _unitOfWork.LecturerTestDetailRepository.UpdateAsync(result);
                var updateTest = await _unitOfWork.TestRepository.UpdateAsync(test);

                if (updateLecturerTestDetail == 0 || updateTest == 0)
                {
                    throw new Exception("Failed to update lecturer test detail or test");
                }
                return true;
            }
            catch (Exception e)
            {
                throw new Exception("Error at UpdateLecturerTestDetail: " + e.Message, e);
            }
        }

   
    }
}
