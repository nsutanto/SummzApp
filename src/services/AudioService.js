// RUN: npm install react-native-track-player && cd ios && pod install

import TrackPlayer, {
  Event,
  State,
  Capability,
} from 'react-native-track-player';

// -----------------------------------------------------------------
// (A) PlaybackService — runs in a headless background task.
// Registered in index.js. Handles remote control events only.
// Must be a NAMED export — index.js imports it by name.
// -----------------------------------------------------------------
export async function PlaybackService() {
  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
  TrackPlayer.addEventListener(Event.RemoteNext, () => TrackPlayer.skipToNext());
  TrackPlayer.addEventListener(Event.RemotePrevious, () => TrackPlayer.skipToPrevious());
  TrackPlayer.addEventListener(Event.RemoteStop, () => TrackPlayer.destroy());
  TrackPlayer.addEventListener(Event.RemoteSeek, (e) => TrackPlayer.seekTo(e.position));
}

// -----------------------------------------------------------------
// (B) AudioService — called from AudioPlayerScreen.
// -----------------------------------------------------------------
let isSetup = false;

export const AudioService = {

  // Safe to call multiple times — isSetup guard prevents re-init.
  async setup() {
    if (isSetup) return;
    await TrackPlayer.setupPlayer({
      maxCacheSize: 1024 * 5,
    });
    await TrackPlayer.updateOptions({
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo,
        Capability.Stop,
      ],
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
      ],
      notificationCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
      ],
    });
    isSetup = true;
  },

  // Load all chapters as a queue and start from a given index.
  // chapters: Summary[] — each has { id, title, audio_url, duration_seconds }
  // book: Book — used for notification artwork
  async loadChapters(chapters, book, startIndex = 0) {
    await TrackPlayer.reset();
    const tracks = chapters.map((ch) => ({
      id: ch.id,
      url: ch.audio_url,
      title: ch.title,
      artist: book.author,
      artwork: book.cover_image_url || undefined,
      album: book.title,
      duration: ch.duration_seconds || undefined,
    }));
    await TrackPlayer.add(tracks);
    if (startIndex > 0) {
      await TrackPlayer.skip(startIndex);
    }
    await TrackPlayer.play();
  },

  async play() { await TrackPlayer.play(); },
  async pause() { await TrackPlayer.pause(); },
  async seekTo(seconds) { await TrackPlayer.seekTo(seconds); },
  async skipToNext() { await TrackPlayer.skipToNext(); },
  async skipToPrevious() { await TrackPlayer.skipToPrevious(); },
  async skipToIndex(index) { await TrackPlayer.skip(index); },

  // Seek forward or backward by N seconds within the current track.
  async seekRelative(seconds) {
    const position = await TrackPlayer.getPosition();
    const duration = await TrackPlayer.getDuration();
    const newPos = Math.max(0, Math.min(duration, position + seconds));
    await TrackPlayer.seekTo(newPos);
  },

  async destroy() {
    isSetup = false;
    await TrackPlayer.destroy();
  },
};
