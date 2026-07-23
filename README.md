# Skyline — Weather App

A vanilla JavaScript weather app that lets you search any city and see current conditions, built as part of Week 14 (API calls, fetch, useEffect, loading and error states).

## API Used

[Weatherstack](https://weatherstack.com/) — the `current` endpoint, which returns live weather data for a given city.

## Features

- Search any city by name
- Displays temperature, "feels like," humidity, wind speed/direction, UV index, and local time
- Loading state while the request is in flight
- Graceful error handling for invalid city names or failed requests
- Search button disables itself during a request to prevent duplicate submissions

## One Challenge I Hit

Weatherstack's free plan only supports `http://` requests, not `https://`. This works fine locally, but caused problems once deployed to Netlify, since browsers block insecure HTTP requests from a secure page (a "mixed content" error). I solved this by routing the request through a free proxy (allorigins.win) that fetches the HTTP data server-side and returns it over HTTPS.

## Tech Stack

- HTML
- CSS
- Vanilla JavaScript (fetch, async/await)

## Running Locally

Open `index.html` directly in your browser, or use a tool like VS Code's Live Server extension.

## Live Demo

[https://weather-trying.netlify.app/](weather-trying)