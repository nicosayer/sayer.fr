import { DocumentMime } from "types/firebase/collections";

export const getExtension = (type: DocumentMime) => {
  switch (type) {
    case DocumentMime.Png:
      return "png";
    case DocumentMime.Jpeg:
      return "jpg";
    case DocumentMime.Pdf:
      return "pdf";
  }
};
