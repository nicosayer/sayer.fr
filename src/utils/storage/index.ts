export const getExtension = (type: string) => {
  switch (type) {
    case "image/png":
      return "png";
    case "image/jpeg":
      return "jpg";
    case "application/pdf":
      return "pdf";
  }
};
