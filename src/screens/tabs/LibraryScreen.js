import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { EmptyStateCard, LoadingIndicator, ErrorState } from '../../components';
import { useTheme } from '../../hooks/useTheme';
import { ApiService } from '../../services/ApiService';

const tabs = ['In Progress', 'Saved', 'Finished'];

// ---------------------------------------------------------------------------
// ContinueCard — shown for the first in-progress book
// ---------------------------------------------------------------------------
const ContinueCard = ({ book, getProgressPercent, getProgressLabel, onPress, theme }) => {
  const percent = getProgressPercent(book.id);
  return (
    <TouchableOpacity
      style={[
        styles.continueCard,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border.light,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Cover */}
      {book.cover_image_url ? (
        <Image
          source={{ uri: book.cover_image_url }}
          style={styles.continueCover}
        />
      ) : (
        <View style={[styles.continueCover, { backgroundColor: theme.border.default }]} />
      )}

      {/* Info */}
      <View style={styles.continueInfo}>
        <Text style={[styles.continueLabel, { color: theme.primary }]}>
          CONTINUE LISTENING
        </Text>
        <Text style={[styles.continueTitle, { color: theme.text.primary }]} numberOfLines={2}>
          {book.title}
        </Text>
        <View style={[styles.continueProgressBar, { backgroundColor: theme.border.default }]}>
          <View
            style={[
              styles.continueFill,
              { width: percent + '%', backgroundColor: theme.primary },
            ]}
          />
        </View>
        <Text style={[styles.continueProgressText, { color: theme.text.secondary }]}>
          {getProgressLabel(book.id)}
        </Text>
      </View>

      {/* Play button */}
      <View style={[styles.continuePlayBtn, { backgroundColor: theme.primary }]}>
        <Icon name="play-arrow" size={16} color="#ffffff" />
      </View>
    </TouchableOpacity>
  );
};

// ---------------------------------------------------------------------------
// BookRow — compact row for all other books
// ---------------------------------------------------------------------------
const BookRow = ({ book, progress, percent, onPress, theme }) => {
  const initial = book.title ? book.title[0].toUpperCase() : '?';
  return (
    <TouchableOpacity
      style={[styles.bookRow, { borderBottomColor: theme.border.light }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Cover */}
      {book.cover_image_url ? (
        <Image
          source={{ uri: book.cover_image_url }}
          style={styles.bookCover}
        />
      ) : (
        <View style={[styles.bookCover, styles.bookCoverPlaceholder, { backgroundColor: theme.border.default }]}>
          <Text style={{ color: theme.text.secondary, fontSize: 18, fontWeight: '600' }}>
            {initial}
          </Text>
        </View>
      )}

      {/* Info */}
      <View style={styles.bookInfo}>
        <Text style={[styles.bookTitle, { color: theme.text.primary }]} numberOfLines={2}>
          {book.title}
        </Text>
        <Text style={[styles.bookAuthor, { color: theme.text.secondary }]} numberOfLines={1}>
          {book.author}
        </Text>
        {progress && progress.chapters_completed > 0 && (
          <View style={[styles.bookProgressBar, { backgroundColor: theme.border.default }]}>
            <View
              style={[
                styles.bookProgressFill,
                { width: percent + '%', backgroundColor: theme.primary },
              ]}
            />
          </View>
        )}
      </View>

      {/* Badge */}
      {progress && (
        progress.completed ? (
          <View style={[styles.badge, { backgroundColor: theme.primary + '26' }]}>
            <Text style={[styles.badgeText, { color: theme.primary }]}>Done</Text>
          </View>
        ) : percent > 0 ? (
          <View style={[styles.badge, { backgroundColor: theme.primary + '26' }]}>
            <Text style={[styles.badgeText, { color: theme.primary }]}>{percent}%</Text>
          </View>
        ) : null
      )}
    </TouchableOpacity>
  );
};

// ---------------------------------------------------------------------------
// LibraryScreen
// ---------------------------------------------------------------------------
const LibraryScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const [activeTab, setActiveTab] = useState('In Progress');
  const [library, setLibrary] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // -------------------------------------------------------------------------
  // Data fetching
  // -------------------------------------------------------------------------
  const loadData = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const books = await ApiService.getLibrary();
      setLibrary(books || []);

      const progressResults = await Promise.all(
        (books || []).map(b =>
          ApiService.getProgress(b.id).catch(() => null)
        )
      );

      const map = {};
      (books || []).forEach((b, i) => {
        if (progressResults[i]) {
          map[b.id] = progressResults[i];
        }
      });
      setProgressMap(map);
    } catch (err) {
      setError(err.message || 'Failed to load library');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  // -------------------------------------------------------------------------
  // Tab filtering
  // -------------------------------------------------------------------------
  const inProgress = library.filter(b => {
    const p = progressMap[b.id];
    return p && !p.completed && p.chapters_completed > 0;
  });

  const saved = library.filter(b => {
    const p = progressMap[b.id];
    return !p || p.chapters_completed === 0;
  });

  const finished = library.filter(b => {
    const p = progressMap[b.id];
    return p && p.completed === true;
  });

  const activeList =
    activeTab === 'In Progress' ? inProgress :
    activeTab === 'Saved' ? saved :
    finished;

  // -------------------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------------------
  const getProgressPercent = (bookId) => {
    const p = progressMap[bookId];
    if (!p || !p.chapters_completed) return 0;
    const book = library.find(b => b.id === bookId);
    if (!book || !book.total_chapters) return 0;
    return Math.round((p.chapters_completed / book.total_chapters) * 100);
  };

  const getProgressLabel = (bookId) => {
    const p = progressMap[bookId];
    const book = library.find(b => b.id === bookId);
    if (!p || !book) return '';
    return (
      'Chapter ' + p.chapters_completed + ' of ' + book.total_chapters +
      ' · ' + getProgressPercent(bookId) + '% complete'
    );
  };

  const goHome = () => navigation.navigate('MainTabs', { screen: 'HomeScreen' });

  const goToBook = (book) =>
    navigation.navigate('ContentDetailScreen', { content: book });

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text.primary }]}>My Library</Text>
        <Text style={[styles.headerSubtitle, { color: theme.text.secondary }]}>
          {library.length} books saved
        </Text>
      </View>

      {/* TABS */}
      <View style={[styles.tabContainer, { borderBottomColor: theme.border.light }]}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={styles.tabButton}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                { color: theme.text.secondary },
                activeTab === tab && [styles.activeTabText, { color: theme.text.primary }],
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* TAB INDICATOR */}
      <View style={styles.tabIndicatorContainer}>
        <View style={[styles.tabIndicatorLine, { backgroundColor: theme.border.default }]} />
        <View
          style={[
            styles.activeIndicator,
            {
              left: `${tabs.indexOf(activeTab) * (100 / tabs.length)}%`,
              backgroundColor: theme.primary,
            },
          ]}
        />
      </View>

      {/* CONTENT */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadData(true)}
            tintColor={theme.primary}
          />
        }
      >
        {loading ? (
          <LoadingIndicator />
        ) : error ? (
          <ErrorState message={error} />
        ) : (
          <>
            {/* In Progress: Continue card for first book */}
            {activeTab === 'In Progress' && inProgress.length > 0 && (
              <ContinueCard
                book={inProgress[0]}
                getProgressPercent={getProgressPercent}
                getProgressLabel={getProgressLabel}
                onPress={() => goToBook(inProgress[0])}
                theme={theme}
              />
            )}

            {/* Empty state */}
            {activeList.length === 0 && (
              activeTab === 'In Progress' ? (
                <EmptyStateCard
                  icon="📖"
                  title="Nothing in progress"
                  description="Start reading or listening to a book"
                  buttonText="Browse Books"
                  onButtonPress={goHome}
                />
              ) : activeTab === 'Saved' ? (
                <EmptyStateCard
                  icon="🔖"
                  title="No saved books"
                  description="Tap the bookmark icon on any book to save it"
                  buttonText="Browse Books"
                  onButtonPress={goHome}
                />
              ) : (
                <EmptyStateCard
                  icon="✅"
                  title="No finished books"
                  description="Completed books will appear here"
                  buttonText="Browse Books"
                  onButtonPress={goHome}
                />
              )
            )}

            {/* Book rows */}
            {activeList.length > 0 && (
              /* For In Progress: skip first book (shown in ContinueCard), render rest */
              (activeTab === 'In Progress' ? activeList.slice(1) : activeList).map((book) => (
                <BookRow
                  key={book.id}
                  book={book}
                  progress={progressMap[book.id]}
                  percent={getProgressPercent(book.id)}
                  onPress={() => goToBook(book)}
                  theme={theme}
                />
              ))
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 52,
    paddingHorizontal: 20,
    paddingBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    marginTop: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    fontWeight: 'bold',
  },
  tabIndicatorContainer: {
    position: 'relative',
  },
  tabIndicatorLine: {
    height: 2,
    width: '100%',
  },
  activeIndicator: {
    position: 'absolute',
    height: 2,
    width: '33.33%',
    top: 0,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // ContinueCard
  continueCard: {
    margin: 12,
    marginHorizontal: 16,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    gap: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  continueCover: {
    width: 56,
    height: 76,
    borderRadius: 6,
  },
  continueInfo: {
    flex: 1,
  },
  continueLabel: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  continueTitle: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  },
  continueProgressBar: {
    height: 3,
    borderRadius: 3,
    marginTop: 8,
    marginBottom: 4,
    overflow: 'hidden',
  },
  continueFill: {
    height: 3,
    borderRadius: 3,
  },
  continueProgressText: {
    fontSize: 10,
  },
  continuePlayBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // BookRow
  bookRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  bookCover: {
    width: 48,
    height: 66,
    borderRadius: 6,
  },
  bookCoverPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 2,
  },
  bookAuthor: {
    fontSize: 11,
    marginBottom: 6,
  },
  bookProgressBar: {
    height: 2,
    borderRadius: 3,
    overflow: 'hidden',
  },
  bookProgressFill: {
    height: 2,
    borderRadius: 3,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
});

export default LibraryScreen;
