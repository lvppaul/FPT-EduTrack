using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using FPT_EduTrack.BusinessLayer.DTOs.Response;
using FPT_EduTrack.BusinessLayer.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace FPT_EduTrack.BusinessLayer.Services
{
    public class CloudinaryService : ICloudinaryService
    {
        private readonly Cloudinary _cloudinary;
        private readonly ILogger<CloudinaryService> _logger;

        public CloudinaryService(IConfiguration configuration, ILogger<CloudinaryService> logger)
        {
            _logger = logger;

            var cloudName = configuration["Cloudinary:CloudName"];
            var apiKey = configuration["Cloudinary:ApiKey"];
            var apiSecret = configuration["Cloudinary:ApiSecret"];

            if (string.IsNullOrEmpty(cloudName) || string.IsNullOrEmpty(apiKey) || string.IsNullOrEmpty(apiSecret))
            {
                throw new ArgumentException("Cloudinary configuration is missing or incomplete");
            }

            var account = new Account(cloudName, apiKey, apiSecret);
            _cloudinary = new Cloudinary(account);
        }

        public async Task<FileUploadResponse> UploadFileAsync(IFormFile file, string folder = "tests")
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    throw new ArgumentException("File is null or empty");
                }

                // Get file extension for proper handling
                var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
                
                // Create upload parameters for documents
                var uploadParams = new RawUploadParams()
                {
                    File = new FileDescription(file.FileName, file.OpenReadStream()),
                    Folder = folder,
                    PublicId = $"{folder}/{Guid.NewGuid()}_{Path.GetFileNameWithoutExtension(file.FileName)}",
                    UseFilename = false,
                    UniqueFilename = true,
                    Overwrite = false
                };

                // Log upload attempt
                _logger.LogInformation($"Uploading file: {file.FileName} ({file.Length} bytes) to folder: {folder}");

                var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                if (uploadResult.Error != null)
                {
                    _logger.LogError($"Cloudinary upload error: {uploadResult.Error.Message}");
                    throw new Exception($"Upload failed: {uploadResult.Error.Message}");
                }

                _logger.LogInformation($"Successfully uploaded file: {file.FileName} -> {uploadResult.SecureUrl}");

                return new FileUploadResponse
                {
                    PublicId = uploadResult.PublicId,
                    Url = uploadResult.Url?.ToString() ?? string.Empty,
                    SecureUrl = uploadResult.SecureUrl?.ToString() ?? string.Empty,
                    OriginalFileName = file.FileName ?? string.Empty,
                    FileType = fileExtension,
                    FileSize = file.Length,
                    UploadedAt = DateTime.UtcNow,
                    ResourceType = uploadResult.ResourceType
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error uploading file {file?.FileName} to Cloudinary");
                throw;
            }
        }

        public async Task<List<FileUploadResponse>> UploadFilesAsync(List<IFormFile> files, string folder = "tests")
        {
            var results = new List<FileUploadResponse>();
            var errors = new List<string>();

            foreach (var file in files)
            {
                try
                {
                    var result = await UploadFileAsync(file, folder);
                    results.Add(result);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"Failed to upload file: {file.FileName}");
                    errors.Add($"Failed to upload {file.FileName}: {ex.Message}");
                }
            }

            if (errors.Any() && !results.Any())
            {
                throw new Exception($"All uploads failed: {string.Join("; ", errors)}");
            }

            if (errors.Any())
            {
                _logger.LogWarning($"Some uploads failed: {string.Join("; ", errors)}");
            }

            return results;
        }

        public async Task<bool> DeleteFileAsync(string publicId)
        {
            try
            {
                var deleteParams = new DeletionParams(publicId)
                {
                    ResourceType = ResourceType.Raw
                };

                var result = await _cloudinary.DestroyAsync(deleteParams);
                return result.Result == "ok";
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting file with publicId: {publicId}");
                return false;
            }
        }

        public async Task<List<bool>> DeleteFilesAsync(List<string> publicIds)
        {
            var results = new List<bool>();

            foreach (var publicId in publicIds)
            {
                var result = await DeleteFileAsync(publicId);
                results.Add(result);
            }

            return results;
        }

        public bool IsValidFileType(IFormFile file, List<string> allowedExtensions)
        {
            if (file == null || string.IsNullOrEmpty(file.FileName))
                return false;

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            return allowedExtensions.Contains(extension);
        }

        public bool IsValidFileSize(IFormFile file, long maxSizeInBytes)
        {
            return file != null && file.Length > 0 && file.Length <= maxSizeInBytes;
        }

        /// <summary>
        /// Validates document files specifically for upload
        /// </summary>
        /// <param name="file">The file to validate</param>
        /// <param name="maxSizeInMB">Maximum file size in MB (default: 10MB)</param>
        /// <returns>Validation result with error message if invalid</returns>
        public (bool IsValid, string ErrorMessage) ValidateDocumentFile(IFormFile file, int maxSizeInMB = 10)
        {
            if (file == null)
                return (false, "File is null");

            if (file.Length == 0)
                return (false, "File is empty");

            // Check file extension
            var allowedExtensions = new List<string> { ".doc", ".docx", ".pdf", ".txt" };
            if (!IsValidFileType(file, allowedExtensions))
            {
                return (false, $"Invalid file type. Allowed types: {string.Join(", ", allowedExtensions)}");
            }

            // Check file size
            var maxSizeInBytes = maxSizeInMB * 1024 * 1024;
            if (!IsValidFileSize(file, maxSizeInBytes))
            {
                var fileSizeInMB = file.Length / (1024.0 * 1024.0);
                return (false, $"File size ({fileSizeInMB:F2}MB) exceeds maximum allowed size ({maxSizeInMB}MB)");
            }

            // Check for malicious file names
            var fileName = Path.GetFileName(file.FileName);
            if (string.IsNullOrWhiteSpace(fileName) || fileName.Contains("..") || fileName.IndexOfAny(Path.GetInvalidFileNameChars()) >= 0)
            {
                return (false, "Invalid file name");
            }

            return (true, string.Empty);
        }
    }
}