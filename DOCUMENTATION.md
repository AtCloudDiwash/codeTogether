# CodeTogether Documentation

## Overview

CodeTogether is a real-time collaborative code editor. Users join a room through the frontend, connect to the backend over WebSocket, and share code updates with everyone in the same room.

The project has two main parts:

- `frontend`: React application with the code editor interface.
- `backend`: TypeScript WebSocket server that manages rooms, shared code, and online user counts.

## Demo Media

Use the following files to show the application flow:

![Screenshot 1](./assets/screenshot1)

![Screenshot 2](./assets/screenshot2)

![Screenshot 3](./assets/screenshot3)

[Screen Recording](./assets/screenrecording)

## Backend Refactor

The backend was refactored on May 15, 2026. Refactor comments were added inside `backend/src/index.ts` using the `*refactor` marker.

The goal of the refactor was to improve readability, room management, naming, and message handling while keeping the existing WebSocket behavior compatible with the frontend.

## Backend Responsibilities

The backend handles:

- Creating and tracking code rooms.
- Storing the latest code for each room in memory.
- Tracking the number of online users in each room.
- Broadcasting code updates to users in the same room.
- Sending room state updates when users join or leave.

## Room Connection Flow

1. A user opens a room in the frontend.
2. The frontend connects to the backend using a WebSocket URL like:

   ```txt
   ws://localhost:8080/:roomId
   ```

3. The backend extracts the room ID from the request URL.
4. The user socket is added to that room.
5. The backend sends the current code and online user count to everyone in the room.
6. When a user edits code, the backend stores the new code and broadcasts it to the room.
7. When a user disconnects, the backend removes the socket and updates the online user count.

## Refactor Details

### Room Storage

Before the refactor, connected sockets were stored in an array. Broadcasting required scanning every connected socket and checking whether each one belonged to the target room.

After the refactor, sockets are grouped by room ID:

```ts
Map<string, Set<WebSocket>>
```

This makes room-based broadcasting cleaner and easier to reason about.

### Code Storage

The previous variable name `userChats` did not accurately describe the data being stored. The backend stores code, not chat messages.

It was renamed to:

```ts
roomCode
```

This improves readability and makes the purpose of the map clearer.

### Online User Tracking

The previous variable name `onlineUserNumber` was renamed to:

```ts
onlineUsersByRoom
```

The new name better communicates that the count is stored per room.

### Message Formatting

Message formatting is now handled in one helper function:

```ts
createRoomMessage(message, onlineUserNumber)
```

This keeps the WebSocket response shape consistent across joins, edits, and disconnects.

The frontend still receives the same response shape:

```json
{
  "message": "current code",
  "onlineUserNumber": 2
}
```

### Broadcasting

Broadcasting is now handled by a shared helper:

```ts
sendAll(message, roomId)
```

This helper looks up sockets for the requested room and sends updates only to open sockets.

### Room Membership Helpers

The refactor added helper functions for room membership:

```ts
addSocketToRoom(roomId, socket)
removeSocketFromRoom(roomId, socket)
```

These functions keep connection and disconnection logic separate from the main WebSocket event handler.

### Room ID Parsing

Room ID parsing now uses the `URL` API instead of manual string splitting. This makes the parsing logic more reliable and easier to understand.

### Invalid Room Behavior

Invalid room behavior was intentionally preserved by choice. If the backend does not receive a valid room ID, it logs:

```txt
Invalid room ID
```

Then it returns without closing the socket.

## Running the Backend

From the `backend` directory:

```bash
npm run dev
```

The backend starts on port `8080` by default. A custom port can be provided through the `PORT` environment variable.

## Building the Backend

From the `backend` directory:

```bash
npm run build
```

## Type Checking

The backend was checked with:

```bash
npx tsc --noEmit
```

The TypeScript check passed after the refactor.

## Notes

The backend currently stores room code in memory. This means room state resets when the server restarts. For production use, persistent storage such as a database or cache could be added later.
