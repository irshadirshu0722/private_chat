# Private Chat Application

A hidden chat application disguised as a Google search interface for private communication.

## Features

### Page 1: Google Search Interface
- Exact replica of Google's search page
- Redirects to real Google search for most queries
- Special trigger: searching for "xylem +2 note" reveals the hidden chat

### Page 2: Fake Google Results
- Mimics Google search results for "xylem +2 note"
- Clicking on pagination or page numbers leads to the chat
- Looks completely legitimate

### Page 3: Private Chat Interface
- WhatsApp-like chat interface
- Real-time messaging using Firebase
- Voice message recording and playback
- Emoji picker
- Message likes
- User authentication via URL parameters
- Shows only last week's messages

## How to Use

1. **Start the application:**
   ```bash
   npm run dev
   ```

2. **Access the chat:**
   - Go to the homepage (looks like Google)
   - Search for "xylem +2 note"
   - Click on any pagination button or page number
   - You'll be redirected to the chat

3. **Chat access:**
   - Add `?user=username` to the chat URL to set your identity
   - Example: `/chat?user=irshad` or `/chat?user=sarah`

## Technical Details

- Built with Next.js 15 and React 19
- Firebase Realtime Database for messaging
- Tailwind CSS for styling
- Responsive design
- Voice recording using MediaRecorder API
- Real-time updates with Firebase listeners

## Security Features

- Messages are automatically deleted after one week
- No media upload functionality
- Simple user identification via URL parameters
- Disguised as legitimate educational content

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure Firebase:
   - Update `firebase.js` with your Firebase project credentials
   - Enable Realtime Database in Firebase console

3. Run the development server:
   ```bash
   npm run dev
   ```

## Usage Tips

- Bookmark the chat URL with your username parameter
- Use incognito/private browsing for extra privacy
- The application looks completely legitimate to casual observers
- Perfect for situations where privacy is crucial

## Note

This application is designed for legitimate private communication needs. Please use responsibly and in accordance with applicable laws and regulations.
