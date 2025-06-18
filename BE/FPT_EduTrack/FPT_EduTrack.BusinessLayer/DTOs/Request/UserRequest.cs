using System.ComponentModel.DataAnnotations;

namespace FPT_EduTrack.BusinessLayer.DTOs.Request
{
    public class UserRequest
    {
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Full name is required")]
        public string Fullname { get; set; }

        [Required(ErrorMessage = "Role is required")]
        public int RoleId { get; set; }
    }
}
