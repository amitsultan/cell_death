import http from "../http-common";
import axios from "axios";

class UploadFilesService {
  upload(file_project, file_extra_channel, onUploadProgress) {
    let formData = new FormData();

    formData.append("projectRar", file_project);
    if(file_extra_channel != undefined){
      formData.append("extraChannel", file_extra_channel);
    }
    return axios.post(process.env.VUE_APP_API_BASE+"experiments/uploadProject", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
  }

  getFiles() {
    return http.get("/files");
  }
}

export default new UploadFilesService();
