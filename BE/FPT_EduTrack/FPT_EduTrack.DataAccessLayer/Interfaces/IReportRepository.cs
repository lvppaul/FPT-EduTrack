using FPT_EduTrack.DataAccessLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPT_EduTrack.DataAccessLayer.Interfaces
{
    public interface IReportRepository
    {
        List<Report> GetAllReports();
        Report GetReportById(int id);
        void AddReport(Report report);
        void UpdateReport(Report report);
        void DeleteReport(int id);
    }
}
