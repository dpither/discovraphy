<h1 align="center"><img src="banner.png"></h1>

Discovraphy is a web application that lets you browse and discover new music by swiping through an artist's discography. It streamlines the process of listening to a series of tracks and adding the ones you like to your library or a playlist by using the swipe-based interface inspired by modern dating apps.

While listening to new releases or exploring an artist's catalog on Spotify, I frequently find new tracks that pique my interest, which I add to my "Trial" playlist for further consideration. But I found right-clicking, selecting "Add to playlist" and then searching for the correct playlist to be mildly disruptive to my listening experience. I thought to myself, this doesn't need to be so hard (and I wanted an excuse to learn some frontend development and React), so I created Discovraphy.

>[!NOTE]
> Spotify Premium is required to use Discovraphy.


## Preview
<img src="preview.gif">

## Features
- Responsive layout
- Dark/light mode
- Spotify integration
- Search for artists
- Browse artist's albums and filter by type 
- Save tracks to your library or add them to a playlist
- Swipe through tracks using mouse, keyboard, or touch gestures
- Playback controls: play, pause, next, previous, seek, adjust volume

## Getting Started
If you want to try out Discovraphy you have two options:
### Option 1: Request Access
To interact with Spotify, Discovraphy relies on the [Spotify Web API](https://developer.spotify.com/documentation/web-api) and [Web Playback SDK](https://developer.spotify.com/documentation/web-playback-sdk) and is in [development mode](https://developer.spotify.com/documentation/web-api/concepts/quota-modes) with no plans to move to extended quota mode. As of February 2026, development mode allows a maximum of 5 Spotify users to authenticate with Discovraphy.

There are currently 5 free spots. If you would like to claim one of them, send an email to dylanpitherdev@gmail.com with the name and email associated with your Spotify account.

### Option 2: Self-Host
To clone and run Discovraphy you will need [Git](https://git-scm.com/), [Node.js](https://nodejs.org/en/download) v24+ and a Spotify account with Spotify Premium.

#### 1. Clone the repository
``` bash
git clone https://github.com/dpither/discovraphy.git
```
#### 2. Navigate to the repository
``` bash
cd discovraphy
```
#### 3. Install dependencies
``` bash
npm install
```
#### 4. Create a Spotify app
Go to the [Spotify developer dashboard](https://developer.spotify.com/dashboard) and click "Create app"
>[!NOTE]
>As of February 2026, a Spotify account is limited to one app.
    
Under "Redirect URIs" enter:
``` bash
http://127.0.0.1:3000/discovraphy/callback
```
Under "Which API/SDKs are you planning to use?", check Web API and Web Playback SDK.

Fill in the rest of the form with whatever you like and click "Save".

The Client ID needed for the next step can be found under Basic Information.
#### 5. Setup environment variables
``` bash
cp .env.example .env
```
Edit the created `.env` file use your app's Client ID.
#### 6. Build the project
``` bash
npm run build
```
#### 7. Run the application
```
npm run preview
```
You now have a local instance of discovraphy running at http://127.0.0.1:3000/discovraphy/.

## Tech Stack
- Language: TypeScript
- Framework: React
- Styling: Tailwind CSS
- Routing: React Router
- State Management: Zustand
- Animations: Motion
- Build Tool: Vite

## Roadmap
Due to increasing restrictions and reducing capabilities of the Spotify API for development mode, further development on this project will be unlikely outside of some quality of life updates such as:
- Pagination of form results (especially artists search since the limit is being reduced from 50 to 10)
- Option to create a new playlist when selecting a destination
- Graceful handling and recovery from rate limits (under normal conditions, I have not found this to be an issue yet)