import React from 'react';

const CompanyFilter = ({ companies, selectedCompany, onCompanyChange, className }) => {
  return (
    <div className="relative">
      <select
        value={selectedCompany}
        onChange={(e) => onCompanyChange(e.target.value)}
        className={`w-full appearance-none bg-black/50 
                   border border-purple-900/20 rounded-xl py-3 px-4 pr-10
                   focus:outline-none focus:border-purple-900/50
                   text-purple-300/60 transition-all duration-200
                   hover:bg-black hover:border-purple-900/40 ${className}`}
      >
        <option value="">All Companies</option>
        {companies.map((company) => (
          <option key={company.companyName} value={company.companyName}>
            {company.companyName}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg className="w-4 h-4 text-purple-300/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

export default CompanyFilter;
