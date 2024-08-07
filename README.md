<h1 align="center">
  <img src="https://raw.githubusercontent.com/TanmayArya-1p/blob/main/expose/Expose.png"/><br/>
  Expose
</h1>


(Expose currently doesnt work on Android 14 because of the new Permissions API)

### TO-DO
1. E2E Encryption
2. Android 14 Support
3. Docs

### How the App Works

Expose is a peer-to-peer photo-sharing app to synchronize your photo library seamlessly with other users within a session. Here’s how it works:

- Session Creation: Initiate a session to start sharing photos. Upon session creation, a unique connection string, which other users can utilize to join your session.
<h1 align="center">
    <img src="https://raw.githubusercontent.com/TanmayArya-1p/blob/main/expose/34b1346d-a210-4530-8498-0f99bf8b5258.jpeg" alt="drawing" width="200" align="center"/>
</h1>

- Photo Synchronization: Only photos taken after the session's initiation are included in the synchronization process. 

- Background Operation: The app operates in the background, continuously syncing newly captured photos with all participants in the session. This ensures real-time photo sharing without manual intervention.

- Join a Session: Users can easily join an existing session by entering the provided Connection String. Once joined, their newly taken photos are automatically synced with the session.

<h1 align="center">
    <img src="https://raw.githubusercontent.com/TanmayArya-1p/blob/main/expose/758952df-6ce4-457c-a2f5-effa27a5390b.jpeg" alt="drawing" width="200" align="center"/>
</h1>

### Installation & Setup

1. Download The Latest Release from [here](https://github.com/TanmayArya-1p/expose/releases)

2. Make sure you setup [FRelay](https://github.com/TanmayArya-1p/FRelay) on a machine and port-forward to the Internet using [ngrok](https://ngrok.com/) or [localtunnel](https://theboroer.github.io/localtunnel-www/)
3. On Installing the App, provide the app permissions for media access.
4. If you accidentally decline any requests for permissions, the only way to enable it is to do it manually via settings.


