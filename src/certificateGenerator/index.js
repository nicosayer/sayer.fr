import { generatePdf } from "certificateGenerator/pdfUtil";
import pdfBase from "certificateGenerator/certificate.pdf";

export const certificateGenerator = async ({ profiles, reasons }) => {
  return generatePdf(profiles, reasons, pdfBase);
};
