const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

function changeColorsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Swap emerald -> violet
  content = content.replace(/emerald/g, 'violet');
  // Swap cyan -> fuchsia
  content = content.replace(/cyan/g, 'fuchsia');
  // Swap teal -> purple
  content = content.replace(/teal/g, 'purple');
  // Swap blue -> indigo
  content = content.replace(/blue/g, 'indigo');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated theme in ${filePath}`);
  }
}

function walkDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    let fullPath = path.join(dir, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.css')) {
      changeColorsInFile(fullPath);
    }
  });
}

walkDir(directoryPath);
console.log('Theme update complete!');
