using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPT_EduTrack.BusinessLayer.Exceptions
{
    public class WeakPasswordException : Exception
    {
        public IEnumerable<string> Errors { get; }

        public WeakPasswordException(IEnumerable<string> errors)
            : base($"Password validation failed: {string.Join(Environment.NewLine, errors)}")
        {
            Errors = errors;
        }
    }
}
