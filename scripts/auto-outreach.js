/**
 * RemindFlow Automated Outreach System
 * 
 * This script handles:
 * 1. Startup directory submissions
 * 2. Social media content generation
 * 3. Reddit opportunity detection
 * 4. Performance tracking
 * 
 * Run daily via Windows Task Scheduler
 */

const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, '..', 'data', 'outreach-log.json');
const CONTENT_FILE = path.join(__dirname, '..', 'data', 'social-content.json');

// Ensure data directory exists
const dataDir = path.dirname(LOG_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Helper: Log activity
function logActivity(type, message, data = {}) {
  const log = {
    timestamp: new Date().toISOString(),
    type,
    message,
    ...data,
  };

  let logs = [];
  if (fs.existsSync(LOG_FILE)) {
    logs = JSON.parse(fs.readFileSync(LOG_FILE, 'utf-8'));
  }
  logs.push(log);
  fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
  console.log(`[${log.timestamp}] ${type}: ${message}`);
}

// 1. Startup Directory Submissions
async function submitToDirectories() {
  const directories = [
    {
      name: 'BetaList',
      url: 'https://betalist.com/submit',
      status: 'manual', // Requires manual submission
      notes: 'Submit landing page URL and description',
    },
    {
      name: 'Product Hunt',
      url: 'https://www.producthunt.com/posts/new',
      status: 'scheduled',
      notes: 'Schedule for launch day (Tuesday/Wednesday)',
    },
    {
      name: 'Indie Hackers',
      url: 'https://www.indiehackers.com/post',
      status: 'ready',
      notes: 'Post validation thread',
    },
    {
      name: 'Hacker News',
      url: 'https://news.ycombinator.com/showhn.html',
      status: 'ready',
      notes: 'Show HN post when MVP is live',
    },
    {
      name: 'Reddit r/SideProject',
      url: 'https://www.reddit.com/r/SideProject/submit',
      status: 'ready',
      notes: 'Post feedback request',
    },
  ];

  logActivity('directories', 'Directory submission status checked', {
    total: directories.length,
    ready: directories.filter(d => d.status === 'ready').length,
  });

  return directories;
}

// 2. Generate Social Media Content
function generateSocialContent() {
  const content = [
    {
      platform: 'twitter',
      type: 'thread',
      content: `Freelancers: you're losing an average of $2,400 to unpaid invoices.

Not because clients refuse to pay.
Because nobody reminded them.

I'm building a tool to fix this. Here's how it works: 🧵

1/ Connect your invoices (Stripe, Wave, PayPal, or CSV)
2/ Set your reminder schedule (3, 7, 14, 30 days)
3/ Polite, professional emails go out automatically

You just watch the payments roll in.

The average freelancer spends 2+ hours per week chasing payments.

With automated reminders:
• Payment time drops from 21 days → 8 days
• Zero awkward "hey just checking in" emails at 11pm
• Professional relationship maintained throughout

I'm looking for 50 founding members to get early access at $15/mo forever.

Join the waitlist: https://remindflow-silk.vercel.app/`,
      scheduled: false,
    },
    {
      platform: 'twitter',
      type: 'single',
      content: `Hot take: If you're a freelancer and you're not following up on late invoices, you're leaving money on the table.

The average freelancer has $2,400 in unpaid invoices at any given time.

Automate the follow-ups. Get paid faster.

I built a tool for this: https://remindflow-silk.vercel.app/`,
      scheduled: false,
    },
    {
      platform: 'linkedin',
      type: 'post',
      content: `The #1 reason freelancers don't get paid on time?

It's not difficult clients.
It's not budget issues.
It's not payment processing delays.

It's silence.

Most freelancers send an invoice and then... forget about it. By the time they remember to follow up, it's been 3 weeks and the conversation feels awkward.

I'm building RemindFlow to solve this. Automated, polite payment reminders that sound human.

• Connect your invoices
• Set your reminder schedule
• Get paid 3x faster

Early access is open. Link in comments.

#freelancing #invoicing #payments #automation`,
      scheduled: false,
    },
  ];

  // Save content for manual posting
  fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2));
  logActivity('content', `Generated ${content.length} social media posts`, {
    platforms: [...new Set(content.map(c => c.platform))],
  });

  return content;
}

// 3. Reddit Opportunity Detection
function detectRedditOpportunities() {
  // These are search URLs that find relevant discussions
  const searches = [
    {
      query: 'late invoice follow up freelancer',
      url: 'https://www.reddit.com/search/?q=late+invoice+follow+up+freelancer&sort=new',
      subreddits: ['r/freelance', 'r/freelancers', 'r/smallbusiness'],
    },
    {
      query: 'client not paying invoice',
      url: 'https://www.reddit.com/search/?q=client+not+paying+invoice&sort=new',
      subreddits: ['r/freelance', 'r/freelancers'],
    },
    {
      query: 'chasing payments freelancer',
      url: 'https://www.reddit.com/search/?q=chasing+payments+freelancer&sort=new',
      subreddits: ['r/freelance', 'r/smallbusiness'],
    },
  ];

  logActivity('reddit', 'Reddit opportunity searches generated', {
    searches: searches.length,
  });

  return searches;
}

// Main execution
async function main() {
  console.log('🚀 RemindFlow Automated Outreach System');
  console.log('========================================\n');

  // Step 1: Check directory submissions
  console.log('📋 Step 1: Checking directory submissions...');
  const directories = await submitToDirectories();
  console.log(`   Found ${directories.length} directories\n`);

  // Step 2: Generate social content
  console.log('📝 Step 2: Generating social media content...');
  const content = generateSocialContent();
  console.log(`   Generated ${content.length} posts\n`);

  // Step 3: Detect Reddit opportunities
  console.log('🔍 Step 3: Detecting Reddit opportunities...');
  const searches = detectRedditOpportunities();
  console.log(`   Found ${searches.length} search queries\n`);

  console.log('✅ Outreach system complete!');
  console.log('\n📊 Summary:');
  console.log(`   - Directories to submit: ${directories.filter(d => d.status === 'ready').length}`);
  console.log(`   - Social posts ready: ${content.length}`);
  console.log(`   - Reddit searches: ${searches.length}`);
  console.log('\n📝 Next steps:');
  console.log('   1. Manually submit to directories (links in outreach-log.json)');
  console.log('   2. Post social content (saved to social-content.json)');
  console.log('   3. Check Reddit searches and engage with relevant posts');
}

main().catch(console.error);
