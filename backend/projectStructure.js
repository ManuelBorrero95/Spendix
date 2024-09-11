
// projectStructure.js
import fs from 'fs';
import path from 'path';

const ignoreDirs = ['node_modules', '.git', 'build', 'dist'];
const maxDepth = 3;

function createTree(dir, depth = 0) {
    if (depth >= maxDepth) return '';

    let output = '';
    const files = fs.readdirSync(dir);

    files.forEach((file, index) => {
        if (ignoreDirs.includes(file)) return;

        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        const isLast = index === files.length - 1;

        const prefix = depth === 0 ? '' : '│   '.repeat(depth - 1) + (isLast ? '└── ' : '├── ');
        output += `${prefix}${file}\n`;

        if (stats.isDirectory()) {
            output += createTree(filePath, depth + 1);
        }
    });

    return output;
}

console.log('Struttura del progetto Spendix:');
console.log(createTree('.'));