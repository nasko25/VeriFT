import fs from 'fs';
import path from 'path';

const filePath = path.resolve(process.cwd(), 'pages/api/hello.api.js');
const file = fs.readFileSync(filePath).toString();

export default function handler(req, res) {
  res.status(200).send(file);
}
