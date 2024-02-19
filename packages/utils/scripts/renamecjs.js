import * as fs from "fs";
import * as path from "path";


const directory = './lib/cjs'; // Update this to your actual directory
const fileExtension = '.js'; // Update this to your actual file extension
const newExtension = '.cjs'; // Update this to your desired new extension

fs.readdirSync(directory).forEach(file => {
  if (file.endsWith(fileExtension)) {
    const oldFilePath = path.join(directory, file);
    const newFilePath = path.join(directory, file.replace(new RegExp(`${fileExtension}$`), newExtension));

    fs.renameSync(oldFilePath, newFilePath);
    console.log(`Renamed: ${oldFilePath} to ${newFilePath}`);
  }
});


// need to modify index.cjs to use __exportStar(require("./tokenIdUtils.cjs"), exports);

const filePath = './lib/cjs/index.cjs'; // Update this to the actual path of your index file
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error(`Error reading file: ${err.message}`);
    return;
  }

  // Perform the replacement
  const updatedContent = data.replace(/\.js(["'])/g, '.cjs$1');

  // Write the updated content back to the file
  fs.writeFile(filePath, updatedContent, 'utf8', (writeErr) => {
    if (writeErr) {
      console.error(`Error writing file: ${writeErr.message}`);
    } else {
      console.log(`Updated references in ${filePath} to use .cjs extension.`);
    }
  });
});