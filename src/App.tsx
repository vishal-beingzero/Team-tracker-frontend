
function App() {
  
  return (
    <>
    {/* <h3>({import.meta.env})</h3> */}
    <h4 className="text-center mt-5 mb-5">{JSON.stringify(import.meta.env.VITE_REACT_BACKEND_URI)}</h4>
      <h1 className=" text-center">This is a home page...</h1>
    </>
  );
}

export default App;
