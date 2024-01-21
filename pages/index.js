// pages/index.js
// import React, { useState } from 'react';
// import FileUpload from '../components/FileUpload';

// const Home = () => {
//   const [uploadedFiles, setUploadedFiles] = useState([]);

//   const handleFileUpload = (files) => {
//     // You can handle file upload logic here
//     console.log('Uploaded files:', files);
//     setUploadedFiles(files);
//   };

//   return (
//     <div>
//       <h1>File Upload with Next.js</h1>
//       <FileUpload onFileUpload={handleFileUpload} />
//     </div>
//   );
// };

// export default Home;
// pages/index.js

import React, { useState } from 'react';

export default function Home() {
  const [data, setdata] = useState("");
  const handleFileUpload = async (event) => {
    
    const fileInput = event.target.files[0];

    const formData = new FormData();
    formData.append('file', fileInput);

    try {
      setdata("Please wait for a few moments while we are fetching data for you")
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('File uploaded successfully:', data.path);
        setdata(data.html)
      } else {
        const errorData = await response.json();
        console.error('Error uploading file:', errorData.error);
      }
    } catch (error) {
      console.error('Error uploading file:', error.message);
    }
  };

  return (
    <div>
      <h1>File Upload</h1>
      <input type="file" accept=".pdf" onChange={handleFileUpload} />
      <div dangerouslySetInnerHTML={{ __html: data }} />

    </div>
  );
}

