import React from 'react';
import { Download } from 'lucide-react';

const TopCompaniesTable = ({ title, data, valueKey, valueName }) => {
  const downloadCSV = () => {
    const headers = ['Rank', 'Company', 'Fund', 'Theme', 'Country', valueName];
    const csvContent = [
      headers.join(','),
      ...data.map((company, index) => [
        index + 1,
        company.companyName,
        company.fund,
        company.theme,
        company.country,
        company[valueKey]
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${title.replace(/\s+/g, '_')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="bg-black/50 rounded-xl border border-purple-900/20 shadow-lg backdrop-blur-sm">
      <div className="px-6 py-5 flex justify-between items-center border-b border-purple-900/20">
        <h3 className="text-lg leading-6 font-medium text-white">{title}</h3>
        <button
          onClick={downloadCSV}
          className="inline-flex items-center px-3 py-2 border border-purple-900/20 text-xs leading-4 
                   font-medium rounded-lg text-purple-300/60 bg-black/30 
                   hover:bg-purple-900/20 hover:border-purple-900/40
                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500/50 
                   transition-all duration-200"
        >
          <Download className="h-3.5 w-3.5 mr-2" />
          CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-purple-900/20">
          <thead className="bg-black/30">
            <tr>
              <th scope="col" 
                  className="px-6 py-4 text-left text-xs font-medium text-purple-300/60 uppercase tracking-wider">
                Rank
              </th>
              <th scope="col" 
                  className="px-6 py-4 text-left text-xs font-medium text-purple-300/60 uppercase tracking-wider">
                Company
              </th>
              <th scope="col" 
                  className="px-6 py-4 text-left text-xs font-medium text-purple-300/60 uppercase tracking-wider">
                Fund
              </th>
              <th scope="col" 
                  className="px-6 py-4 text-left text-xs font-medium text-purple-300/60 uppercase tracking-wider">
                Theme
              </th>
              <th scope="col" 
                  className="px-6 py-4 text-left text-xs font-medium text-purple-300/60 uppercase tracking-wider">
                Country
              </th>
              <th scope="col" 
                  className="px-6 py-4 text-left text-xs font-medium text-purple-300/60 uppercase tracking-wider">
                {valueName}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-900/20">
            {data.map((company, index) => (
              <tr key={index} 
                  className="hover:bg-purple-900/10 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-300/60">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {company.companyName || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-300/60">
                  {company.fund || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-300/60">
                  {company.theme || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-300/60">
                  {company.country || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-300/60">
                  {typeof company[valueKey] === 'number' 
                    ? company[valueKey].toLocaleString() 
                    : company[valueKey] || 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopCompaniesTable;
