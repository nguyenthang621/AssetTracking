// import { useState } from 'react'

// interface FileData {
//   id: string
//   filename: string
//   filetype: string
//   fileimage: string | ArrayBuffer | null
//   datetime: string
//   filesize: string
// }

// export default function CardUploadFile() {
//   const [selectedfile, SetSelectedFile] = useState<FileData | null>(null)
//   const [Files, SetFiles] = useState<FileData[]>([])

//   function uuidv4() {
//     return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
//       (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
//     );
//   }

//   const filesizes = (bytes: number, decimals = 2): string => {
//     if (bytes === 0) return '0 Bytes'
//     const k = 1024
//     const dm = decimals < 0 ? 0 : decimals
//     const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
//     const i = Math.floor(Math.log(bytes) / Math.log(k))
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
//   }

//   const InputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     let reader = new FileReader()
//     let file = e.target.files?.[0]

//     if (file) {
//       reader.onloadend = () => {
//         SetSelectedFile({
//           id: uuidv4(),
//           filename: file.name,
//           filetype: file.type,
//           fileimage: reader.result,
//           datetime: file.lastModified?.toLocaleString('en-IN') ?? '',
//           filesize: filesizes(file.size)
//         })
//       }
//       reader.readAsDataURL(file)
//     }
//   }

//   const DeleteSelectFile = (id: string) => {
//     if (window.confirm('Are you sure you want to delete this Image?')) {
//       SetSelectedFile(null)
//     }
//   }

//   const FileUploadSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     e.target.reset()

//     if (selectedfile) {
//       SetFiles((preValue) => [...preValue, selectedfile])
//       SetSelectedFile(null)
//     } else {
//       alert('Please select a file')
//     }
//   }

//   const DeleteFile = (id: string) => {
//     if (window.confirm('Are you sure you want to delete this Image?')) {
//       const result = Files.filter((data) => data.id !== id)
//       SetFiles(result)
//     }
//   }

//   return (
//     <div className='fileupload-view'>
//       <div className='row justify-content-center m-0'>
//         <div className='col-md-6'>
//           <div className='card mt-5'>
//             <div className='card-body'>
//               <div className='kb-data-box'>
//                 <div className='kb-modal-data-title'>
//                   <div className='kb-data-title'>
//                     <h6>Single File Upload With Preview</h6>
//                   </div>
//                 </div>
//                 <form onSubmit={FileUploadSubmit}>
//                   <div className='kb-file-upload'>
//                     <div className='file-upload-box'>
//                       <input type='file' id='fileupload' className='file-upload-input' onChange={InputChange} />
//                       <span>
//                         Drag and drop or <span className='file-link'>Choose your file</span>
//                       </span>
//                     </div>
//                   </div>
//                   <div className='kb-attach-box mb-3'>
//                     {selectedfile && (
//                       <div className='file-atc-box'>
//                         {selectedfile.filename.match(/\.(jpg|jpeg|png|gif|svg)$/i) ? (
//                           <div className='file-image'>
//                             <img src={selectedfile.fileimage as string} alt='' />
//                           </div>
//                         ) : (
//                           <div className='file-image'>
//                             <i className='far fa-file-alt'></i>
//                           </div>
//                         )}
//                         <div className='file-detail'>
//                           <h6>{selectedfile.filename}</h6>
//                           <p>
//                             <span>Size: {selectedfile.filesize}</span>
//                             <span className='ml-2'>Modified Time: {selectedfile.datetime}</span>
//                           </p>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                   <div className='kb-buttons-box'>
//                     <button type='submit' className='btn btn-primary form-submit'>
//                       Upload
//                     </button>
//                   </div>
//                 </form>
//                 {Files.length > 0 && (
//                   <div className='kb-attach-box'>
//                     <hr />
//                     {Files.map((data, index) => (
//                       <div className='file-atc-box' key={index}>
//                         {data.filename.match(/\.(jpg|jpeg|png|gif|svg)$/i) ? (
//                           <div className='file-image'>
//                             <img src={data.fileimage as string} alt='' />
//                           </div>
//                         ) : (
//                           <div className='file-image'>
//                             <i className='far fa-file-alt'></i>
//                           </div>
//                         )}
//                         <div className='file-detail'>
//                           <h6>{data.filename}</h6>
//                           <p>
//                             <span>Size: {data.filesize}</span>
//                             <span className='ml-3'>Modified Time: {data.datetime}</span>
//                           </p>
//                           <div className='file-actions'>
//                             <button className='file-action-btn' onClick={() => DeleteFile(data.id)}>
//                               Delete
//                             </button>
//                             <a href={data.fileimage as string} className='file-action-btn' download={data.filename}>
//                               Download
//                             </a>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
