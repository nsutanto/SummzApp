// RUN: npm install @react-native-community/slider && cd ios && pod install
import React, { useState, useEffect, useRef } from 'react';
import Slider from '@react-native-community/slider';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native';
import TrackPlayer, {
  usePlaybackState,
  useProgress,
  useActiveTrack,
  State,
  Event,
} from 'react-native-track-player';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../hooks/useTheme';
import { AudioService } from '../services/AudioService';
import { ApiService } from '../services/ApiService';
import { spacing } from '../styles';

const SCREEN_WIDTH = Dimensions.get('window').width;
const COVER_SIZE = SCREEN_WIDTH - 72;

const AudioPlayerScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { theme } = useTheme();

  const { book, chapters, initialChapterIndex = 0 } = route.params;

  const playbackState = usePlaybackState();
  const progress = useProgress(500);
  const activeTrack = useActiveTrack();

  const [isReady, setIsReady] = useState(false);
  const [activeIndex, setActiveIndex] = useState(initialChapterIndex);
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekValue, setSeekValue] = useState(0);

  const isPlaying = playbackState.state === State.Playing;
  const isBuffering =
    playbackState.state === State.Buffering ||
    playbackState.state === State.Loading;

  const currentChapter = chapters[activeIndex] || chapters[0];
  const chapterLabel =
    'CHAPTER ' +
    String(activeIndex + 1).padStart(2, '0') +
    ' OF ' +
    String(chapters.length).padStart(2, '0');

  // --- SETUP EFFECT ---
  useEffect(() => {
    const setup = async () => {
      try {
        await AudioService.setup();
        await AudioService.loadChapters(chapters, book, initialChapterIndex);
        setIsReady(true);
      } catch (err) {
        console.warn('AudioService setup error:', err.message);
      }
    };
    setup();

    return () => {
      TrackPlayer.pause().catch(() => {});
    };
  }, []);

  // --- TRACK CHANGE EFFECT ---
  useEffect(() => {
    const sub = TrackPlayer.addEventListener(
      Event.PlaybackActiveTrackChanged,
      (e) => {
        if (e.index !== undefined && e.index !== null) {
          setActiveIndex(e.index);
        }
      }
    );
    return () => sub.remove();
  }, []);

  const fmt = (secs) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return m + ':' + s.toString().padStart(2, '0');
  };

  // --- LOADING STATE ---
  if (!isReady) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.background,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={{ color: theme.text.secondary, marginTop: 12, fontSize: 13 }}>
          Loading audio…
        </Text>
      </View>
    );
  }

  // --- MAIN RETURN ---
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* (A) HEADER — sticky, not inside ScrollView */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <Icon name="keyboard-arrow-down" size={28} color={theme.text.secondary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text.secondary }]}>
          Now Playing
        </Text>
        <TouchableOpacity style={styles.headerBtn} onPress={() => {}}>
          <Icon name="more-horiz" size={24} color={theme.text.secondary} />
        </TouchableOpacity>
      </View>

      {/* (B–F) SCROLLABLE CONTENT */}
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* (B) COVER ART */}
        <View style={styles.coverWrap}>
          {book.cover_image_url ? (
            <Image
              source={{ uri: book.cover_image_url }}
              style={[styles.cover, { width: COVER_SIZE, height: COVER_SIZE }]}
              resizeMode="cover"
            />
          ) : (
            <View
              style={[
                styles.coverPlaceholder,
                { width: COVER_SIZE, height: COVER_SIZE, backgroundColor: theme.surface },
              ]}
            >
              <Text style={[styles.coverPlaceholderText, { color: theme.text.primary }]}>
                {book.title}
              </Text>
            </View>
          )}
        </View>

        {/* (C) CHAPTER INFO */}
        <View style={styles.infoWrap}>
          <Text
            style={[
              styles.chapterLabel,
              {
                color: theme.primary,
                fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
              },
            ]}
          >
            {chapterLabel}
          </Text>
          <Text style={[styles.chapterTitle, { color: theme.text.primary }]}>
            {currentChapter?.title || ''}
          </Text>
          <Text style={[styles.authorText, { color: theme.text.secondary }]}>
            {book.author}
          </Text>
        </View>

        {/* (D) SEEK BAR */}
        <View style={styles.seekBarWrap}>
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={progress.duration > 0 ? progress.duration : 1}
            value={isSeeking ? seekValue : progress.position}
            minimumTrackTintColor={theme.primary}
            maximumTrackTintColor={theme.border?.default || '#333333'}
            thumbTintColor={theme.primary}
            onSlidingStart={(val) => {
              setIsSeeking(true);
              setSeekValue(val);
            }}
            onValueChange={(val) => setSeekValue(val)}
            onSlidingComplete={async (val) => {
              setIsSeeking(false);
              await AudioService.seekTo(val);
            }}
          />
          <View style={styles.timeRow}>
            <Text
              style={[
                styles.timeText,
                {
                  color: theme.text.secondary,
                  fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
                },
              ]}
            >
              {fmt(isSeeking ? seekValue : progress.position)}
            </Text>
            <Text
              style={[
                styles.timeText,
                {
                  color: theme.text.secondary,
                  fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
                },
              ]}
            >
              {fmt(progress.duration)}
            </Text>
          </View>
        </View>

        {/* (E) PLAYBACK CONTROLS */}
        <View style={styles.controlsRow}>
          <TouchableOpacity onPress={() => AudioService.seekRelative(-15)}>
            <Icon name="replay" size={28} color={theme.text.secondary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => AudioService.skipToPrevious()}>
            <Icon name="skip-previous" size={32} color={theme.text.secondary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => (isPlaying ? AudioService.pause() : AudioService.play())}
            style={[styles.playBtn, { backgroundColor: theme.primary }]}
          >
            {isBuffering ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : isPlaying ? (
              <Icon name="pause" size={32} color="#ffffff" />
            ) : (
              <Icon name="play-arrow" size={32} color="#ffffff" />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => AudioService.skipToNext()}>
            <Icon name="skip-next" size={32} color={theme.text.secondary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => AudioService.seekRelative(15)}>
            <Icon name="forward" size={28} color={theme.text.secondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.extrasRow}>
          <TouchableOpacity style={styles.extraBtn} onPress={() => {}}>
            <Icon name="speed" size={22} color={theme.text.secondary} />
            <Text style={[styles.extraLabel, { color: theme.text.secondary }]}>1.0x</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.extraBtn} onPress={() => {}}>
            <Icon name="bookmark-border" size={22} color={theme.text.secondary} />
            <Text style={[styles.extraLabel, { color: theme.text.secondary }]}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.extraBtn} onPress={() => {}}>
            <Icon name="share" size={22} color={theme.text.secondary} />
            <Text style={[styles.extraLabel, { color: theme.text.secondary }]}>Share</Text>
          </TouchableOpacity>
        </View>

        {/* (F) Chapters list — added in 4d */}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const coverShadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 12 },
  shadowOpacity: 0.5,
  shadowRadius: 20,
  elevation: 12,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 52,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: '500',
  },
  coverWrap: {
    paddingHorizontal: 36,
    paddingTop: 8,
    paddingBottom: 20,
    alignItems: 'center',
  },
  cover: {
    borderRadius: 16,
    ...coverShadow,
  },
  coverPlaceholder: {
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    ...coverShadow,
  },
  coverPlaceholderText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  infoWrap: {
    paddingHorizontal: 24,
    paddingTop: 4,
    paddingBottom: 8,
  },
  chapterLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 6,
  },
  chapterTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 26,
    marginBottom: 4,
  },
  authorText: {
    fontSize: 13,
  },
  bottomSpacer: {
    height: 40,
  },
  seekBarWrap: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -8,
  },
  timeText: {
    fontSize: 11,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginTop: 16,
  },
  playBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  extrasRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    marginTop: 24,
    paddingHorizontal: 24,
  },
  extraBtn: {
    alignItems: 'center',
    gap: 4,
  },
  extraLabel: {
    fontSize: 10,
  },
});

export default AudioPlayerScreen;
