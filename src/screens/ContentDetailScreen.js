import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, ImageBackground, ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../context/AuthContext';
import { ApiService } from '../services/ApiService';
import { LoadingIndicator, ErrorState } from '../components';
import { spacing, shadows } from '../styles';

const formatDuration = (seconds) => {
  if (!seconds) return '';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const ChapterRow = ({ chapter, index, isLast, isCurrentChapter, theme }) => (
  <TouchableOpacity
    style={[
      styles.chapterRow,
      !isLast && { borderBottomWidth: 1, borderBottomColor: theme.border.light },
    ]}
    onPress={() => console.log('Chapter pressed:', chapter.id)}
    activeOpacity={0.7}
  >
    {/* Left: chapter number */}
    <Text style={[styles.chapterNumber, { color: theme.text.secondary }]}>
      {String(index + 1).padStart(2, '0')}
    </Text>

    {/* Middle: title + duration */}
    <View style={styles.chapterMiddle}>
      <Text style={[styles.chapterTitle, { color: theme.text.primary }]} numberOfLines={2}>
        {chapter.title}
      </Text>
      {!!chapter.duration_seconds && (
        <Text style={[styles.chapterDuration, { color: theme.text.secondary }]}>
          {formatDuration(chapter.duration_seconds)}
        </Text>
      )}
    </View>

    {/* Right: play icon or current-chapter dot */}
    {isCurrentChapter ? (
      <View style={[styles.currentDot, { backgroundColor: '#F5B800' }]} />
    ) : (
      <Icon name="play-circle-outline" size={24} color={theme.primary} />
    )}
  </TouchableOpacity>
);

const ContentDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { user } = useAuth();

  const { content } = route.params || {};

  const [chapters, setChapters] = useState([]);
  const [progress, setProgress] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    if (!content?.id) return;

    const loadData = async () => {
      try {
        setLoading(true);
        const [chapterData, progressData, libraryData] = await Promise.all([
          ApiService.getBookSummaries(content.id),
          ApiService.getProgress(content.id).catch(() => null),
          ApiService.getLibrary().catch(() => []),
        ]);
        setChapters(chapterData || []);
        setProgress(progressData);
        const alreadySaved = (libraryData || []).some(b => b.id === content.id);
        setIsSaved(alreadySaved);
      } catch (err) {
        setError(err.message || 'Failed to load book details');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [content?.id]);

  const handleToggleSave = async () => {
    if (saveLoading) return;
    try {
      setSaveLoading(true);
      if (isSaved) {
        await ApiService.removeFromLibrary(content.id);
        setIsSaved(false);
      } else {
        await ApiService.addToLibrary(content.id);
        setIsSaved(true);
      }
    } catch (err) {
      if (err.message?.includes('409') || err.message?.toLowerCase().includes('already')) {
        setIsSaved(true);
      } else {
        console.warn('Save toggle failed:', err.message);
      }
    } finally {
      setSaveLoading(false);
    }
  };

  if (!content) {
    return (
      <View style={[styles.centered, { flex: 1, backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text.secondary }}>No content available</Text>
      </View>
    );
  }

  if (loading) return <LoadingIndicator />;
  if (error) return <ErrorState message={error} />;

  const categoryLabel = content.categories?.map(c => c.name).join(' · ') || '';
  const audioMinutes = content.audio_duration_seconds
    ? Math.round(content.audio_duration_seconds / 60)
    : null;

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>

        {/* A: Hero Header */}
        <View style={styles.hero}>
          <ImageBackground
            source={{ uri: content.cover_image_url }}
            style={styles.heroBg}
            resizeMode="cover"
          >
            {/* Dark overlay */}
            <View style={styles.heroOverlay} />

            {/* Back button */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
            >
              <Icon name="chevron-left" size={28} color="#fff" />
            </TouchableOpacity>

            {/* Cover thumbnail — positioned absolutely at bottom-left */}
            <View style={styles.coverThumbnailContainer}>
              {content.cover_image_url ? (
                <Image
                  source={{ uri: content.cover_image_url }}
                  style={styles.coverThumbnail}
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.coverThumbnail, styles.coverPlaceholder]}>
                  <Text style={styles.coverPlaceholderText} numberOfLines={3}>
                    {content.title}
                  </Text>
                </View>
              )}
            </View>
          </ImageBackground>
        </View>

        {/* B: Book Info Block */}
        <View style={styles.infoBlock}>
          {!!categoryLabel && (
            <Text style={[styles.categoryLabel, { color: theme.text.secondary }]}>
              {categoryLabel}
            </Text>
          )}
          <Text style={[styles.bookTitle, { color: theme.text.primary }]}>
            {content.title}
          </Text>
          {!!content.author && (
            <Text style={[styles.bookAuthor, { color: theme.text.secondary }]}>
              {content.author}
            </Text>
          )}
        </View>

        {/* C: Stats Row */}
        <View style={[styles.statsRow, { borderTopColor: theme.border.light, borderBottomColor: theme.border.light }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.text.primary }]}>
              {content.total_chapters ?? chapters.length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.text.secondary }]}>Chapters</Text>
          </View>

          <View style={[styles.statDivider, { backgroundColor: theme.border.default }]} />

          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.text.primary }]}>
              {content.read_time_minutes ?? '—'}
            </Text>
            <Text style={[styles.statLabel, { color: theme.text.secondary }]}>Min read</Text>
          </View>

          {audioMinutes !== null && (
            <>
              <View style={[styles.statDivider, { backgroundColor: theme.border.default }]} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.text.primary }]}>
                  {audioMinutes}
                </Text>
                <Text style={[styles.statLabel, { color: theme.text.secondary }]}>Min audio</Text>
              </View>
            </>
          )}
        </View>

        {/* D: Action Buttons Row */}
        <View style={styles.actionRow}>
          {/* Read Now */}
          <TouchableOpacity
            style={[styles.btnPrimary, { backgroundColor: theme.primary }]}
            onPress={() => console.log('Read pressed')}
            activeOpacity={0.8}
          >
            <Icon name="menu-book" size={18} color="#fff" style={styles.btnIcon} />
            <Text style={styles.btnPrimaryText}>Read Now</Text>
          </TouchableOpacity>

          {/* Listen */}
          <TouchableOpacity
            style={[styles.btnSecondary, { backgroundColor: theme.surface, borderColor: theme.border.default }]}
            onPress={() => console.log('Listen pressed')}
            activeOpacity={0.8}
          >
            <Icon name="headphones" size={18} color={theme.text.primary} style={styles.btnIcon} />
            <Text style={[styles.btnSecondaryText, { color: theme.text.primary }]}>Listen</Text>
          </TouchableOpacity>

          {/* Save/Unsave */}
          <TouchableOpacity
            style={[styles.btnIcon44, { backgroundColor: theme.surface, borderColor: theme.border.default }]}
            onPress={handleToggleSave}
            activeOpacity={0.8}
            disabled={saveLoading}
          >
            {saveLoading ? (
              <ActivityIndicator size="small" color={theme.primary} />
            ) : (
              <Icon
                name={isSaved ? 'bookmark' : 'bookmark-border'}
                size={22}
                color={isSaved ? theme.primary : theme.text.secondary}
              />
            )}
          </TouchableOpacity>
        </View>

        {/* E: Description */}
        {!!content.description && (
          <View style={styles.descBlock}>
            <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
              What you'll learn
            </Text>
            <Text style={[styles.descText, { color: theme.text.secondary }]}>
              {content.description}
            </Text>
          </View>
        )}

        {/* F: Chapters List */}
        {chapters.length > 0 && (
          <View style={styles.chaptersBlock}>
            <View style={styles.chaptersHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
                Chapters
              </Text>
              <Text style={[styles.chaptersCount, { color: theme.text.secondary }]}>
                {chapters.length}
              </Text>
            </View>

            {chapters.map((chapter, index) => (
              <ChapterRow
                key={chapter.id ?? index}
                chapter={chapter}
                index={index}
                isLast={index === chapters.length - 1}
                isCurrentChapter={progress?.last_summary_id === chapter.id}
                theme={theme}
              />
            ))}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Hero
  hero: {
    height: 260,
  },
  heroBg: {
    flex: 1,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  backButton: {
    position: 'absolute',
    top: 52,
    left: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverThumbnailContainer: {
    position: 'absolute',
    bottom: -20,
    left: 20,
    ...shadows.medium,
  },
  coverThumbnail: {
    width: 88,
    height: 120,
    borderRadius: 8,
  },
  coverPlaceholder: {
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
  },
  coverPlaceholderText: {
    color: '#fff',
    fontSize: 10,
    textAlign: 'center',
  },

  // Book Info
  infoBlock: {
    paddingTop: 32,
    paddingLeft: 124,
    paddingRight: 20,
    paddingBottom: 16,
  },
  categoryLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  bookTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  bookAuthor: {
    fontSize: 14,
    marginTop: 4,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
  },

  // Action buttons
  actionRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 10,
    alignItems: 'center',
  },
  btnPrimary: {
    flex: 1,
    flexDirection: 'row',
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnPrimaryText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  btnSecondary: {
    flex: 1,
    flexDirection: 'row',
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnSecondaryText: {
    fontWeight: '600',
    fontSize: 14,
  },
  btnIcon: {
    marginRight: 6,
  },
  btnIcon44: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Description
  descBlock: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  descText: {
    fontSize: 14,
    lineHeight: 22,
  },

  // Chapters
  chaptersBlock: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  chaptersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chaptersCount: {
    fontSize: 14,
  },
  chapterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  chapterNumber: {
    width: 28,
    fontSize: 12,
    fontFamily: 'monospace',
  },
  chapterMiddle: {
    flex: 1,
    marginHorizontal: 12,
  },
  chapterTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  chapterDuration: {
    fontSize: 12,
    marginTop: 2,
  },
  currentDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

export default ContentDetailScreen;
