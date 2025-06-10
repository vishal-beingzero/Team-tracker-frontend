import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import {SiteExists} from '../utils/CodeforcesUtils'
import { Loader } from './Loader';

interface DataRow {
  site: string;
  problem: string;
}

const AddProblems: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DataRow[]>([]);
  const [form, setForm] = useState<DataRow>({ site: '', problem: ''});

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
      console.log(data);
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
        console.log("Hola , im in side handleUser function ... ");
        const site = form.site.toUpperCase();
        if(!SiteExists(site))
        {
            
            console.log(`This given site ${form.site} is improper or unlisted , hence not adding the problems ... `)
            return;
        }

        
        const res = await axios.post(`${import.meta.env.VITE_REACT_BACKEND_URI}/codeforces/add`, [form]);
        console.log("alwal", res);
        setForm({ site: '', problem: ''});
        console.log(form);
        alert('Problem added successfully ... ');
    } catch (error) {
      console.error('Error adding problem:', error);
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
        // console.log(data);
        console.log("hii user", data);
        const res = await axios.post(`${import.meta.env.VITE_REACT_BACKEND_URI}/codeforces/add`, data);
      for (const user of data) {
        console.log("HI, this is a thop in handle to server ", user);
        const site = user.site.toUpperCase();
        if(!SiteExists(site))
        {
            console.log(`This given site ${user.site} is improper or unlisted , hence not adding the problems ... `)
            continue;
        }
        user.site=user.site.toUpperCase();
        console.log(user);
        console.log(res);
      }
      alert('All Problems added successfully!');
    } catch (error) {
      console.error('Error adding Problem:', error);
    } finally {
      setUploading(false);
    }
  };

  if(loading)
  {
    return <Loader/>
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <h1 className='text-center mb-3'> Add scorable problems</h1>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Upload Problems Excel</h3>
              <div className="mb-3">
                <input type="file" className="form-control" accept=".xlsx, .xls" onChange={handleFileUpload} disabled={uploading} />
              </div>
              <button className="btn btn-primary mb-3" onClick={handleUploadToServer} disabled={data.length === 0 || uploading}>
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Add problem manually</h3>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Site Name"
                  value={form.site}
                  onChange={(e) => setForm({ ...form, site: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Problem Link(example: https://codeforces.com/problemset/problem/1616/A)"
                  value={form.problem}
                  onChange={(e) => setForm({ ...form, problem: e.target.value })}
                />
              </div>
              <button className="btn btn-success" onClick={handleAddUser} disabled={uploading}>
                Add Problem
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProblems;
