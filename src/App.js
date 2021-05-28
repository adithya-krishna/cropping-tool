import React from 'react';
import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';
import saveAs from 'save-as';

import './App.css';
import useFiles from './hooks/useFilesHook';

import spritesheet from "./assets/spritesheet/spritesheet.png";


// function downloadAsZip(urls, zipFilename) {
//   const zip = new JSZip();
//   let count = 0;
//   urls.forEach(function ({ url, filename }) {
//     JSZipUtils.getBinaryContent(url).then((file) => {
//       zip.file(filename.endsWith('.png') ? filename : `${filename}.png`, file, { binary: true });
//       count++;
//       if (count === urls.length) {
//         zip.generateAsync({ type: 'blob' }).then(function (content) {
//           saveAs(content, zipFilename.endsWith('.zip') ? zipFilename : `${zipFilename}.zip`);
//         });
//       }
//     }).catch((err) => {
//       console.log(err);
//     })
//   });
// }

function App() {
  const { loading, allIds, byId } = useFiles({
    imageURL: spritesheet
  });

  return (
    <div className="App">
      {loading && <div>loading...</div>}
      {!loading && allIds.map((id, i) => <div className="card" key={i}><img className={'card-image'} src={byId[id].url} alt={'noImage'} /></div>)}
    </div>
  );
}

export default App;
