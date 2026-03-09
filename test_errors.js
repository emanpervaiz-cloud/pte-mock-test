import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    // Capture console messages
    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log(`PAGE ERROR: ${msg.text()}`);
        }
    });

    const errors = [];

    // Capture uncaught exceptions
    page.on('pageerror', error => {
        console.error(`CAPTURED PAGE ERROR: ${error.message}`);
        errors.push({ name: error.name, message: error.message, stack: error.stack });
    });

    try {
        // Go to login first to set origin
        await page.goto('http://localhost:5173/login');

        // Inject fake auth to bypass Login screen
        await page.evaluate(() => {
            localStorage.setItem('pte_user', JSON.stringify({
                id: '123', name: 'Test User', email: 'test@example.com'
            }));
            localStorage.setItem('targetScore', JSON.stringify({ overall: 65 }));
            localStorage.setItem('pte_auth_token', 'fake-jwt-token');
        });

        // Go to dashboard
        await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
        console.log('--- DASHBOARD LOADED ---');
        await page.screenshot({ path: 'dash_screenshot.png' });
        const dashBody = await page.evaluate(() => document.body.innerHTML);
        fs.writeFileSync('dash_body.html', dashBody);

        // Go to Speaking Section
        await page.goto('http://localhost:5173/exam/speaking', { waitUntil: 'networkidle0' });
        console.log('--- SPEAKING SECTION LOADED ---');
        await page.screenshot({ path: 'speaking_screenshot.png' });
        const speakingBody = await page.evaluate(() => document.body.innerHTML);
        fs.writeFileSync('speaking_body.html', speakingBody);

    } catch (e) {
        console.error('Navigation error:', e);
    } finally {
        if (errors.length > 0) {
            fs.writeFileSync('page_errors.json', JSON.stringify(errors, null, 2));
        }
        await browser.close();
    }
})();
