
import { DocumentEditorContainer, Toolbar } from '@syncfusion/ej2-documenteditor';
import { TitleBar } from './title-bar';
import { Button } from '@syncfusion/ej2-buttons';
/**
 * Default document editor sample 
 */

    
    let hostUrl: string = 'https://services.syncfusion.com/js/production/';
    let contentChanged: boolean = false;
    let container: DocumentEditorContainer = new DocumentEditorContainer({ enableToolbar: true,height:'590px' });
    DocumentEditorContainer.Inject(Toolbar);
    container.serviceUrl = hostUrl + 'api/documenteditor/';
    container.created = function () {
      setInterval(() => {
        if (contentChanged) {
          //You can save the document as below
          container.documentEditor.saveAsBlob('Docx').then((blob: Blob) => {
            console.log('Saved sucessfully');
            let exportedDocument: Blob = blob;
            //Now, save the document where ever you want.
            let formData: FormData = new FormData();
            formData.append('fileName', 'sample.docx');
            formData.append('data', exportedDocument);
            /* tslint:disable */
            var req = new XMLHttpRequest();
            // Replace your running Url here
            req.open(
              'POST',
              'http://localhost:62869/api/documenteditor/SaveToS3',
              true
            );
            req.onreadystatechange = () => {
              if (req.readyState === 4) {
                if (req.status === 200 || req.status === 304) {
                  console.log('Saved sucessfully');
                  let span: HTMLElement = document.createElement('span');
                  let date: Date = new Date();
                  let time: string = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
                  span.innerHTML = 'Auto saved at <b>' + time + '</b><hr>';
                  let log: HTMLElement = document.getElementById('AutosaveLog');
                  log.insertBefore(span, log.firstChild);
                }
              }
            };
            req.send(formData);
          });
          contentChanged = false;
        }
      }, 1000);
    };
    container.appendTo('#container');
    container.contentChange = (): void => {
      contentChanged = true;
  };

    let titleBar: TitleBar = new TitleBar(document.getElementById('documenteditor_titlebar'), container.documentEditor, true);
    container.documentEditor.open(JSON.stringify((titleBar.data)));
    container.documentEditor.documentName = 'Getting Started';
    titleBar.updateDocumentTitle();
   
    container.documentChange = (): void => {
        titleBar.updateDocumentTitle();
        container.documentEditor.focusIn();
    };

      let clear: Button = new Button();
      clear.appendTo('#clear');
  
      document.getElementById('clear').onclick = () => {
          document.getElementById('AutosaveLog').innerHTML = '';
      };
