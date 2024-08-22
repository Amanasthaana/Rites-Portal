import React, { useState, useEffect } from "react";
import axios from "axios";


import image1 from "./Images/1st.jpeg"
import image2 from "./Images/2nd.jpeg"



function Navbar() {
  const [data, setData] = useState({ folders: [], documents: [] });
  const [visibleFolders, setVisibleFolders] = useState([]);
  const [menu, setMenu] = useState('CPC Documents');
  console.log("Initial state:", data, visibleFolders, menu);


  
  const toggleDocuments = (folder) => {
    console.log('Toggle documents called with folder:', folder);
    console.log('Folder name:', folder.name);
    setVisibleFolders((prev) =>
      prev.includes(folder.name)
        ? prev.filter((name) => name !== folder.name)
        : [...prev, folder.name]
    );
  };
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await axios.post("http://localhost:4000/api/getData", {
          menu_name: menu,
        });
        console.log("Response data:", response.data.folders[0].id); // Log the response data
        setData(response.data);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
  
    loadData();
  }, [menu]);
  
  if (data.documents.length > 0) {
    console.log("Documents:", data.documents);
   
  }
  const handleMenuChange = (menu) => {
    console.log("Menu changed to:", menu);
    setMenu(menu);
    setVisibleFolders([]); // Reset visible folders when changing menu
  };

  const handleDocumentClick = async (event, id) => {
    event.preventDefault();
    try {
      const response = await axios.get(`http://localhost:4000/api/document/${id}`, {
        responseType: "blob",
      });
      const mimeType = response.headers['content-type'];
      console.log("Received MIME type:", mimeType); 
  
      // Create an object URL for the blob
      let url = window.URL.createObjectURL(new Blob([response.data], { type: mimeType }));
  
      // Open the URL in a new tab
      window.open(url, "_blank" ,"noreferrer");
    } catch (error) {
      console.error("Error fetching document:", error);
      alert("Error fetching document. Please try again later.");
    }
  };

  /////////////////
return(
  <>
      <div className="w-full sticky top-0 z-[1000] bg-blue-900">
        <div className="flex flex-row justify-between w-full  items-center h-[92px] px-7 mx-auto ">
          {/* logo image */}
          <a href="https://www.rites.com/" target="_blank" rel="noreferrer"> 
            <img src="./Images/RITES.NS_BIG-6304eec7.webp" alt="rites" className="h-[80px] absolute left-3 top-1 border-none" /></a>
          {/* Mega dropdown menu */}
          <nav style={{"marginLeft" : "7rem"}}>
            <ul className="flex items-center justify-center font-semibold text-white">
              <li className="relative group px-3 py-2 hover:text-yellow-500 cursor-pointer" onMouseEnter={(e) => handleMenuChange("CPC Documents")}>
                <button className="hover:text-yellow-500 flex flex-row items-center">
                  CPC Documents
                  <svg className="w-2.5 h-2.5 ms-1 mt-1 font-semibold" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m1 1 4 4 4-4" />
                  </svg>
                </button>
                <div className="mega-menu-container absolute top-0 -left-[260px] transition group-hover:translate-y-5 translate-y-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible duration-500 ease-in-out group-hover:transform z-1000 w-screen transform">
                  <div className="relative top-[46px] p-6 bg-white rounded-xl shadow-xl w-full">
                    <div className="w-10 h-10 bg-white transform rotate-45 absolute top-0 left-[146px] z-0 translate-x-0 transition-transform group-hover:translate-x-[12rem] duration-500 ease-in-out rounded-sm">
                    </div>
                    <div className="relative z-10">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <p className="uppercase tracking-wider text-gray-500 font-medium text-[13px]">Folders</p>
                          <ul className="mt-3 text-[15px] max-h-64 overflow-y-auto" id="CPC Documents">
                          {data.folders.filter((folder) =>!folder.hide).map((folder) => {return (
            
                              <li key={folder.id}>
                                <div
                                  className="folder"
                                  data-target={folder.name}
                                  onClick={() => toggleDocuments(folder)}
                                >
                                  <img
                                    src="https://cdn-icons-png.freepik.com/256/3767/3767084.png?semt=ais_hybrid"
                                    alt="Folder Icon"
                                    className="w-8 h-8"
                                  />
                                  <span className="text-[10px] text-blue-900 font-semibold hover:underline transition 200">
                                    {folder.name}
                                  </span>
                                </div>
                                <div
                                  id={folder.name}
                                  className="documents-list"
                                  style={{ display: visibleFolders.includes(folder.name) ? 'block' : 'none' }}
                         >
                                  <ul>
                                    {data.documents
                                      .filter((doc) => doc.folder_name === folder.name)
                                      .map((doc) => (
                                        <li key={doc.id}>
                                          <div>
                                            <img
                                              width={10}
                                              loading="lazy"
                                              className="pt-2"
                                              src={doc.icon}
                                              alt="Document Icon"
                                            />
                                           <a
                                               href="#"
                                               className="text-[10px] text-blue-900 font-semibold hover:underline transition 200"
                                               onClick={(event) => handleDocumentClick(event, doc.id)}
                                               target="_blank" rel="noreferrer"
                                             >
                                              {doc.name}
                                            </a>
                                          </div>
                                        </li>
                                      ))}
                                  </ul>
                                </div>
                              </li>
)})}
                           
                          </ul>
                        </div>
                    
    
                        <div>
                          <p className="uppercase tracking-wider text-gray-500 font-medium text-[13px]">Documents</p>
                          <ul className="mt-3 text-[15px] max-h-64 overflow-y-auto" id="CPC Documents">
                          {data.documents
                          .filter((doc) => !doc.hide && doc.folder_name === 'Documents' && doc.menu_name === 'CPC Documents')
                          .map((doc) => (
                            <li key={doc.id}>
                              <img
                                width={20}
                                loading="lazy"
                                className="pt-2"
                                src={doc.icon}
                                alt="Document Icon"
                              />
                              <a
                                href="#"
                                className="text-[10px] text-blue-900 font-semibold hover:underline transition 200"
                                onClick={(event) => handleDocumentClick(event, doc.id)}
                                target="_blank" rel="noreferrer"
                              >
                                {doc.name}
                              </a>
                            </li>
                          ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>  
              <li className="relative group px-3 py-2 hover:text-yellow-500 cursor-pointer" onMouseEnter={(e) => handleMenuChange("IT Documents")}>
                <button className="hover:text-yellow-500 flex flex-row items-center">
                  IT Documents
                  <svg className="w-2.5 h-2.5 ms-1 mt-1  font-semibold" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m1 1 4 4 4-4" />
                  </svg> 
                </button>
                
                <div className="absolute top-0 -left-[420px] transition group-hover:translate-y-5 translate-y-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible duration-500 ease-in-out group-hover:transform z-50 w-screen transform">
                  <div className="relative top-[46px] p-6 bg-white rounded-xl shadow-xl w-full">
                    <div className="w-10 h-10 bg-white transform rotate-45 absolute top-0 left-[18rem] z-0 translate-x-0 transition-transform group-hover:translate-x-[12rem] duration-500 ease-in-out rounded-sm">
                    </div>
                    <div className="relative z-10">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <p className="uppercase tracking-wider text-gray-500 font-medium text-[13px]">Folders</p>
                          
                          <ul className="mt-3 text-[15px] max-h-64 overflow-y-auto" id="IT Documents">
                          {data.folders.map((folder, id) => { return (
                            
                              <li key={folder.id}>
                                <div
                                  className="folder"
                                  data-target={folder.name}
                                  onClick={() => toggleDocuments(folder)}
                                >
                                  <img
                                    src="https://cdn-icons-png.freepik.com/256/3767/3767084.png?semt=ais_hybrid"
                                    alt="Folder Icon"
                                    className="w-8 h-8"
                                  />
                                  <span className="text-[10px] text-blue-900 font-semibold hover:underline transition 200">
                                    {folder.name}
                                  </span>
                                </div>
                                <div
                                  id={folder.name}
                                  className="documents-list"
                                  style={{ display: visibleFolders.includes(folder.name) ? 'block' : 'none' }}
                                >
                                  <ul>
                                    {data.documents
                                      .filter((doc) => !doc.hide && doc.folder_name === folder.name)
                                      .map((doc) => (
                                        <li key={doc.id}>
                                          <div>
                                            <img
                                              width={10}
                                              loading="lazy"
                                              className="pt-2"
                                              src={doc.icon}
                                              alt="Document Icon"
                                            />
                                            <a
                                               href="#"
                                               className="text-[10px] text-blue-900 font-semibold hover:underline transition 200"
                                               onClick={(event) => handleDocumentClick(event, doc.id)}
                                               target="_blank" rel="noreferrer"
                                             >
                                              {doc.name}
                                            </a>
                                          </div>
                                        </li>
                                      ))}
                                  </ul>
                                </div>
                              </li>
                            )})}
                          </ul>
                        </div>
                        <div>
                          <p className="uppercase tracking-wider text-gray-500 font-medium text-[13px]">Documents</p>
                          <ul className="mt-3 text-[15px] max-h-64 overflow-y-auto" id="IT Documents">
                          {data.documents
                            .filter((doc) => !doc.hide && doc.folder_name === 'Documents' && doc.menu_name === 'IT Documents')
                          .map((doc) => (
                            <li key={doc.id}>
                              <img
                                width={20}
                                loading="lazy"
                                className="pt-2"
                                src={doc.icon}
                                alt="Document Icon"
                              />
                              <a
                                href="#"
                                className="text-[10px] text-blue-900 font-semibold hover:underline transition 200"
                                onClick={(event) => handleDocumentClick(event, doc.id)}
                                target="_blank" rel="noreferrer"
                              >
                                {doc.name}
                              </a>
                            </li>
                                     ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li className="relative group px-3 py-2 hover:text-yellow-500 cursor-pointer" onMouseEnter={(e) => handleMenuChange("Rajbhasha")}>
                <button className="hover:text-yellow-500 flex flex-row items-center">
                  Rajbhasha
                  <svg className="w-2.5 h-2.5 ms-1 mt-1  font-semibold" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m1 1 4 4 4-4" />
                  </svg>
                </button>
                <div className="absolute top-0 -left-[550px] transition group-hover:translate-y-5 translate-y-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible duration-500 ease-in-out group-hover:transform z-50 w-screen transform">
                  <div className="relative top-[46px] p-6 bg-white rounded-xl shadow-xl w-full">
                    <div className="w-10 h-10 bg-white transform rotate-45 absolute top-0 left-96 z-0 translate-x-0 transition-transform group-hover:translate-x-[12rem] duration-500 ease-in-out rounded-sm">
                    </div>
                    <div className="relative z-10">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <p className="uppercase tracking-wider text-gray-500 font-medium text-[13px]">Folders</p>
                          <ul className="mt-3 text-[15px] max-h-64 overflow-y-auto" id="Rajbhasha">
                          {data.folders.filter((folder) =>!folder.hide).map((folder) => {return (
                              <li key={folder.id}>
                                <div
                                  className="folder"
                                  data-target={folder.name}
                                  onClick={() => toggleDocuments(folder)}
                                >
                                  <img
                                    src="https://cdn-icons-png.freepik.com/256/3767/3767084.png?semt=ais_hybrid"
                                    alt="Folder Icon"
                                    className="w-8 h-8"
                                  />
                                  <span className="text-[10px] text-blue-900 font-semibold hover:underline transition 200">
                                    {folder.name}
                                  </span>
                                </div>
                                <div
                                  id={folder.name}
                                  className="documents-list"
                                  style={{ display: visibleFolders.includes(folder.name) ? 'block' : 'none' }}
                                >
                                  <ul>
                                    {data.documents
                                      .filter((doc) => !doc.hide && doc.folder_name === folder.name)
                                      .map((doc) => (
                                        <li key={doc.id}>
                                          <div>
                                            <img
                                              width={10}
                                              loading="lazy"
                                              className="pt-2"
                                              src={doc.icon}
                                              alt="Document Icon"
                                            />
                                            <a
                                               href="#"
                                               className="text-[10px] text-blue-900 font-semibold hover:underline transition 200"
                                               onClick={(event) => handleDocumentClick(event, doc.id)}
                                               target="_blank" rel="noreferrer" 
                                             >
                                              {doc.name}
                                            </a>
                                          </div>
                                        </li>
                                      ))}
                                  </ul>
                                </div>
                              </li>
                            )})}
                            
                          </ul>
                        </div>
                        <div>
                          <p className="uppercase tracking-wider text-gray-500 font-medium text-[13px]">Documents</p>
                          <ul className="mt-3 text-[15px] max-h-64 overflow-y-auto" id="Rajbhasha">
                          {data.documents
                            .filter(
                           (doc) =>
                            !doc.hide &&
                             doc.folder_name === 'Documents' &&
                             doc.menu_name === 'Rajbhasha'
                                  )
                          .map((doc) => (
                            <li key={doc.id}>
                              <img
                                width={20}
                                loading="lazy"
                                className="pt-2"
                                src={doc.icon}
                                alt="Document Icon"
                              />
                              <a
                                href="#"
                                className="text-[10px] text-blue-900 font-semibold hover:underline transition 200"
                                onClick={(event) => handleDocumentClick(event, doc.id)}
                                target="_blank" rel="noreferrer"
                              >
                                {doc.name}
                              </a>
                            </li>
                                     ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li className="relative group px-3 py-2 hover:text-yellow-500 cursor-pointer" onMouseEnter={(e) => handleMenuChange("Abhikalp")}>
                <button className="hover:text-yellow-500 flex flex-row items-center">
                  Abhikalp
                  <svg className="w-2.5 h-2.5 ms-1 mt-1  font-semibold" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m1 1 4 4 4-4" />
                  </svg>
                </button>
                <div className="absolute top-0 -left-[660px] transition group-hover:translate-y-5 translate-y-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible duration-500 ease-in-out group-hover:transform z-50 w-screen transform">
                  <div className="relative top-[46px] p-6 bg-white  shadow-xl w-full">
                    <div className="w-10 h-10 bg-white transform rotate-45 absolute top-0 z-0 left-[31rem] translate-x-0 transition-transform group-hover:translate-x-[12rem] duration-500 ease-in-out rounded-sm">
                    </div>
                    <div className="relative z-10">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <p className="uppercase tracking-wider text-gray-500 font-medium text-[13px]">Folders</p>
                          <ul className="mt-3 text-[15px] max-h-64 overflow-y-auto" id="Abhikalp">
                          {data.folders.filter((folder) =>!folder.hide).map((folder) => (
                              <li key={folder.id}>
                                <div
                                  className="folder"
                                  data-target={folder.name}
                                  onClick={() => toggleDocuments(folder)}
                                >
                                  <img
                                    src="https://cdn-icons-png.freepik.com/256/3767/3767084.png?semt=ais_hybrid"
                                    alt="Folder Icon"
                                    className="w-8 h-8"
                                  />
                                  <span className="text-[10px] text-blue-900 font-semibold hover:underline transition 200">
                                    {folder.name}
                                  </span>
                                </div>
                                <div
                                  id={folder.name}
                                  className="documents-list"
                                  style={{ display: visibleFolders.includes(folder.name) ? 'block' : 'none' }}
                                >
                                  <ul>
                                    {data.documents
                                      .filter((doc) => !doc.hide && doc.folder_name === folder.name)
                                      .map((doc) => (
                                        <li key={doc.id}>
                                          <div>
                                            <img
                                              width={10}
                                              loading="lazy"
                                              className="pt-2"
                                              src={doc.icon}
                                              alt="Document Icon"
                                            />
                                            <a
                                               href="#"
                                               className="text-[10px] text-blue-900 font-semibold hover:underline transition 200"
                                               onClick={(event) => handleDocumentClick(event, doc.id)}
                                               target="_blank" rel="noreferrer"
                                             >
                                              {doc.name}
                                            </a>
                                          </div>
                                        </li>
                                      ))}
                                  </ul>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="uppercase tracking-wider text-gray-500 font-medium text-[13px]">Documents</p>
                          <ul className="mt-3 text-[15px] max-h-64 overflow-y-auto" id="Abhikalp">
                          {data.documents
                            .filter(
                           (doc) =>
                            !doc.hide &&
                             doc.folder_name === 'Documents' &&
                             doc.menu_name === 'Abhikalp'
                                  )
                          .map((doc) => (
                            <li key={doc.id}>
                              <img
                                width={20}
                                loading="lazy"
                                className="pt-2"
                                src={doc.icon}
                                alt="Document Icon"
                              />
                              <a
                                href="#"
                                className="text-[10px] text-blue-900 font-semibold hover:underline transition 200"
                                onClick={(event) => handleDocumentClick(event, doc.id)}
                                target="_blank" rel="noreferrer"
                              >
                                {doc.name}
                              </a>
                            </li>
                                     ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li className="relative group px-3 py-2 hover:text-yellow-500  cursor-pointer" onMouseEnter={(e) => handleMenuChange("Hr Manuals")}>
                <button className="hover:text-yellow-500  flex flex-row items-center">
                  Hr Manuals
                  <svg className="w-2.5 h-2.5 ms-1 mt-1 font-semibold" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m1 1 4 4 4-4" />
                  </svg>
                </button>
                <div className="absolute top-0 -left-[765px] transition group-hover:translate-y-5 translate-y-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible duration-500 ease-in-out group-hover:transform z-50 w-screen transform">
                  <div className="relative top-[46px] p-6 bg-white   w-full">
                    <div className="w-10 h-10 left-[39rem] bg-white transform rotate-45 absolute top-0 z-0 translate-x-0 transition-transform group-hover:translate-x-[12rem] duration-500 ease-in-out rounded-sm">
                    </div>
                    <div className="relative z-10">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <p className="uppercase tracking-wider text-gray-500 font-medium text-[13px]">Folders</p>
                          <ul className="mt-3 text-[15px] max-h-64 overflow-y-auto" id="Hr Manuals">
                          {data.folders.filter((folder) =>!folder.hide).map((folder) => (
                              <li key={folder.id}>
                                <div
                                  className="folder"
                                  data-target={folder.name}
                                  onClick={() => toggleDocuments(folder)}
                                >
                                  <img
                                    src="https://cdn-icons-png.freepik.com/256/3767/3767084.png?semt=ais_hybrid"
                                    alt="Folder Icon"
                                    className="w-8 h-8"
                                  />
                                  <span className="text-[10px] text-blue-900 font-semibold hover:underline transition 200">
                                    {folder.name}
                                  </span>
                                </div>
                                <div
                                  id={folder.name}
                                  className="documents-list"
                                  style={{ display: visibleFolders.includes(folder.name) ? 'block' : 'none' }}
                                >
                                  <ul>
                                    {data.documents
                                      .filter((doc) => !doc.hide && doc.folder_name === folder.name)
                                      .map((doc) => (
                                        <li key={doc.id}>
                                          <div>
                                            <img
                                              width={10}
                                              loading="lazy"
                                              className="pt-2"
                                              src={doc.icon}
                                              alt="Document Icon"
                                            />
                                            <a
                                               href="#"
                                               className="text-[10px] text-blue-900 font-semibold hover:underline transition 200"
                                               onClick={(event) => handleDocumentClick(event, doc.id)}
                                               target="_blank" rel="noreferrer"
                                             >
                                              {doc.name}
                                            </a>
                                          </div>
                                        </li>
                                      ))}
                                  </ul>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="uppercase tracking-wider text-gray-500 font-medium text-[13px]">Documents</p>
                          <ul className="mt-3 text-[15px] max-h-64 overflow-y-auto" id="Hr Manuals">
                          {data.documents
                            .filter(
                           (doc) =>
                            !doc.hide &&
                             doc.folder_name === 'Documents' &&
                             doc.menu_name === 'HR Manuals'
                                  )
                          .map((doc) => (
                            <li key={doc.id}>
                              <img
                                width={20}
                                loading="lazy"
                                className="pt-2"
                                src={doc.icon}
                                alt="Document Icon"
                              />
                              <a
                                href="#"
                                className="text-[10px] text-blue-900 font-semibold hover:underline transition 200"
                                onClick={(event) => handleDocumentClick(event, doc.id)}
                                target="_blank" rel="noreferrer"
                              >
                                {doc.name}
                              </a>
                            </li>
                                     ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li className="relative group px-3 py-2 hover:text-yellow-500 cursor-pointer" onMouseEnter={(e) => handleMenuChange("Important Files")}>
                <button className="hover:text-yellow-500 flex flex-row items-center">
                  Important Files
                  <svg className="w-2.5 h-2.5 ms-1 mt-1 font-semibold" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m1 1 4 4 4-4" />
                  </svg>
                </button>
                <div id="dropdownMenu" className="absolute top-0 -left-[885px] transition group-hover:translate-y-5 translate-y-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible duration-500 ease-in-out group-hover:transform z-50 transform">
                  <div className="relative top-[46px] p-6 bg-white shadow-xl w-screen">
                    <div className="w-10 h-10 left-[48rem] bg-white transform rotate-45 absolute top-0 z-0 translate-x-0 transition-transform group-hover:translate-x-[12rem] duration-500 ease-in-out rounded-sm">
                    </div>
                    <div className="relative z-10">
                      <div className="grid grid-cols-2 gap-6">
                        <div id="hide">
                          <p className="uppercase tracking-wider text-gray-500 font-medium text-[13px]">Folders</p>
                          <ul className="mt-3 text-[15px] max-h-64 overflow-y-auto" id="Important Files">
                          {data.folders.filter((folder) =>!folder.hide).map((folder) => (
                              <li key={folder.id}>
                                <div
                                  className="folder"
                                  data-target={folder.name}
                                  onClick={() => toggleDocuments(folder)}
                                >
                                  <img
                                    src="https://cdn-icons-png.freepik.com/256/3767/3767084.png?semt=ais_hybrid"
                                    alt="Folder Icon"
                                    className="w-8 h-8"
                                  />
                                  <span className="text-[10px] text-blue-900 font-semibold hover:underline transition 200">
                                    {folder.name}
                                  </span>
                                </div>
                                <div
                                  id={folder.name}
                                  className="documents-list"
                                  style={{ display: visibleFolders.includes(folder.name) ? 'block' : 'none' }}
                                >
                                  <ul>
                                    {data.documents
                                      .filter((doc) => !doc.hide && doc.folder_name === folder.name)
                                      .map((doc) => (
                                        <li key={doc.id}>
                                          <div>
                                            <img
                                              width={10}
                                              loading="lazy"
                                              className="pt-2"
                                              src={doc.icon}
                                              alt="Document Icon"
                                            />
                                           <a
                                               href="#"
                                               className="text-[10px] text-blue-900 font-semibold hover:underline transition 200"
                                               onClick={(event) => handleDocumentClick(event, doc.id)}
                                               target="_blank" rel="noreferrer"
                                             >
                                              {doc.name}
                                            </a>
                                          </div>
                                        </li>
                                      ))}
                                  </ul>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="uppercase tracking-wider text-gray-500 font-medium text-[13px]">Documents</p>
                          <ul className="mt-3 text-[15px] max-h-64 overflow-y-auto" id="Important Files">
                          {data.documents
                            .filter((doc) => !doc.hide && doc.folder_name === 'Documents' && doc.menu_name === 'Important Files')
                            .map((doc) => (
                              <li key={doc.id}>
                                <img
                                  width={20}
                                  loading="lazy"
                                  className="pt-2"
                                  src={doc.icon}
                                  alt="Document Icon"
                                />
                                <a
                                  href="#"
                                  className="text-[10px] text-blue-900 font-semibold hover:underline transition 200"
                                  onClick={(event) => handleDocumentClick(event, doc.id)}
                                  target="_blank" rel="noreferrer"
                                >
                                  {doc.name}
                                </a>
                              </li>
                                  ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>      
          </nav>        
          <form className="flex items-center max-w-sm justify-center">  
            <label htmlFor="simple-search" className="sr-only">Search</label>
            <div className="relative w-full">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none right-3">
              </div>
              <input type="text" id="simple-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block w-full    dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-black dark:focus:border-black" placeholder="Search " required />
            </div>
            <button type="submit" className="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
              <span className="sr-only">Search</span>
            </button>
          </form>
        </div>           
      </div>
      
      <div class="social-icons">
            <a href="https://www.facebook.com/officialritesltd" target="_blank">
                <img src="https://tse4.mm.bing.net/th?id=OIP.OIsjsujhlG7WR2Pmmxw9TAHaHa&pid=Api&P=0&h=180" alt="Facebook" />
            </a>
            <a href="https://www.youtube.com/@RITESLtd" target="_blank">
                <img src="https://tse4.mm.bing.net/th?id=OIP.B_r07_-I0vymiISetHlwuAHaFL&pid=Api&P=0&h=180" alt="YouTube" />
            </a>
            <a href="https://www.instagram.com/ritesltdindia/" target="_blank">
                <img src="https://tse4.mm.bing.net/th?id=OIP.JtmXSh_uyZBaTg1eXd-NtgHaHa&pid=Api&P=0&h=180" alt="Instagram" />
            </a>
            <a href="https://www.linkedin.com/company/rites-limited/" target="_blank">
                <img src="https://tse4.mm.bing.net/th?id=OIP.DgVNhFcvWWSCxJpVWsry4wHaHV&pid=Api&P=0&h=180" alt="LinkedIn" />
            </a>
            <a href="https://www.rites.com" target="_blank">
                <img src="https://tse2.mm.bing.net/th?id=OIP.-ZSitWzSO_Y26R7-c8xhIQHaHa&pid=Api&P=0&h=180" alt="Google" />
            </a>
        </div>
        <footer id="main-footer">
            <div class="footer-content">
                <ul>
                    <li><a href="faq.html" target="_blank">FAQ</a></li>
                    <li><a href="privacy-policy.html" target="_blank">Privacy Policy</a></li>
                    <li><a href="terms-of-use.html" target="_blank">Terms of Use</a></li>
                    <li><a href="copyright-of-2024.html" target="_blank">Copyright 2024 | Rites</a></li>
                </ul>
            </div>
        </footer>
        <div class="slider">
        <div class="slides">
            <div class="slide fade">
                <img src={image1} alt="Slide 1" />
            </div>
            <div class="slide fade">
                <img src={image2} alt="Slide 2" />
            </div>
        </div>
        
        <div class="nav-dots">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
        </div>
    </div>
</>
    )
   
}
export default Navbar;