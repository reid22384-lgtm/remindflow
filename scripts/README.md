# RemindFlow - Automated Outreach System

This system runs daily to promote RemindFlow through legitimate channels.

## What it does:
1. Submits to startup directories (BetaList, Product Hunt, etc.)
2. Generates daily social media content
3. Finds relevant Reddit discussions to engage with
4. Tracks outreach performance

## Setup:
1. Install dependencies: `npm install node-fetch`
2. Run: `node scripts/auto-outreach.js`

## Schedule:
- Runs daily at 9 AM EST via Windows Task Scheduler
- Logs results to `data/outreach-log.json`
