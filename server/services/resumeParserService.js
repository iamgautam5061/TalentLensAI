import fs from 'fs/promises';
import { PDFParse } from "pdf-parse";
import mammoth from 'mammoth';

export const parseResume = async ({ path, mimetype }) => {
  if (mimetype === "application/pdf") {
    const fileBuffer = await fs.readFile(path);

    const parser = new PDFParse({
      data: fileBuffer,
    });

    const parsedPdf = await parser.getText();

    await parser.destroy();

    return parsedPdf.text;
  }

  if (
    mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({ path });

    return result.value;
  }

  throw new Error("Unsupported file type");

}
