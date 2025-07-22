using FPT_EduTrack.BusinessLayer.DTOs.Request;
using FPT_EduTrack.BusinessLayer.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FPT_EduTrack.Api.Controllers
{
    [ApiController]
    [Route("api/")]
    public class TestController : ControllerBase
    {
        private readonly ITestService _testService;
        private readonly ILogger<TestController> _logger;
        private readonly ICloudinaryService _cloudinaryService;

        public TestController(ITestService testService, ILogger<TestController> logger, ICloudinaryService cloudinaryService)
        {
            _testService = testService;
            _logger = logger;
            _cloudinaryService = cloudinaryService;
        }

        /// <summary>
        /// Get all tests with complete information
        /// </summary>
        /// <returns>List of tests with student information, scores, and reports status</returns>
        [HttpGet]
        [Route("tests")]
        public async Task<IActionResult> GetTests()
        {
            try
            {
                var tests = await _testService.GetTestResponsesAsync();
                
                if (tests == null || !tests.Any())
                {
                    return Ok(new
                    {
                        success = true,
                        message = "No tests found",
                        data = new List<object>(),
                        count = 0
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Tests retrieved successfully",
                    data = tests,
                    count = tests.Count
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving tests");
                return StatusCode(500, new
                {
                    success = false,
                    message = "An error occurred while retrieving tests",
                    error = ex.Message
                });
            }
        }

        /// <summary>
        /// Get test by ID
        /// </summary>
        /// <param name="id">The test ID</param>
        /// <returns>Test information</returns>
        [HttpGet]
        [Route("tests/{id:int}")]
        public async Task<IActionResult> GetTestById(int id)
        {
            try
            {
                var test = await _testService.GetTestByIdAsync(id);
                
                if (test == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = $"Test with ID {id} not found"
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Test retrieved successfully",
                    data = test
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving test {TestId}", id);
                return StatusCode(500, new
                {
                    success = false,
                    message = $"An error occurred while retrieving test {id}",
                    error = ex.Message
                });
            }
        }

        /// <summary>
        /// Get tests by student ID
        /// </summary>
        /// <param name="studentId">The student ID to filter tests</param>
        /// <returns>List of tests for the specified student</returns>
        [HttpGet]
        [Route("student/{studentId:int}/tests/")]
        public async Task<IActionResult> GetTestsByStudentId(int studentId)
        {
            try
            {
                var studentTests = await _testService.GetTestsByStudentIdAsync(studentId);

                if (!studentTests.Any())
                {
                    return Ok(new
                    {
                        success = true,
                        message = $"No tests found for student ID {studentId}",
                        data = new List<object>(),
                        count = 0
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = $"Tests for student ID {studentId} retrieved successfully",
                    data = studentTests,
                    count = studentTests.Count
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving tests for student {StudentId}", studentId);
                return StatusCode(500, new
                {
                    success = false,
                    message = $"An error occurred while retrieving tests for student {studentId}",
                    error = ex.Message
                });
            }
        }

        /// <summary>
        /// Get tests by exam ID
        /// </summary>
        /// <param name="examId">The exam ID to filter tests</param>
        /// <returns>List of tests for the specified exam</returns>
        [HttpGet]
        [Route("exams/{examId}/tests")]
        public async Task<IActionResult> GetTestsByExamId(int examId)
        {
            try
            {
                var examTests = await _testService.GetTestResponsesByExamIdAsync(examId);

                if (!examTests.Any())
                {
                    return Ok(new
                    {
                        success = true,
                        message = $"No tests found for exam ID {examId}",
                        data = new List<object>(),
                        count = 0
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = $"Tests for exam ID {examId} retrieved successfully",
                    data = examTests,
                    count = examTests.Count
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving tests for exam {ExamId}", examId);
                return StatusCode(500, new
                {
                    success = false,
                    message = $"An error occurred while retrieving tests for exam {examId}",
                    error = ex.Message
                });
            }
        }

        /// <summary>
        /// Get tests by exam ID and student ID
        /// </summary>
        /// <param name="examId">The exam ID to filter tests</param>
        /// <param name="studentId">The student ID to filter tests</param>
        /// <returns>List of tests for the specified exam and student</returns>
        [HttpGet]
        [Route("exams/{examId}/students/{studentId}/tests")]
        public async Task<IActionResult> GetTestsByExamIdAndStudentId(int examId, int studentId)
        {
            try
            {
                var tests = await _testService.GetTestResponsesByExamIdAndStudentIdAsync(examId, studentId);

                if (!tests.Any())
                {
                    return Ok(new
                    {
                        success = true,
                        message = $"No tests found for exam ID {examId} and student ID {studentId}",
                        data = new List<object>(),
                        count = 0
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = $"Tests for exam ID {examId} and student ID {studentId} retrieved successfully",
                    data = tests,
                    count = tests.Count
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new
                {
                    success = false,
                    message = ex.Message
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving tests for exam {ExamId} and student {StudentId}", examId, studentId);
                return StatusCode(500, new
                {
                    success = false,
                    message = $"An error occurred while retrieving tests for exam {examId} and student {studentId}",
                    error = ex.Message
                });
            }
        }

        /// <summary>
        /// Get tests by exam ID and student ID
        /// </summary>
        /// <param name="examId">The exam ID to filter tests</param>
        /// <param name="lecturerId">The student ID to filter tests</param>
        /// <returns>List of tests for the specified exam and student</returns>
        [HttpGet]
        [Route("exams/{examId}/lecturers/{lecturerId}/tests")]
        public async Task<IActionResult> GetTestResponsesByExamIdAndLecturerIdIsGradingAsync(int examId, int lecturerId)
        {
            try
            {
                var tests = await _testService.GetTestResponsesByExamIdAndLecturerIdIsGradingAsync(examId, lecturerId);

                if (!tests.Any())
                {
                    return Ok(new
                    {
                        success = true,
                        message = $"No tests found for exam ID {examId} and student ID {lecturerId}",
                        data = new List<object>(),
                        count = 0
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = $"Tests for exam ID {examId} and lecturer ID {lecturerId} retrieved successfully",
                    data = tests,
                    count = tests.Count
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new
                {
                    success = false,
                    message = ex.Message
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving tests for exam {ExamId} and student {StudentId}", examId, lecturerId);
                return StatusCode(500, new
                {
                    success = false,
                    message = $"An error occurred while retrieving tests for exam {examId} and student {lecturerId}",
                    error = ex.Message
                });
            }
        }

        /// <summary>
        /// Get test statistics
        /// </summary>
        /// <returns>Statistics about tests including total count, tests with reports, etc.</returns>
        [HttpGet]
        [Route("tests/statistics")]
        public async Task<IActionResult> GetTestStatistics()
        {
            try
            {
                var tests = await _testService.GetTestResponsesAsync();

                var statistics = new
                {
                    totalTests = tests.Count,
                    testsWithReports = tests.Count(t => t.hasReport),
                    testsWithoutReports = tests.Count(t => !t.hasReport),
                    testsWithScores = tests.Count(t => t.TestsScores > 0),
                    averageScore = tests.Any(t => t.TestsScores > 0) ? tests.Where(t => t.TestsScores > 0).Average(t => t.TestsScores) : 0,
                    uniqueStudents = tests.Where(t => t.StudentId.HasValue).Select(t => t.StudentId).Distinct().Count()
                };

                return Ok(new
                {
                    success = true,
                    message = "Test statistics retrieved successfully",
                    data = statistics
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving test statistics");
                return StatusCode(500, new
                {
                    success = false,
                    message = "An error occurred while retrieving test statistics",
                    error = ex.Message
                });
            }
        }

        /// <summary>
        /// Upload test files to Cloudinary
        /// Supports: .doc, .docx, .pdf, .txt files (max 10MB each)
        /// </summary>
        /// <param name="request">Upload request containing files and metadata</param>
        /// <returns>Upload result with file URLs</returns>
        [HttpPost]
        [Route("tests/upload")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadTestFiles([FromForm] TestFileUploadRequest request)
        {
            try
            {
                if (request.Files == null || !request.Files.Any())
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "No files provided for upload"
                    });
                }

                // Validate each file before processing
                var invalidFiles = new List<string>();
                foreach (var file in request.Files)
                {
                    var (isValid, errorMessage) = _cloudinaryService.ValidateDocumentFile(file, 10);
                    if (!isValid)
                    {
                        invalidFiles.Add($"{file.FileName}: {errorMessage}");
                    }
                }

                if (invalidFiles.Any())
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Invalid files detected",
                        errors = invalidFiles
                    });
                }

                var result = await _testService.UploadTestFilesAsync(request);

                if (!result.Success)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = result.Message,
                        data = result
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = result.Message,
                    data = result
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while uploading test files");
                return StatusCode(500, new
                {
                    success = false,
                    message = "An error occurred while uploading files",
                    error = ex.Message
                });
            }
        }

        /// <summary>
        /// Create a new test with file uploads
        /// Supports: .doc, .docx, .pdf, .txt files (max 10MB each)
        /// </summary>
        /// <param name="request">Test creation request with files</param>
        /// <returns>Created test with file information</returns>
        [HttpPost]
        [Route("exams/{examId}/tests/upload")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> CreateTestWithFiles([FromForm] TestFileUploadRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.Title))
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Test title is required"
                    });
                }

                if (request.Files == null || !request.Files.Any())
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "At least one file is required"
                    });
                }

                // Validate each file before processing
                var invalidFiles = new List<string>();
                foreach (var file in request.Files)
                {
                    var (isValid, errorMessage) = _cloudinaryService.ValidateDocumentFile(file, 10);
                    if (!isValid)
                    {
                        invalidFiles.Add($"{file.FileName}: {errorMessage}");
                    }
                }

                if (invalidFiles.Any())
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Invalid files detected",
                        errors = invalidFiles
                    });
                }

                var result = await _testService.CreateTestWithFilesAsync(request);

                return Ok(new
                {
                    success = true,
                    message = "Test created successfully with uploaded files",
                    data = result
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while creating test with files");
                return StatusCode(500, new
                {
                    success = false,
                    message = "An error occurred while creating test with files",
                    error = ex.Message
                });
            }
        }

        /// <summary>
        /// Update an existing test with optional file management
        /// Supports: .doc, .docx, .pdf, .txt files (max 10MB each)
        /// </summary>
        /// <param name="id">Test ID to update</param>
        /// <param name="request">Test update request with optional new files and files to remove</param>
        /// <returns>Updated test information</returns>
        [HttpPut]
        [Route("tests/{id:int}")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UpdateTest(int id, [FromForm] TestUpdateRequest request)
        {
            try
            {
                if (id != request.Id)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "ID in URL does not match ID in request body"
                    });
                }

                // Validate new files if provided
                if (request.NewFiles != null && request.NewFiles.Any())
                {
                    var invalidFiles = new List<string>();
                    foreach (var file in request.NewFiles)
                    {
                        var (isValid, errorMessage) = _cloudinaryService.ValidateDocumentFile(file, 10);
                        if (!isValid)
                        {
                            invalidFiles.Add($"{file.FileName}: {errorMessage}");
                        }
                    }

                    if (invalidFiles.Any())
                    {
                        return BadRequest(new
                        {
                            success = false,
                            message = "Invalid files detected",
                            errors = invalidFiles
                        });
                    }
                }

                var result = await _testService.UpdateTestAsync(request);

                if (!result.Success)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = result.Message,
                        data = result
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = result.Message,
                    data = result
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating test {TestId}", id);
                return StatusCode(500, new
                {
                    success = false,
                    message = "An error occurred while updating the test",
                    error = ex.Message
                });
            }
        }

        /// <summary>
        /// Delete a test and its associated files
        /// </summary>
        /// <param name="id">Test ID to delete</param>
        /// <returns>Success or failure result</returns>
        [HttpDelete]
        [Route("tests/{id:int}")]
        public async Task<IActionResult> DeleteTest(int id)
        {
            try
            {
                var result = await _testService.DeleteTestAsync(id);

                if (!result)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = $"Test with ID {id} not found or could not be deleted"
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = $"Test with ID {id} deleted successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while deleting test {TestId}", id);
                return StatusCode(500, new
                {
                    success = false,
                    message = "An error occurred while deleting the test",
                    error = ex.Message
                });
            }
        }

        /// <summary>
        /// Validate document files without uploading
        /// </summary>
        /// <param name="files">Files to validate</param>
        /// <returns>Validation results for each file</returns>
        [HttpPost]
        [Route("tests/validate-files")]
        [Consumes("multipart/form-data")]
        public IActionResult ValidateFiles([FromForm] List<IFormFile> files)
        {
            try
            {
                if (files == null || !files.Any())
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "No files provided for validation"
                    });
                }

                var validationResults = files.Select(file =>
                {
                    var (isValid, errorMessage) = _cloudinaryService.ValidateDocumentFile(file, 10);
                    return new
                    {
                        fileName = file.FileName,
                        fileSize = file.Length,
                        fileSizeInMB = Math.Round(file.Length / (1024.0 * 1024.0), 2),
                        fileType = Path.GetExtension(file.FileName),
                        isValid,
                        errorMessage = isValid ? "File is valid" : errorMessage
                    };
                }).ToList();

                var validFiles = validationResults.Count(r => r.isValid);
                var invalidFiles = validationResults.Count(r => !r.isValid);

                return Ok(new
                {
                    success = true,
                    message = $"Validation completed: {validFiles} valid, {invalidFiles} invalid",
                    summary = new
                    {
                        totalFiles = files.Count,
                        validFiles,
                        invalidFiles
                    },
                    details = validationResults
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while validating files");
                return StatusCode(500, new
                {
                    success = false,
                    message = "An error occurred while validating files",
                    error = ex.Message
                });
            }
        }
    }
}