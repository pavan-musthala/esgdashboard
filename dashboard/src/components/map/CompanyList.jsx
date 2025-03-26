const CompanyList = ({ companies, onSelectCompany }) => {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Find the Locations of the Companies</h2>
      <ul>
        {companies.map((company) => (
          <li 
            key={company.companyId} 
            className="cursor-pointer hover:bg-gray-100 p-2"
            onClick={() => onSelectCompany(company)}
          >
            {company.companyName} - {company.country}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CompanyList;
