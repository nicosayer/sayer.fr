import { Mime } from "types/firebase/collections";

export const getExtension = (type: Mime) => {
  switch (type) {
    case Mime.Png:
      return "png";
    case Mime.Jpeg:
      return "jpg";
    case Mime.Pdf:
      return "pdf";
  }
};
