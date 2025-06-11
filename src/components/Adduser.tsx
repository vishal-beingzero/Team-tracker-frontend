import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { Loader } from './Loader';

interface DataRow {
  name: string;
  githubHandle: string;
  codeforcesHandle: string;
  team: string;
}

const Adduser: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DataRow[]>([]);
  const [form, setForm] = useState<DataRow>({ name: '', githubHandle: '', codeforcesHandle: '', team: '' });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const binaryStr = e.target?.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData: DataRow[] = XLSX.utils.sheet_to_json(worksheet);
      setData(jsonData);
    };
    reader.readAsBinaryString(file);
  };

  useEffect(()=>{

  
      const renderLoader = async () => {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulating 2 seconds delay
      setLoading(false); // Hide loader after 3 seconds
    };
    renderLoader();
  });

  const handleAddUser = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_REACT_BACKEND_URI}/codeforces/user/addUser`, form);
      console.log(res);
      console.log('User added successfully!');
      setForm({ name: '', githubHandle: '', codeforcesHandle: '', team: '' });
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Error adding user, please try again.');
    }
    finally{
        setData([]);
        setUploading(false);
    }
  };

  const handleUploadToServer = async () => {
    if (data.length === 0) {
      alert('Please upload an Excel file first.');
      return;
    }

    setUploading(true);
    try {
      for (const user of data) {
        console.log(user);
        const res = await axios.post(`${import.meta.env.VITE_REACT_BACKEND_URI}/codeforces/user/addUser`, user);
        console.log(res);
      }
      alert('All users added successfully!');
    } catch (error) {
      console.error('Error adding users:', error);
      alert('Error adding users, please try again.');
    } finally {
      setUploading(false);
    }
  };

    const downloadExcel = () => {
        // Sample data for the Excel file
        const data = [
            { name: "Vishal", gitHubHandle: "vishalkuma4180", codeforcesHandle: "vishalkuma4180", team: "" },
            { name: "Dattatri", gitHubHandle: "dattatri3", codeforcesHandle: "bz-dattatri", team: "3" },
            { name: "Satya", gitHubHandle: "satya456", codeforcesHandle: "bz-satya", team: "P3" },
        ];
        
        // Create a worksheet from the data
        const ws = XLSX.utils.json_to_sheet(data);

        // Create a new workbook and add the worksheet to it
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sample Data");

        // Trigger a download of the Excel file
        XLSX.writeFile(wb, "Sample_Data.xlsx");
    };

  if(loading)
  {
    return <Loader/>
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Upload Excel File</h3>
              <div className="mb-3">
                <input type="file" className="form-control" accept=".xlsx, .xls" onChange={handleFileUpload} disabled={uploading} />
              </div>
              
              <ul className='my-3'>
                <li>
                  There should be 4 fields "name",	"gitHubHandle",	"codeforcesHandle",	"team"
                </li>
                <li>
                  Field "team" is optional and default value if not provided is "Global"
                </li>
              </ul>
              <div className="d-flex justify-content-between align-items-center p-3">
              <button className="btn btn-primary mb-3" onClick={handleUploadToServer} disabled={data.length === 0 || uploading}>
                {uploading ? 'Uploading...' : 'Upload to Server'}
              </button>
              <button className="btn btn-primary mb-3" onClick={downloadExcel}>
                Download Sample 
              </button>

              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Add User Manually</h3>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="GitHub Handle"
                  value={form.githubHandle}
                  onChange={(e) => setForm({ ...form, githubHandle: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Codeforces Handle"
                  value={form.codeforcesHandle}
                  onChange={(e) => setForm({ ...form, codeforcesHandle: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Team"
                  value={form.team}
                  onChange={(e) => setForm({ ...form, team: e.target.value })}
                />
              </div>
              <button className="btn btn-success" onClick={handleAddUser} disabled={uploading}>
                Add User
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Adduser;
