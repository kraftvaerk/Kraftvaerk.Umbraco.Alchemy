using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Kraftvaerk.Umbraco.Alchemy.Backend.Services
{
    public interface IExampleService
    {
        Task<string> GetExampleData();
    }
}
