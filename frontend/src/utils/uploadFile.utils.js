import { API } from "../services/api";

export const uploadFile = async (files) => {
  const formData = new FormData();

  if (!files || files.length === 0) {
    return [];
  }

  files.forEach((file) => {
    formData.append("images", file.original);
  });

  try {
    const res = await API.post("/upload/files", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.urls;
  } catch (error) {
    console.log(error);
    return [];
  }
};
