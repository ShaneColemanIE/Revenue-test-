# Hurling & Gaelic Football Quiz for Kids 🏑⚽🍀

A fun, colourful quiz game that teaches kids aged 4-10 the basic rules of
**hurling** and **Gaelic football**. Pick a sport (or mix both!), choose an
age group, and answer multiple-choice questions with instant feedback and
fun facts.

## Features

- Three quiz modes: Hurling, Gaelic Football, or Mix It Up
- Two age groups: Little Champs (4-6, easier questions) and Big Champs (7-10)
- Big, colourful, kid-friendly buttons with emoji visuals
- Instant feedback with a fun fact after every answer
- Score tracking, star ratings, and confetti for a great result
- No frameworks, build step, or external assets - pure HTML/CSS/JS

## Running locally

Just open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

## Deploying to Netlify

This is a static site with no build step.

1. Push this repo to GitHub (or drag-and-drop the folder into Netlify).
2. In Netlify, create a new site from this repository.
3. Build command: leave blank.
4. Publish directory: `.` (already configured in `netlify.toml`).
5. Deploy!

## Project structure

```
index.html     - App markup and screens
style.css      - Styling and animations
script.js      - Quiz logic, scoring, sounds, confetti
questions.js   - Question bank for hurling and Gaelic football
netlify.toml   - Netlify configuration
```
