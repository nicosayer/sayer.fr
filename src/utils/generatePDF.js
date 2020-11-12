import { generatePdf } from "attestation-deplacement-derogatoire-q4-2020/src/js/pdf-util";
import pdfBase from "attestation-deplacement-derogatoire-q4-2020/src/certificate.pdf";

export const generatePDF = async ({ inputs, reasons }) => {
  return generatePdf(inputs, reasons, pdfBase);
};
