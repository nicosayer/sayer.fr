import { DocumentMime, SouvenirPictureMime } from "types/firebase/collections";

export const getExtension = (type: DocumentMime | SouvenirPictureMime) => {
  switch (type) {
    case SouvenirPictureMime.Png:
    case DocumentMime.Png:
      return "png";
    case SouvenirPictureMime.Jpeg:
    case DocumentMime.Jpeg:
      return "jpg";
    case DocumentMime.Pdf:
      return "pdf";
  }
};
