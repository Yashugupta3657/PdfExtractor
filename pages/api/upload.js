import multer from 'multer';
import fsExtra from 'fs-extra';
import path from 'path';
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { OpenAI } from "@langchain/openai";

const uploadDir = '/tmp';

const storage = multer.diskStorage({
  destination: (req, file, cb) => { 
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF files are allowed.'), false);
  }
};

const upload = multer({ storage, fileFilter });

export const config = {
  api: {
    bodyParser: false,
  },
};

const middleware = upload.single('file');

export default async function handler(req, res) {
  try {
    middleware(req, res, async (err) => {
      if (err) {
        console.error('Error handling file upload:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      const { file } = req;

      if (!file) {
        return res.status(400).json({ error: 'No file provided.' });
      }

      const fileName = `${Date.now()}-${file.originalname}`;
      const newPath = path.join('/tmp', fileName);

      // Move the file asynchronously
      await fsExtra.move(file.path, newPath);

      const loader = new PDFLoader(newPath, {
        splitPages: false,
      });

      let docs = await loader.load();
      docs = docs[0].pageContent + "\nDisplay above text in an interactive table with enrich inline css in vertical format with bifurcation of these fields Policy Holder Name, Date of Birth, Policy Number, Claim Number, VALUE, Surgery Date, Type Of Surgery, Surgeon Name, Medical Provider Address, Total Surgery Cost, Conditions related to work, Date Of First Symptoms, Address for Correspondence, Phone Number, Email Address, Employer Name, Healthy Living Corp give html code so that i can directly view on my website";

      console.log(docs);

      const model = new OpenAI({
        modelName: "gpt-3.5-turbo-instruct",
        temperature: 0.9,
        openAIApiKey: process.env.OPENAIKEY,
      });

      const res1 = await model.call(docs);
      console.log({ res1 });

      return res.status(200).json({ success: true, path: newPath, html: res1 });
    });
  } catch (error) {
    console.error('Error handling file upload:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
