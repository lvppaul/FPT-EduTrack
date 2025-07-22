using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace FPT_EduTrack.BusinessLayer.DTOs.Request
{
    public class TestUpdateRequest
    {
        [Required(ErrorMessage = "Test ID is required")]
        public int Id { get; set; }
        
        public string? Code { get; set; }
        
        public string? Title { get; set; }
        
        public string? Content { get; set; }
        
        public int? StudentId { get; set; }
        
        public int? ExamId { get; set; }
        
        /// <summary>
        /// New files to upload and attach to the test
        /// Supports: .doc, .docx, .pdf, .txt files (max 10MB each)
        /// </summary>
        public List<IFormFile>? NewFiles { get; set; }
        
        /// <summary>
        /// List of existing file public IDs to remove from the test
        /// </summary>
        public List<string>? FilesToRemove { get; set; }
        
        /// <summary>
        /// Whether to keep existing files (true) or replace all with new files (false)
        /// Default: true (keep existing files and add new ones)
        /// </summary>
        public bool KeepExistingFiles { get; set; } = true;
    }
}