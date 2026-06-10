# Deploying this app (no coding experience needed)

This guide gets you a live website with a shareable link. It uses
[Render](https://render.com), a hosting service with a free tier and a
"connect your GitHub repo and click deploy" workflow.

You'll need two things:
1. An **Anthropic API key** (lets the app use Claude to answer questions)
2. A **Render account** (hosts the website)

Total cost: Render's free tier is $0. The Anthropic API is pay-as-you-go -
typically a fraction of a cent to a couple of cents per question. Adding
$5-10 of credit will last a long time for personal use.

---

## Step 1: Get an Anthropic API key

1. Go to **console.anthropic.com** and sign up (or log in) - you can use Google
   or email. This is separate from a Claude.ai subscription.
2. In the left sidebar, click **Settings → Billing**, and add a payment
   method. Add a small amount of credit (e.g. $5) - this is what pays for
   the app's questions/answers.
3. In the left sidebar, click **API Keys**, then **Create Key**. Give it any
   name (e.g. "revenue-qa-app").
4. Copy the key that appears (it starts with `sk-ant-...`). **Save it
   somewhere safe** - you won't be able to see the full key again. You'll
   paste this into Render in Step 3.

---

## Step 2: Create a Render account

1. Go to **render.com** and click **Get Started**.
2. Sign up using your **GitHub account** (the same account this code lives
   in). This lets Render see your repositories.
3. When asked for permissions, you can choose to give Render access to **only
   this repository** (`Revenue-test-`) rather than all your repos.

---

## Step 3: Deploy the app

1. In the Render dashboard, click **New +** (top right) → **Blueprint**.
2. Find and select the **Revenue-test-** repository.
3. Render will detect the `render.yaml` file in this repo and show you a
   service called `irish-revenue-qa` ready to deploy.
4. It will ask you to fill in **ANTHROPIC_API_KEY** - paste the key you saved
   in Step 1.
5. Click **Apply** (or **Create Web Service**).
6. Wait for the build to finish. This will take a few minutes - it installs
   the app, scrapes some pages from revenue.ie, and builds the search index.
   You'll see logs scrolling in the dashboard.
7. Once it says **Live**, Render shows you a URL like
   `https://irish-revenue-qa.onrender.com`. Open it in a browser - that's
   your app!

---

## What to expect

- **First load may be slow.** On the free tier, the app "goes to sleep"
  after 15 minutes with no visitors and takes 30-60 seconds to wake back up
  on the next visit. This is normal.
- **The first version has limited data.** To keep the first deploy fast, it
  only scrapes a small number of pages per category (~25). Once it's working,
  you can increase this (see "Getting more data" below) and redeploy for
  broader coverage.
- **If the scrape finds nothing** (e.g. revenue.ie's structure changed since
  this was written), the app falls back to a handful of sample pages so it
  still works - but answers won't reflect real, current data. Check the build
  logs for a line like `Saved N documents for category ...` to see what was
  actually found. If you hit this, come back and let me know - I can update
  the scraper's target pages.

---

## Getting more data later

To scrape more pages, increase `SCRAPER_MAX_PAGES_PER_SOURCE` in Render's
**Environment** tab for the service (e.g. from `25` to `200`), then trigger
**Manual Deploy → Deploy latest commit**. A larger scrape takes longer to
build but gives the app much broader coverage of revenue.ie.

---

## Updating the app

Any time new code is pushed to the `claude/irish-revenue-data-app-62bk9m`
branch (or whichever branch Render is tracking), Render automatically
rebuilds and redeploys.
