import { generatePdf } from "attestation-deplacement-derogatoire-q4-2020/pdf-util";
import pdfBase from "attestation-deplacement-derogatoire-q4-2020/certificate.pdf";

export const generatePDF = async ({ inputs, reasons }) => {
  return generatePdf(inputs, reasons, pdfBase);
};
