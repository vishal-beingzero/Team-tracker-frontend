import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';

interface DataRow {
  name: string;
  githubHandle: string;
  codeforcesHandle: string;
  team: string;
}

const Adduser: React.FC = () => {
  const [uploading, setUploading] = useState(false);
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
              <button className="btn btn-primary mb-3" onClick={handleUploadToServer} disabled={data.length === 0 || uploading}>
                {uploading ? 'Uploading...' : 'Upload to Server'}
              </button>
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
