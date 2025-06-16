using System.ComponentModel.DataAnnotations;

namespace FPT_EduTrack.BusinessLayer.DTOs.Update
{
    public class UserUpdate
    {
        [Required]
        public int Id { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Fullname { get; set; }

        public int? RoleId { get; set; }
        public bool? IsActive { get; set; }
    }
}
