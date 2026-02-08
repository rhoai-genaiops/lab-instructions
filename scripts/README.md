# Lab Instructions Screenshot Automation

This directory contains scripts for automating screenshot renewal across different OpenShift clusters.

## Prerequisites

1. **Node.js** (v18 or later)
2. **Playwright** browser automation

## Setup

```bash
cd scripts
npm install
npx playwright install chromium
```

## Usage

### Renew All Chapters

```bash
node renew-screenshots.js <cluster-domain> <username> <password>
```

Example:
```bash
node renew-screenshots.js apps.cluster-xyz.opentlc.com user1 mypassword
```

### Renew Specific Chapter

```bash
node renew-screenshots.js <cluster-domain> <username> <password> <chapter>
```

Example:
```bash
node renew-screenshots.js apps.cluster-xyz.opentlc.com user1 mypassword 2-linguistics
```

## Available Chapters

| Chapter | Description | Status |
|---------|-------------|--------|
| `2-linguistics` | Canopy AI and Prompt Engineering | ✅ Ready |
| `3-ready-to-scale-101` | Ready to Scale 101 | 🔄 Coming Soon |
| `4-ready-to-scale-201` | Ready to Scale 201 | 🔄 Coming Soon |
| `5-grounded-ai` | Grounded AI | 🔄 Coming Soon |
| `6-observability` | Observability | 🔄 Coming Soon |
| `7-honor-code` | Honor Code | 🔄 Coming Soon |
| `8-agents` | Agents | 🔄 Coming Soon |
| `9-on-prem-practicum` | On-Prem Practicum | 🔄 Coming Soon |
| `10-model-optimization` | Model Optimization | 🔄 Coming Soon |
| `11-maas` | MaaS | 🔄 Coming Soon |

## Adding New Chapters

1. Open `renew-screenshots.js`
2. Create a new async function for your chapter:
   ```javascript
   async function chapter3ReadyToScale101(page) {
     console.log('\n📸 Chapter 3: Ready to Scale 101');
     const imagesDir = path.join(DOCS_DIR, '3-ready-to-scale-101', 'images');

     // Add your screenshot logic here
   }
   ```
3. Register the chapter in the `chapters` object in `main()`:
   ```javascript
   const chapters = {
     '2-linguistics': chapter2Linguistics,
     '3-ready-to-scale-101': chapter3ReadyToScale101,
     // ...
   };
   ```

## Using with Claude Code

You can also use the Claude Code custom command:

```
/renew-screenshots apps.cluster-xyz.opentlc.com user1 password123
```

This provides an interactive experience where Claude will:
1. Navigate to the OpenShift console
2. Take screenshots with red highlight boxes
3. Save them to the correct documentation folders

## Troubleshooting

### Browser not installed
```bash
npx playwright install chromium
```

### Screenshots are blank or incorrect
- Increase wait times in the script
- Check if the cluster is accessible
- Verify credentials are correct

### Red highlights not showing
- Some elements may need different selectors
- Check browser console for JavaScript errors
