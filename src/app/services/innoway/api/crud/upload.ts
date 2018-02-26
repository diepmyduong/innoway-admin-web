import { CrudAPI, iCrud } from '../crud'

import { InnowayApiService } from '../../innoway-api.service'

export interface iUpload extends iCrud {

}

export class Upload extends CrudAPI<iUpload> {
  constructor(
    public api: InnowayApiService
  ) {
    super(api, 'summary')
  }

  async uploadImage(file) {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', "https://api.imgur.com/3/image", false);
    xhr.setRequestHeader("Authorization", "Client-ID d4de8224fa0042f");
    xhr.setRequestHeader("Content-Type", "multipart/form-data");
    xhr.send(file);
    let responseObject = JSON.parse(xhr.response)
    return responseObject.data
  }

  uploadImageToImgur(files: Array<File>) {
    this.makeFileRequest("https://api.imgur.com/3/image", [], files).then((result) => {
      console.log("upload", result);
    }, (error) => {
      console.error("upload", error);
    });
  }

  makeFileRequest(url: string, params: Array<string>, files: Array<File>) {
    return new Promise((resolve, reject) => {
      var formData: any = new FormData();
      var xhr = new XMLHttpRequest();
      for (var i = 0; i < files.length; i++) {
        formData.append("image", files[i]);
      }
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      }

      xhr.open("POST", url, true);
      xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
      xhr.setRequestHeader("authorization", "Client-ID d4de8224fa0042f");
      xhr.setRequestHeader("mimeType", "multipart/form-data");
      xhr.send(formData);
    });
  }
}
