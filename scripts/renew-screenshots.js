#!/usr/bin/env node
/**
 * Screenshot Renewal Script for Lab Instructions
 *
 * Usage:
 *   node scripts/renew-screenshots.js <cluster-domain> <username> <password> [chapter]
 *
 * Examples:
 *   # Renew all chapters
 *   node scripts/renew-screenshots.js apps.cluster-xyz.opentlc.com user1 mypassword
 *
 *   # Renew specific chapter
 *   node scripts/renew-screenshots.js apps.cluster-xyz.opentlc.com user1 mypassword 2-linguistics
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

// Parse command line arguments
const CLUSTER_DOMAIN = process.argv[2];
const USERNAME = process.argv[3];
const PASSWORD = process.argv[4];
const SPECIFIC_CHAPTER = process.argv[5];

if (!CLUSTER_DOMAIN || !USERNAME || !PASSWORD) {
  console.error(`
Usage: node scripts/renew-screenshots.js <cluster-domain> <username> <password> [chapter]

Arguments:
  cluster-domain  The OpenShift cluster domain (e.g., apps.cluster-xyz.opentlc.com)
  username        The username for login (e.g., user1)
  password        The password for login
  chapter         Optional: specific chapter to renew (e.g., 2-linguistics)

Examples:
  node scripts/renew-screenshots.js apps.cluster-xyz.opentlc.com user1 mypassword
  node scripts/renew-screenshots.js apps.cluster-xyz.opentlc.com user1 mypassword 2-linguistics
`);
  process.exit(1);
}

const DOCS_DIR = path.join(__dirname, '..', 'docs');
const CONSOLE_URL = `https://console-openshift-console.${CLUSTER_DOMAIN}`;

// Helper function to add red highlight to an element
async function addRedHighlight(page, selector, options = {}) {
  const { useOutline = true, borderWidth = '3px' } = options;
  await page.evaluate(({ sel, outline, width }) => {
    const el = document.querySelector(sel);
    if (el) {
      if (outline) {
        el.style.outline = `${width} solid red`;
        el.style.outlineOffset = '2px';
      } else {
        el.style.border = `${width} solid red`;
        el.style.borderRadius = '4px';
      }
    }
  }, { sel: selector, outline: useOutline, width: borderWidth });
}

// Helper function to wait and retry
async function waitForSelector(page, selector, timeout = 10000) {
  try {
    await page.waitForSelector(selector, { timeout });
    return true;
  } catch {
    return false;
  }
}

// Login to OpenShift
async function loginToOpenShift(page) {
  console.log('  Navigating to OpenShift console...');
  await page.goto(CONSOLE_URL);
  await page.waitForLoadState('networkidle');

  // Wait for login page
  await page.waitForSelector('text=Students', { timeout: 30000 });

  // Take login screenshot with highlight
  await addRedHighlight(page, 'a[href*="idp=Students"]');
  await page.screenshot({
    path: path.join(DOCS_DIR, '2-linguistics', 'images', 'openshift-login.png')
  });
  console.log('  ✓ openshift-login.png');

  // Click Students
  await page.click('text=Students');

  // Fill credentials
  await page.fill('input[name="username"]', USERNAME);
  await page.fill('input[name="password"]', PASSWORD);
  await page.click('button[type="submit"]');

  // Wait for console to load
  await page.waitForLoadState('networkidle');

  // Skip tour if present
  const skipTour = await page.$('button:has-text("Skip tour")');
  if (skipTour) {
    await skipTour.click();
    await page.waitForTimeout(1000);
  }

  console.log('  ✓ Logged in successfully');
}

// Chapter 2: Linguistics screenshots
async function chapter2Linguistics(page) {
  console.log('\n📸 Chapter 2: Linguistics');
  const imagesDir = path.join(DOCS_DIR, '2-linguistics', 'images');

  // Ensure we're on projects page
  await page.goto(`${CONSOLE_URL}/k8s/cluster/projects`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // Screenshot: openshift-console.png (Projects page)
  await page.screenshot({ path: path.join(imagesDir, 'openshift-console.png') });
  console.log('  ✓ openshift-console.png');

  // Navigate to Helm > Releases
  await page.click('button:has-text("Helm")');
  await page.click('text=Releases');
  await page.waitForLoadState('networkidle');

  // Switch to user-canopy project
  await page.click('button:has-text("Project:")');
  await page.click(`text=${USERNAME}-canopy`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  // Screenshot: add-helm.png
  await addRedHighlight(page, 'button:has-text("Project:")');
  await addRedHighlight(page, 'a:has-text("Create Helm Release")');
  await page.screenshot({ path: path.join(imagesDir, 'add-helm.png') });
  console.log('  ✓ add-helm.png');

  // Click Create Helm Release
  await page.click('text=Create Helm Release');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // Check Canopy Helm Charts
  await page.click('text=Canopy Helm Charts');
  await page.waitForTimeout(1000);

  // Screenshot: canopy-helm.png
  await page.evaluate(() => {
    // Highlight checkbox area
    const checkboxDiv = document.querySelector('input[type="checkbox"][checked]')?.closest('div');
    if (checkboxDiv) {
      checkboxDiv.style.border = '3px solid red';
      checkboxDiv.style.borderRadius = '4px';
    }
    // Highlight Canopy Ui tile
    const tiles = document.querySelectorAll('[class*="catalog-tile"], [class*="card"]');
    tiles.forEach(tile => {
      if (tile.textContent.includes('Canopy Ui') && tile.textContent.includes('Frontend')) {
        tile.style.border = '3px solid red';
        tile.style.borderRadius = '8px';
      }
    });
  });
  await page.screenshot({ path: path.join(imagesDir, 'canopy-helm.png') });
  console.log('  ✓ canopy-helm.png');

  // Click on Canopy Ui
  await page.click('button:has-text("Canopy Ui")');
  await page.waitForTimeout(1000);
  await page.click('button:has-text("Create")');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // Expand form
  await page.click('button:has-text("Canopy UI Helm Chart Values Schema")');
  await page.waitForTimeout(500);

  // Fill LLM_ENDPOINT
  await page.fill('input[id*="LLM_ENDPOINT"]', `https://llama32-ai501.${CLUSTER_DOMAIN}`);

  // Screenshot: helm-values.png
  await page.evaluate(() => {
    const inputs = document.querySelectorAll('input[type="text"]');
    inputs.forEach(input => {
      const label = input.closest('div')?.querySelector('span');
      if (label && (label.textContent.includes('SYSTEM_PROMPT') ||
          label.textContent.includes('MODEL_NAME') ||
          label.textContent.includes('LLM_ENDPOINT'))) {
        input.style.border = '3px solid red';
        input.style.borderRadius = '4px';
      }
    });
    const createBtn = [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Create');
    if (createBtn) {
      createBtn.style.outline = '3px solid red';
      createBtn.style.outlineOffset = '2px';
    }
  });
  await page.screenshot({ path: path.join(imagesDir, 'helm-values.png') });
  console.log('  ✓ helm-values.png');

  // Click Create
  await page.click('button[data-test-id="submit-button"]');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(5000);

  // Screenshot: canopy-ui-ocp.png (Topology view)
  await page.screenshot({ path: path.join(imagesDir, 'canopy-ui-ocp.png') });
  console.log('  ✓ canopy-ui-ocp.png');

  // Open Canopy UI
  const [newPage] = await Promise.all([
    page.waitForEvent('popup'),
    page.click('button:has-text("Open URL")')
  ]);

  await newPage.waitForLoadState('networkidle');
  await newPage.waitForTimeout(3000);

  // Fill in sample text
  const sampleText = `In biology, the canopy is the aboveground portion of a plant cropping or crop, formed by the collection of individual plant crowns. In forest ecology, canopy also refers to the upper layer or habitat zone, formed by mature tree crowns and including other biological organisms such as epiphytes, lianas, arboreal animals, and so on. Sometimes the term canopy is used to refer to the extent of the outer layer of leaves of an individual tree or group of trees. Shade trees normally have a dense canopy that blocks light from lower growing plants.

The canopy layer is the primary layer of the forest, forming a roof over the two remaining layers. The canopy contains the majority of the largest trees, typically 30 to 45 meters in height. The densest areas of biodiversity are found in the forest canopy, a more or less continuous cover of foliage formed by adjacent treetops. The canopy, by some estimates, is home to 50 percent of all plant species. Epiphytic plants attach to trunks and branches, and obtain water and minerals from rain and debris that collects on the supporting plants.

The fauna is similar to that found in the emergent layer, but more diverse. It is believed that the total arthropod species richness of the tropical canopy might be as high as 20 million. Other organisms inhabiting this layer include many species of bats, which use the canopy layer for both roosting and hunting. Snakes also frequent the canopy layer, hunting bats and birds. Many large predatory birds, such as eagles and hawks, also hunt in the canopy layer.`;

  await newPage.fill('textarea', sampleText);
  await newPage.click('button:has-text("Summarize")');
  await newPage.waitForTimeout(15000); // Wait for LLM response

  // Zoom out for full view
  await newPage.evaluate(() => { document.body.style.zoom = '0.8'; });

  // Screenshot: summarize-with-canopy.png
  await newPage.screenshot({ path: path.join(imagesDir, 'summarize-with-canopy.png') });
  console.log('  ✓ summarize-with-canopy.png');

  await newPage.close();
}

// Main execution
async function main() {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║           Lab Instructions Screenshot Renewal              ║
╠════════════════════════════════════════════════════════════╣
║  Cluster: ${CLUSTER_DOMAIN.padEnd(46)}║
║  User:    ${USERNAME.padEnd(46)}║
║  Chapter: ${(SPECIFIC_CHAPTER || 'all').padEnd(46)}║
╚════════════════════════════════════════════════════════════╝
`);

  const browser = await chromium.launch({
    headless: false,  // Set to true for CI/CD
    slowMo: 100
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    ignoreHTTPSErrors: true
  });

  const page = await context.newPage();

  try {
    // Login first
    console.log('🔐 Logging in to OpenShift...');
    await loginToOpenShift(page);

    // Define chapter handlers
    const chapters = {
      '2-linguistics': chapter2Linguistics,
      // Add more chapters here as needed:
      // '3-ready-to-scale-101': chapter3ReadyToScale101,
      // '4-ready-to-scale-201': chapter4ReadyToScale201,
      // etc.
    };

    if (SPECIFIC_CHAPTER) {
      // Run specific chapter
      if (chapters[SPECIFIC_CHAPTER]) {
        await chapters[SPECIFIC_CHAPTER](page);
      } else {
        console.error(`Unknown chapter: ${SPECIFIC_CHAPTER}`);
        console.log('Available chapters:', Object.keys(chapters).join(', '));
      }
    } else {
      // Run all chapters
      for (const [chapterName, handler] of Object.entries(chapters)) {
        await handler(page);
      }
    }

    console.log('\n✅ Screenshot renewal complete!');

  } catch (error) {
    console.error('Error:', error.message);
    await page.screenshot({ path: 'error-screenshot.png' });
    throw error;
  } finally {
    await browser.close();
  }
}

main().catch(console.error);
