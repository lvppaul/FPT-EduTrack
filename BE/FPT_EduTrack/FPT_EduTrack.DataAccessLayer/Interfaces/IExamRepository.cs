using FPT_EduTrack.DataAccessLayer.Entities;
using FPT_EduTrack.DataAccessLayer.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPT_EduTrack.DataAccessLayer.Interfaces
{
    public interface IExamRepository : IGenericRepository<Exam>
    {
        Task AddAsync(Exam exam);
        Task EditAsync(int id, Exam exam);
        Task DeleteAsync(int id);
        Task<List<Exam>> GetAllAsync(Pagination pagination);
        Task<int> CountAsync();
    }
}
