// conver time .
export const formatTime = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const checkIsImage = (url) => {
  if (!url) return false;
  return /\.(jpeg|jpg|gif|png|webp)$/i.test(url);
};

export const getFileName = (url) => {
  if (!url) return "File";
  return url.split("/").pop().split("?")[0].split(":upload:")[0];
};

export const isSystemMessage = (content) => {
  return (
    content?.includes("đã rời nhóm") ||
    content?.includes("đã thêm") ||
    content?.includes("đã xóa")
  );
};
