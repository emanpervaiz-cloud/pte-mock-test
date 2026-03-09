import fs from 'fs';
import path from 'path';

function findMissingIsMobile(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            findMissingIsMobile(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            // Check if isMobile is used but not defined as a variable, state, or hook
            if (content.includes('isMobile') &&
                !content.includes('const isMobile') &&
                !content.includes('const [isMobile') &&
                !content.includes('let isMobile') &&
                !content.includes('var isMobile') &&
                !content.includes('useIsMobile')) {
                console.log(`FOUND MISSING DECLARATION IN: ${fullPath}`);
            }
        }
    }
}

findMissingIsMobile('./src');
