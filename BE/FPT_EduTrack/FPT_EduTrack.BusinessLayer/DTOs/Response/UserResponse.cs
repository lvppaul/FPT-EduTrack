namespace FPT_EduTrack.BusinessLayer.DTOs.Response
{
    public class UserResponse
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Fullname { get; set; }
        public DateTime? CreatedAt { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsDeleted { get; set; }
        public int? RoleId { get; set; }
        public string RoleName { get; set; }
    }
}
