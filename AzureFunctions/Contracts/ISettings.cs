﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace AzureFunctions.Contracts
{
    public interface ISettings
    {
        Task<string> GetCurrentSiteExtensionVersion();
        string AppDataPath { get; }
        string TemplatesPath { get; }
        string BindingsJsonPath { get; }
        string LoggingSqlServerConnectionString { get; }
        bool LogToSql { get; }
        bool LogToFile { get; }
        bool LogLoggingDebugInfo { get; }
    }
}