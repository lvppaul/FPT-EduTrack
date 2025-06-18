using FPT_EduTrack.DataAccessLayer.Context;
using FPT_EduTrack.DataAccessLayer.Entities;
using FPT_EduTrack.DataAccessLayer.Interfaces;
using Microsoft.EntityFrameworkCore.ChangeTracking.Internal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPT_EduTrack.DataAccessLayer.Repositories
{
    public class ReportRepository : IReportRepository
    {
        private readonly FptEduTrackContext _context;
        public ReportRepository(FptEduTrackContext context)
        {
            _context = context;
        }
        public List<Report> GetAllReports()
        {
            try
            {
                return _context.Reports.ToList();
            }
            catch(Exception e)
            {
                throw new Exception("Error retrieving reports", e);
            }
        }
        public Report GetReportById(int id)
        {
            try
            {
                return _context.Reports.FirstOrDefault(r => r.Id == id);
            }
            catch (Exception e)
            {
                throw new Exception($"Error retrieving report with ID {id}", e);
            }
        }

        public void AddReport(Report report)
        {
            try
            {
                report.IsDeleted = false; 
                report.CreatedAt = DateTime.UtcNow;
                report.IsSecond = false;
                report.ReportStatusId = 1;
                _context.Reports.Add(report);
                _context.SaveChanges();
            }
            catch (Exception e)
            {
                throw new Exception("Error adding report", e);
            }
        }

        public void UpdateReport(Report report)
        {
            try
            {
                _context.Entry(report).State = Microsoft.EntityFrameworkCore.EntityState.Modified; 
                _context.SaveChanges();
            }
            catch (Exception e)
            {
                throw new Exception("Error updating report", e);
            }
        }

        public void DeleteReport(int id)
        {
            try
            {
                var report = _context.Reports.FirstOrDefault(r => r.Id == id);
                if (report != null)
                {
                    _context.Reports.Remove(report);
                    _context.SaveChanges();
                }
            }
            catch (Exception e)
            {
                throw new Exception($"Error deleting report with ID {id}", e);
            }
        }
    }
}
