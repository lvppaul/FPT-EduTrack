using FPT_EduTrack.DataAccessLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPT_EduTrack.DataAccessLayer.Interfaces
{
    public interface ITestRepository : IGenericRepository<Test>
    {
        Task<List<Test>> GetTestsAsync();
        Task<bool> IsLecturerAssigned(int lecturerId, int testId);

       
    }
}
