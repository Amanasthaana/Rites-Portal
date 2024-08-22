import React, { useState, useEffect } from 'react';
import './Form.css'
import { useNavigate } from 'react-router-dom';
const FileUploadComponent = () => {
  const [fileType, setFileType] = useState('');
  const [CPCfolder, setCPCFolder] = useState('');
  const [ITFolder, setITFolder] = useState('');
  const [RajbhashaFolder, setRajbhashaFolder] = useState('');
  const [AbhikalpFolder, setAbhikalpFolder] = useState('');
  const [HRFolder, setHRFolder] = useState('');
  const [ImportantFolder, setImportantFolder] = useState('');
  const [menu, setMenu] = useState('');
  const [name, setName] = useState('');
  const [file, setFile] = useState(null);
  const [folders, setFolders] = useState([]);
  const [documents,setDocuments]=useState([]);
  const [filteredFolders, setFilteredFolders] = useState([]);
  const [filteredDocuments,setFilterDocuments]=useState([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [, setCPCdocument] = useState('');
  const [, setITdocument] = useState('');
  const [, setRajbhashadocument] = useState('');
  const [, setAbhikalpdocument] = useState('');
  const [, setHRdocument] = useState('');
  const [, setImportantdocument] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    fetchFolders();
    fetchDocuments(); 
  }, []);
  useEffect(() => {
    if (uploadSuccess) {
      console.log('Upload success, resetting form fields.');
      setFileType('');
      setName('');
      setMenu('');
      setCPCFolder('');
      setITFolder('');
      setRajbhashaFolder('');
      setAbhikalpFolder('');
      setHRFolder('');
      setImportantFolder('');
      setUploadSuccess(false);
    }
  }, [uploadSuccess]);
  const fetchDocuments = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/documents', {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setDocuments(data);
      data.forEach((document) => {
        switch (document.menu_name) {
          case 'CPC Documents':
            setCPCdocument(document.name);
            break;
          case 'IT Documents':
            setITdocument(document.name);
            break;
          case 'Rajbhasha':
            setRajbhashadocument(document.name);
            break;
          case 'Abhikalp':
            setAbhikalpdocument(document.name);
            break;
          case 'HR Manuals':
            setHRdocument(document.name);
            break;
          case 'Important Files':
            setImportantdocument(document.name);
            break;
          default:
            console.error('Invalid menu:', document.menu_name);
        }
      });
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };
  useEffect(() => {
    if (menu) {
      const filter_doc = documents.filter((document) => document.menu_name === menu);
      setFilterDocuments(filter_doc);
    }
  }, [menu, documents]);
  const fetchFolders = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/folders', {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setFolders(data);
      data.forEach((folder) => {
        switch (folder.menu_name) {
          case 'CPC Documents':
            setCPCFolder(folder.name);
            break;
          case 'IT Documents':
            setITFolder(folder.name);
            break;
          case 'Rajbhasha':
            setRajbhashaFolder(folder.name);
            break;
          case 'Abhikalp':
            setAbhikalpFolder(folder.name);
            break;
          case 'HR Manuals':
            setHRFolder(folder.name);
            break;
          case 'Important Files':
            setImportantFolder(folder.name);
            break;
          default:
            console.error('Invalid menu:', folder.menu_name);
        }
      });
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  };
  useEffect(() => {
    if (menu) {
      const filtered = folders.filter((folder) => folder.menu_name === menu);
      setFilteredFolders(filtered);
    }
  }, [menu, folders]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  //

  
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file && fileType === 'Document') {
      alert('Please select a file.');
      return;
    }
    let selectedFolder = '';
    if (menu === 'CPC Documents') selectedFolder = CPCfolder;
    if (menu === 'IT Documents') selectedFolder = ITFolder;
    if (menu === 'Rajbhasha') selectedFolder = RajbhashaFolder;
    if (menu === 'Abhikalp') selectedFolder = AbhikalpFolder;
    if (menu === 'HR Manuals') selectedFolder = HRFolder;
    if (menu === 'Important Files') selectedFolder = ImportantFolder;
    const formData = new FormData();
    formData.append('file_type', fileType);
    formData.append('name', name);
    formData.append('menu', menu);
    if (fileType === 'Document') {
      formData.append('file', file);
      formData.append('folder_name', selectedFolder);
    }
    try {
      const response = await fetch('http://localhost:4000/api/postDocument', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        if (fileType === 'Folder') {
          alert(responseData.message);
          setUploadSuccess(true);
          fetchFolders();
        } else {
          navigate('/nav');
        }
      } else {
        const errorText = await response.text();
        console.error('Error uploading document:', errorText);
      }
    } catch (error) {
      console.error('Error uploading document:', error);
    }
  };
   
  const handleArchivedFilesClick = () => {
    setShowDropdown(!showDropdown);
    setShowDropdown(true);
  };

  const handleCloseClick = () => {
    setShowDropdown(false);
  };

  const handleBool = async () => {
    
    let selectedFolderOrDocument;
  
    switch (menu) {
      case 'CPC Documents':
        selectedFolderOrDocument = CPCfolder;
        break;
      case 'IT Documents':
        selectedFolderOrDocument = ITFolder;
        break;
      case 'Rajbhasha':
        selectedFolderOrDocument = RajbhashaFolder;
        break;
      case 'Abhikalp':
        selectedFolderOrDocument = AbhikalpFolder;
        break;
      case 'HR Manuals':
        selectedFolderOrDocument = HRFolder;
        break;
      case 'Important Files':
        selectedFolderOrDocument = ImportantFolder;
        break;
      default:
        console.error('Invalid menu:', menu);
        return;
    }
  
    if (selectedFolderOrDocument) {
      const name = selectedFolderOrDocument;
      const type = menu;
      await archiveDocumentOrFolder(name, type);
    }
  };
  const archiveDocumentOrFolder = async (name, type) => {
    try {
      const response = await fetch(`http://localhost:4000/api/${type}/${name}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ hide: true })
      });
  
      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        fetchDocuments();
        fetchFolders();
        alert(`${name} archived successfully!`);
      } else {
        const errorText = await response.text();
        console.error(`Error updating ${type}:`, errorText);
      }
    } catch (error) {
      console.error(`Error updating ${type}:`, error);
    }
  };


  const handleUnarchive = async () => {
    const folderCheckboxes = document.querySelectorAll('.folder-checkbox');
    const documentCheckboxes = document.querySelectorAll('.document-checkbox');
    const folderIds = [];
    const documentIds = [];
    const folderNames = [];
    const documentNames = [];
  
    folderCheckboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        folderIds.push(checkbox.id);
        folderNames.push(checkbox.nextElementSibling.textContent);
      }
    });
  
    documentCheckboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        documentIds.push(checkbox.id);
        documentNames.push(checkbox.nextElementSibling.textContent);
      }
    });
  
    if (folderIds.length === 0 && documentIds.length === 0) {
      alert('Please select at least one folder or document to unarchive');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:4000/api/unarchive', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ folderIds, documentIds }),
      });
  
      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        fetchDocuments();
        fetchFolders();
        const unarchivedFolders = folderNames.join(', ');
        const unarchivedDocuments = documentNames.join(', ');
        let alertMessage = '';
        if (unarchivedFolders) {
          alertMessage += `Folders unarchived: ${unarchivedFolders}\n`;
        }
        if (unarchivedDocuments) {
          alertMessage += `Documents unarchived: ${unarchivedDocuments}`;
        }
        alert(alertMessage);
        navigate('/nav');
      } else {
        const errorText = await response.text();
        console.error('Error unarchiving files:', errorText);
      }
    } catch (error) {
      console.error('Error unarchiving files:', error);
    }
  };
const renderFolderOptions = () => {
    return filteredFolders.filter((folder) => !folder.hide).map((folder) => (
      <option key={folder.id} value={folder.name}>
        {folder.name}
      </option>
    ));
  };
  const renderDocumentOptions = () => {
    return filteredDocuments.filter((document) => !document.hide).map((document) => (
      <option key={document.id} value={document.name}>
        {document.name}
      </option>
    ));
  };
  
  const handleSelectAllFolders = (menu) => {
    const folderCheckboxes = document.querySelectorAll(`.folder-checkbox[data-menu="${menu}"]`);
    folderCheckboxes.forEach((checkbox) => {
      checkbox.checked = true;
    });
  };
  
  
  const handleSelectAllDocuments = (menu) => {
    const documentCheckboxes = document.querySelectorAll(`.document-checkbox[data-menu="${menu}"]`);
    documentCheckboxes.forEach((checkbox) => {
      checkbox.checked = true;
    });
  };
  return (
    <form onSubmit={handleSubmit} className="container h-screen w-screen overflow-hidden bg-gray-100">
      <div className='bg-blue-900 h-[80px] relative'>
        <img src="./Images/RITES.NS_BIG-6304eec7.webp" alt="rites" className="h-[60px] absolute left-6 top-2 border-none" />
        <h1 className="capitalize font-weight:500 text-2xl text-center pt-5 text-white">Document and File Upload Portal</h1>
        <div>
        <button 
        className="absolute right-[7.1rem] bottom-6 font-medium text-white hover:text-yellow-500  flex flex-row items-center"
        onClick={handleArchivedFilesClick}
        >
           Archived Files
          <svg className="w-2.5 h-2.5 ms-1 mt-1 font-semibold" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m1 1 4 4 4-4" />
          </svg>
        </button>
        {/* Archived Files */}
        {showDropdown && (
        <div className='flex flex-col dropDownProfile '>
        <img 
        className='h-4 w-4 absolute right-4 top-3' 
        src='https://icons.veryicon.com/png/128/system/super-system-icon/close-31.png' 
        alt='close icon'
        onClick={handleCloseClick}> 
        </img>
        <label className='px-4 pt-4 text-black font-medium' for="archived-folders">Archived Folders</label>
        {!menu && <div>Please select a menu</div>}
     <ul className='flex flex-col gap-2 overflow-auto py-4 px-3'>
     {menu && (
        <li className=' hover:bg-gray-100 transition 200ms'>
          <input type="checkbox" id="select-all-folders" onClick={() => handleSelectAllFolders(menu)}/>
          <label for="select-all-folders" >Select All Folders</label>
        </li>
      )}  
      {folders.filter(folder => folder.hide && folder.menu_name === menu).map((folder) => (
       <li key={folder.id} className=' hover:bg-gray-100 transition 200ms'>
         <input type="checkbox" id={folder.id} className="folder-checkbox" data-menu={menu} />
         <label for={folder.id}>{folder.name}</label>
       </li>
     ))}
    </ul>
    <label className='px-4 pt-4 text-black font-medium' for="archived-documents">Archived documents</label>
    {!menu && <div>Please select a menu</div>}
    <ul className='flex flex-col gap-2 overflow-auto py-4 px-3'>
    {menu && (
        <li className=' hover:bg-gray-100 transition 200ms'>
          <input type="checkbox" id="select-all-documents" onClick={() => handleSelectAllDocuments(menu)} />
          <label for="select-all-documents">Select All Documents</label>
        </li>
      )}
      {documents.filter(document => document.hide && document.menu_name === menu).map((document) => (
        <li key={document.id} className=' hover:bg-gray-100 transition 200ms'>
          <input type="checkbox" id={document.id} className="document-checkbox" data-menu={menu} />
          <label for={document.id}>{document.name}</label>
        </li>
      ))}      
    </ul>
  <div className='flex items-center justify-center my-2'>
    <button 
    className="absolute bottom-2 right-6 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none font-semibold focus:ring-blue-300 rounded-lg text-[0.75rem] w-full sm:w-auto px-3 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
    type='button'
    onClick={handleUnarchive}
    >
      Unarchive
    </button>
   </div>
        </div>
        )}
      </div>
      </div>
      <div className="row mx-auto flex flex-col justify-center items-center bg-white max-w-[450px] space-y-4 mt-24 border-solid border-2 border-collapse shadow-md rounded-lg h-[500px]">
        <div className="File-type flex flex-col w-[60%] space-y-1">
          <label htmlFor="file" className='text-black font-medium text-[1rem] leading-4'>Choose File Type:</label>
          <select 
            name="file_type"
            id="file"
            value={fileType}
            onChange={(e) => setFileType(e.target.value)}
            required>
            <option value="filetype">Select a file type</option>
            <option value="Folder">Folder</option>
            <option value="Document">Document</option>
          </select>
         
        </div>
        <div className="col-12 flex flex-col w-[60%] space-y-1">
          <label className='form-label text-black font-medium text-[1rem] leading-4 align-middle'>Name: </label>
          <input
           
            name="name"
            type="text"
            value={name}
            className="form-control"
            placeholder="Enter Name"
            autoComplete="off"
            onChange={(e) => setName(e.target.value)}/>
        </div>
        <div className="col-12 flex flex-col w-[60%] space-y-1">
          <label htmlFor="menu" className='text-black font-medium text-[1rem] leading-4'>Choose Menu:</label>
          <select
            id="menu"
            name="menu"
            value={menu}
            onChange={(e) => {
            setMenu(e.target.value);
             document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
               checkbox.checked = false;
             });
           }}
            required>
            <option value="">Select Menu</option>
            <option value="CPC Documents">CPC Documents</option>
            <option value="IT Documents">IT Documents</option>
            <option value="Rajbhasha">Rajbhasha</option>
            <option value="Abhikalp">Abhikalp</option>
            <option value="HR Manuals">HR Manuals</option>
            <option value="Important Files">Important Files</option>
          </select>
        </div>
        {fileType === 'Document' && (
          <div className="col-12 flex flex-col w-[60%] space-y-1">
            {menu === 'CPC Documents' && (
              <div className='flex flex-col w-[100%] space-y-1'>
                <label htmlFor="CPCfolder" className='text-black font-medium text-[1rem] leading-4'>Select location for CPC Doc:</label>
                <select name="CPCfolder" id="CPCfolder" value={CPCfolder} onChange={(e) => setCPCFolder(e.target.value)} required>
                  <option value="">Select location</option>
                  <optgroup label="Under Documents">
                    <option value="Documents">Documents</option>
                  </optgroup>
                  <optgroup label='Under Folders'>
                    {menu === 'CPC Documents' && renderFolderOptions("CPC Documents")}
                  </optgroup>
                </select>
              </div>
            )}
          {menu === 'IT Documents' && (
              <div className='flex flex-col w-full space-y-1'>
                <label htmlFor="ITfolder" className='text-black font-medium text-[1rem] leading-4'>Select location for IT Doc:</label>
                <select name="ITfolder" id="ITfolder" value={ITFolder} onChange={(e) => setITFolder(e.target.value)} required>
                  <option value="">Select location</option>
                  <optgroup label="Under Documents">
                    <option value="Documents">Documents</option>
                  </optgroup>
                  <optgroup label='Under Folders'>
                    {menu === 'IT Documents' && renderFolderOptions("IT Documents")}
                  </optgroup>
                </select>
              </div>
            )}
            {menu === 'Rajbhasha' && (
              <div className='flex flex-col w-full space-y-1'>
                <label htmlFor="RajbhashaFolder" className='text-black font-medium text-[1rem] leading-4'>Select location for Rajbhasha Doc:</label>
                <select name="RajbhashaFolder" id="RajbhashaFolder" value={RajbhashaFolder} onChange={(e) => setRajbhashaFolder(e.target.value)} required>
                  <option value="">Select location</option>
                  <optgroup label="Under Documents">
                    <option value="Documents">Documents</option>
                  </optgroup>
                  <optgroup label='Under Folders'>
                    {menu === 'Rajbhasha' && renderFolderOptions()}
                  </optgroup>
                </select>
              </div>
            )}
            {menu === 'Abhikalp' && (
              <div className='flex flex-col w-full space-y-1'>
                <label htmlFor="AbhikalpFolder" className='text-black font-medium text-[1rem] leading-4'>Select location for Abhikalp Doc:</label>
                <select name="AbhikalpFolder" id="AbhikalpFolder" value={AbhikalpFolder} onChange={(e) => setAbhikalpFolder(e.target.value)} required>
                  <option value="">Select location</option>
                  <optgroup label="Under Documents">
                    <option value="Documents">Documents</option>
                  </optgroup>
                  <optgroup label='Under Folders'>
                    {menu === 'Abhikalp' && renderFolderOptions()}
                  </optgroup>
                </select>
              </div>
            )}
            {menu === 'HR Manuals' && (
              <div className='flex flex-col w-full space-y-1'>
                <label htmlFor="HRFolder" className='text-black font-medium text-[1rem] leading-4'>Select location for HR Doc:</label>
                <select name="HRFolder" id="HRFolder" value={HRFolder} onChange={(e) => setHRFolder(e.target.value)} required>
                  <option value="">Select location</option>
                  <optgroup label="Under Documents">
                    <option value="Documents">Documents</option>
                  </optgroup>
                  <optgroup label='Under Folders'>
                    {menu === 'HR Manuals' && renderFolderOptions()}
                  </optgroup>
                </select>
              </div>
            )}
            {menu === 'Important Files' && (
              <div className='flex flex-col w-full space-y-1'>
                <label htmlFor="ImportantFolder" className='text-black font-medium text-[1rem] leading-4'>Select location for Important File:</label>
                <select name="ImportantFolder" id="ImportantFolder" value={ImportantFolder} onChange={(e) => setImportantFolder(e.target.value)} required>
                  <option value="">Select location</option>
                  <optgroup label="Under Documents">
                    <option value="Documents">Documents</option>
                  </optgroup>
                  <optgroup label='Under Folders'>
                    {menu === 'Important Files' && renderFolderOptions()}
                  </optgroup>
                </select>
              </div>
            )}
          </div>
        )}
        {/* for archive */}
        {fileType!=='Document' && fileType!=='Folder' && (
        <div className='col-12 flex flex-col w-[60%] space-y-3'>
          {menu==='CPC Documents' && (
            <>
            {/* folders  */}
            <div className='flex flex-col w-[100%] space-y-1'>
                <label htmlFor="CPCfolders" className='text-black font-medium text-[1rem] leading-4'>CPC Folders:</label>
               <select name="CPCfolders" id="CPCfolders" onChange={(e) => setCPCFolder(e.target.value)} required>
                <option value="">Select Folder</option>
                 {menu === 'CPC Documents' && renderFolderOptions("CPC Documents")}
               </select>
              </div>
            {/* Documents  */}
            <div className='flex flex-col w-[100%] space-y-1'>
                <label htmlFor="CPCDocuments" className='text-black font-medium text-[1rem] leading-4'>CPC Documents:</label>
                <select name="CPCDocuments" id="CPCDocuments" onChange={(e) => setCPCFolder(e.target.value)} required>
                 <option value="">Select Document</option>
                 {menu === 'CPC Documents' && renderDocumentOptions("CPC Documents")}
                </select>
              </div>
            </>
          )}
          {menu==='IT Documents' &&  (
            <>
            {/* folders  */}
            <div className='flex flex-col w-[100%] space-y-1'>
                <label htmlFor="ITfolders" className='text-black font-medium text-[1rem] leading-4'>IT Folders:</label>
                <select name="ITfolders" id="ITfolders"  onChange={(e) => setITFolder(e.target.value)} required>
                  <option value="">Select Folder</option>
                  {menu === 'IT Documents' && renderFolderOptions("IT Documents")}
                </select>
              </div>
            {/* Documents  */}
            <div className='flex flex-col w-[100%] space-y-1'>
                <label htmlFor="ITDocuments" className='text-black font-medium text-[1rem] leading-4'>IT Documents:</label>
                <select name="ITDocuments" id="ITDocuments"  onChange={(e) => setITFolder(e.target.value)} required>
                  <option value="">Select Documents</option>
                  {menu === 'IT Documents' && renderDocumentOptions("IT Documents")}
                </select>
              </div>
            </>
          )}
          {menu==='Rajbhasha' && (
            <>
            {/* folders  */}
            <div className='flex flex-col w-[100%] space-y-1'>
                <label htmlFor="Rajbhashafolders" className='text-black font-medium text-[1rem] leading-4'>Rajbhasha Folders:</label>
                <select name="Rajbhashafolders" id="Rajbhashafolders"  onChange={(e) => setRajbhashaFolder(e.target.value)} required>
                  <option value="">Select Folder</option>
                  {menu === 'Rajbhasha' && renderFolderOptions("Rajbhasha")}
                </select>
              </div>
            {/* Documents  */}
            <div className='flex flex-col w-[100%] space-y-1'>
                <label htmlFor="RajbhashaDocuments" className='text-black font-medium text-[1rem] leading-4'>Rajbhasha Documents:</label>
                <select name="RajbhashaDocuments" id="RajbhashaDocuments"  onChange={(e) => setRajbhashaFolder(e.target.value)} required>
                  <option value="">Select Documents</option>
                  {menu === 'Rajbhasha' && renderDocumentOptions("Rajbhasha")}
                </select>
              </div>
            </>
          )}
          {menu==='Abhikalp' && (
            <>
            {/* folders  */}
            <div className='flex flex-col w-[100%] space-y-1'>
                <label htmlFor="Abhikalpfolders" className='text-black font-medium text-[1rem] leading-4'>Abhikalp Folders:</label>
                <select name="Abhikalpfolders" id="Abhikalpfolders"  onChange={(e) => setAbhikalpFolder(e.target.value)} required>
                  <option value="">Select Folder</option>
                  {menu === 'Abhikalp' && renderFolderOptions("Abhikalp")}
                </select>
              </div>
            {/* Documents  */}
            <div className='flex flex-col w-[100%] space-y-1'>
                <label htmlFor="AbhikalpDocuments" className='text-black font-medium text-[1rem] leading-4'>Abhikalp Documents:</label>
                <select name="AbhikalpDocuments" id="AbhikalpDocuments"  onChange={(e) => setAbhikalpFolder(e.target.value)} required>
                  <option value="">Select Documents</option>
                  {menu === 'Abhikalp' && renderDocumentOptions("Abhikalp")}
                </select>
              </div>
            </>
          )}
          {menu==='HR Manuals' && (
            <>
            {/* folders  */}
            <div className='flex flex-col w-[100%] space-y-1'>
                <label htmlFor="HRfolders" className='text-black font-medium text-[1rem] leading-4'>HR Folders:</label>
                <select name="HRfolders" id="HRfolders"  onChange={(e) => setHRFolder(e.target.value)} required>
                  <option value="">Select Folder</option>
                  {menu === 'HR Manuals' && renderFolderOptions("HR Manuals")}
                </select>
              </div>
            {/* Documents  */}
            <div className='flex flex-col w-[100%] space-y-1'>
                <label htmlFor="HRDocuments" className='text-black font-medium text-[1rem] leading-4'>HR Documents:</label>
                <select name="HRDocuments" id="HRDocuments"  onChange={(e) => setHRFolder(e.target.value)} required>
                  <option value="">Select Documents</option>
                  {menu === 'HR Manuals' && renderDocumentOptions("HR Manuals")}
                </select>
              </div>
            </>
          )}
          {menu==='Important Files' && (
            <>
            {/* folders  */}
            <div className='flex flex-col w-[100%] space-y-1'>
                <label htmlFor="Importantfolders" className='text-black font-medium text-[1rem] leading-4'>Important Folders:</label>
                <select name="Importantfolders" id="Importantfolders"  onChange={(e) => setImportantFolder(e.target.value)} required>
                  <option value="">Select Folder</option>
                  {menu === 'Important Files' && renderFolderOptions("Important Files")}
                </select>
              </div>
            {/* Documents  */}
            <div className='flex flex-col w-[100%] space-y-1'>
                <label htmlFor="ImportantDocuments" className='text-black font-medium text-[1rem] leading-4'>Important Documents:</label>
                <select name="ImportantDocuments" id="ImportantDocuments"  onChange={(e) => setImportantFolder(e.target.value)} required>
                  <option value="">Select Documents</option>
                  {menu === 'Important Files' && renderDocumentOptions("Important Files")}
                </select>
              </div>
            </>
          )}
        </div>
        )
        }
        {/* Documents upload */}
        <div className="col-12 flex flex-col w-[60%] space-y-1">
        {fileType === 'Document' && (
          <div className="col-md-6">
            <label htmlFor="file" className='text-black font-medium text-[1rem] leading-4'>Upload File:</label>
            <input
              type="file"
              id="file"
              name="file"
              onChange={handleFileChange}
              required/>
          </div>
        )}
        </div>
        <div className='relative'>
           <button
            type="submit"
            className="btn btn-primary absolute btn-lg left-24 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-[1rem] w-full sm:w-auto px-5 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            style={{ marginTop: '20px' }}>
            Upload
          </button>
          <button 
           type="button"
           onClick={handleBool}
           className="btn btn-primary absolute btn-lg right-24 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-[1rem] w-full sm:w-auto px-5 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
           style={{ marginTop: '20px' }}> 
           Archive
         </button>
        </div>
      </div>
    </form>
  );
};
export default FileUploadComponent;









