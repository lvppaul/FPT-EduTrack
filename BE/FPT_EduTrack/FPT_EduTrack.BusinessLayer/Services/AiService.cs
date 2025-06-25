using Aspose.Words;
using DocumentFormat.OpenXml.Packaging;
using FPT_EduTrack.BusinessLayer.Interfaces;
using FPT_EduTrack.DataAccessLayer.UnitOfWork;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace FPT_EduTrack.BusinessLayer.Services
{
    public class AiService : IAiService
    {

        private readonly IUnitOfWork _unitOfWork;
        private readonly ITokenProvider _tokenProvider;

        public AiService(IUnitOfWork unitOfWork, ITokenProvider tokenProvider)
        {
            _unitOfWork = unitOfWork;
            _tokenProvider = tokenProvider;
           
        }

        public async Task<string> ReadFileAsync(IFormFile file)
        {

            //var tempPath = Path.GetTempFileName();
            //using(var stream = new FileStream(tempPath, FileMode.Create)) {
            //    await file.CopyToAsync(stream);
            //}
            //var content = ReadFromFile(tempPath);
            //System.IO.File.Delete(tempPath);

            using var stream = file.OpenReadStream();
            var doc = new Document(stream);
            string content = doc.ToString(SaveFormat.Text);
            return content;

        }

        //private string ReadFromFile(string filePath)
        //{
        //    var doc = WordprocessingDocument.Open(filePath, false);
        //    return doc.MainDocumentPart?.Document?.Body?.InnerText ?? string.Empty;
        //}
    }
}
