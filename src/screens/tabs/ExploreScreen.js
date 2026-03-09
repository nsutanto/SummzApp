import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Image,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { spacing, typography } from '../../styles';
import { useTheme } from '../../hooks/useTheme';
import { LoadingIndicator, ErrorState } from '../../components';
import { ApiService } from '../../services/ApiService';

// ---------------------------------------------------------------------------
// Local sub-components
// ---------------------------------------------------------------------------

const SearchBookRow = ({ book, onPress }) => {
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      style={[styles.searchRow, { borderBottomWidth: 1, borderBottomColor: theme.border.light }]}
      onPress={onPress}
    >
      {book.cover_image_url ? (
        <Image
          style={styles.searchRowImage}
          source={{ uri: book.cover_image_url }}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.searchRowImage, { backgroundColor: theme.surface }]} />
      )}
      <View style={styles.searchRowInfo}>
        <Text style={[styles.searchRowTitle, { color: theme.text.primary }]} numberOfLines={2}>
          {book.title}
        </Text>
        <Text style={[styles.searchRowAuthor, { color: theme.text.secondary }]}>
          {book.author}
        </Text>
        <Text style={[styles.searchRowMeta, { color: theme.text.secondary }]}>
          {book.read_time_minutes} min read
        </Text>
      </View>
      <Icon name="chevron-right" size={20} color={theme.text.secondary} />
    </TouchableOpacity>
  );
};

const GridBookCard = ({ book, onPress }) => {
  const { theme } = useTheme();
  return (
    <TouchableOpacity style={styles.gridCard} onPress={onPress}>
      {book.cover_image_url ? (
        <Image
          style={styles.gridImage}
          source={{ uri: book.cover_image_url }}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.gridImage, { backgroundColor: theme.surface, justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={{ color: theme.text.secondary, fontSize: 10, textAlign: 'center', padding: 4 }} numberOfLines={3}>
            {book.title}
          </Text>
        </View>
      )}
      <Text style={[styles.gridTitle, { color: theme.text.primary }]} numberOfLines={2}>
        {book.title}
      </Text>
      <Text style={[styles.gridAuthor, { color: theme.text.secondary }]} numberOfLines={1}>
        {book.author}
      </Text>
    </TouchableOpacity>
  );
};

const RankedBookRow = ({ book, rank, onPress }) => {
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      style={[styles.rankedRow, { borderBottomWidth: 1, borderBottomColor: theme.border.light }]}
      onPress={onPress}
    >
      <Text style={[styles.rankNum, { color: rank <= 3 ? theme.primary : theme.text.secondary }]}>
        {rank}
      </Text>
      {book.cover_image_url ? (
        <Image
          style={styles.rankedImage}
          source={{ uri: book.cover_image_url }}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.rankedImage, { backgroundColor: theme.surface }]} />
      )}
      <View style={styles.rankedInfo}>
        <Text style={[styles.searchRowTitle, { color: theme.text.primary }]} numberOfLines={2}>
          {book.title}
        </Text>
        <Text style={[styles.searchRowAuthor, { color: theme.text.secondary }]}>
          {book.author}
        </Text>
        <Text style={[styles.searchRowMeta, { color: theme.text.secondary }]}>
          {book.read_time_minutes} min read
        </Text>
      </View>
      <Icon name="chevron-right" size={20} color={theme.text.secondary} />
    </TouchableOpacity>
  );
};

const CategoryCard = ({ category, onPress }) => {
  const { theme } = useTheme();
  return (
    <TouchableOpacity style={styles.catCard} onPress={onPress}>
      <View style={[styles.catInner, { backgroundColor: theme.surface, borderColor: theme.border.light }]}>
        <Text style={styles.catIcon}>{category.icon}</Text>
        <Text style={[styles.catName, { color: theme.text.primary }]}>{category.name}</Text>
      </View>
    </TouchableOpacity>
  );
};

// ---------------------------------------------------------------------------
// ExploreScreen
// ---------------------------------------------------------------------------

const ExploreScreen = () => {
  const navigation = useNavigation();
  const { theme, styles: themedStyles } = useTheme();

  const [activeTab, setActiveTab] = useState('For you');
  const tabs = ['For you', 'Trending', 'Categories'];

  const [categories, setCategories] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [cats, books] = await Promise.all([
        ApiService.getCategories(),
        ApiService.getBooks({ limit: 50 }),
      ]);
      setCategories(cats || []);
      setAllBooks(books || []);
    } catch (err) {
      setError(err.message || 'Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (categories.length === 0) loadData();
    }, [])
  );

  const searchResults = searchQuery.trim().length > 0
    ? allBooks.filter(b =>
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.author.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const isSearching = searchQuery.trim().length > 0;

  const handleTabPress = (tab) => {
    setActiveTab(tab);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'For you':
        if (loading) return <LoadingIndicator />;
        if (error) return <ErrorState message={error} />;
        return (
          <>
            <Text style={[styles.sectionHeader, { color: theme.text.primary }]}>All Books</Text>
            <View style={styles.gridRow}>
              {allBooks.map((book) => (
                <GridBookCard
                  key={book.id}
                  book={book}
                  onPress={() => navigation.navigate('ContentDetailScreen', { content: book })}
                />
              ))}
            </View>
          </>
        );

      case 'Trending':
        if (loading) return <LoadingIndicator />;
        if (error) return <ErrorState message={error} />;
        return (
          <>
            <Text style={[styles.sectionHeader, { color: theme.text.primary }]}>Most Popular</Text>
            {allBooks.slice(0, 10).map((book, index) => (
              <RankedBookRow
                key={book.id}
                book={book}
                rank={index + 1}
                onPress={() => navigation.navigate('ContentDetailScreen', { content: book })}
              />
            ))}
          </>
        );

      case 'Categories':
        if (loading) return <LoadingIndicator />;
        if (error) return <ErrorState message={error} />;
        return (
          <>
            <Text style={[styles.sectionHeader, { color: theme.text.primary }]}>Browse by Category</Text>
            <View style={styles.catGrid}>
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onPress={() =>
                    navigation.navigate('ContentByCategoryScreen', {
                      categoryName: category.name,
                      categoryId: category.id,
                      categorySlug: category.slug,
                    })
                  }
                />
              ))}
            </View>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text.primary }]}>Explore</Text>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchBar, { backgroundColor: theme.surface, borderColor: theme.border.light }]}>
        <Icon name="search" size={22} color={theme.text.secondary} style={{ marginRight: 10 }} />
        <TextInput
          style={[styles.searchInput, { color: theme.text.primary }]}
          placeholder="Search books, authors…"
          placeholderTextColor={theme.text.secondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="close" size={20} color={theme.text.secondary} />
          </TouchableOpacity>
        )}
      </View>

      {isSearching ? (
        /* Search Results */
        <ScrollView>
          {searchResults.length === 0 ? (
            <Text style={[styles.noResults, { color: theme.text.secondary }]}>
              {`No results for "${searchQuery}"`}
            </Text>
          ) : (
            <>
              <Text style={[styles.resultsCount, { color: theme.text.secondary }]}>
                {searchResults.length} results
              </Text>
              {searchResults.map((book) => (
                <SearchBookRow
                  key={book.id}
                  book={book}
                  onPress={() => navigation.navigate('ContentDetailScreen', { content: book })}
                />
              ))}
            </>
          )}
        </ScrollView>
      ) : (
        <>
          {/* Tab Navigation */}
          <View style={[themedStyles.content, { paddingTop: 0, paddingBottom: 0 }]}>
            <View style={styles.tabContainer}>
              {tabs.map((tab) => (
                <TouchableOpacity
                  key={tab}
                  style={styles.tabButton}
                  onPress={() => handleTabPress(tab)}
                >
                  <Text style={[
                    styles.tabText,
                    { color: theme.text.secondary },
                    activeTab === tab && { color: theme.text.primary, fontWeight: 'bold' },
                  ]}>
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Tab Indicator */}
            <View style={styles.tabIndicatorContainer}>
              <View style={[styles.tabIndicatorLine, { backgroundColor: theme.border.default }]} />
              <View style={[
                styles.activeIndicator,
                {
                  left: `${tabs.indexOf(activeTab) * (100 / tabs.length)}%`,
                  backgroundColor: theme.primary,
                },
              ]} />
            </View>
          </View>

          {/* Tab Content */}
          <ScrollView>
            {renderTabContent()}
          </ScrollView>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // Existing styles
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  tabText: {
    ...typography.body,
    fontWeight: '500',
  },
  tabIndicatorContainer: {
    marginBottom: spacing.lg,
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
  // New styles
  container: { flex: 1 },
  header: { paddingTop: 52, paddingHorizontal: 20, paddingBottom: 8 },
  headerTitle: { fontSize: 28, fontWeight: 'bold' },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 16, marginBottom: 12,
    borderRadius: 12, borderWidth: 1, height: 46, paddingHorizontal: 14,
  },
  searchInput: { flex: 1, fontSize: 14 },
  resultsCount: { fontSize: 12, paddingHorizontal: 20, marginBottom: 8 },
  noResults: { fontSize: 14, textAlign: 'center', marginTop: 40 },
  sectionHeader: {
    fontSize: 16, fontWeight: 'bold',
    paddingHorizontal: 20, marginBottom: 12, marginTop: 4,
  },
  gridRow: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12 },
  gridCard: { width: '50%', padding: 8 },
  gridImage: { width: '100%', height: 160, borderRadius: 10 },
  gridTitle: { fontSize: 12, fontWeight: '500', marginTop: 8 },
  gridAuthor: { fontSize: 11, marginTop: 2 },
  searchRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 10, paddingHorizontal: 20,
  },
  searchRowImage: { width: 44, height: 60, borderRadius: 6 },
  searchRowInfo: { flex: 1, marginLeft: 12 },
  searchRowTitle: { fontSize: 14, fontWeight: '500' },
  searchRowAuthor: { fontSize: 12, marginTop: 2 },
  searchRowMeta: { fontSize: 11, marginTop: 4 },
  rankedRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 12, paddingHorizontal: 20,
  },
  rankNum: { width: 28, fontSize: 18, fontWeight: 'bold' },
  rankedImage: { width: 48, height: 66, borderRadius: 6 },
  rankedInfo: { flex: 1, marginLeft: 12 },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12 },
  catCard: { width: '50%', padding: 8 },
  catInner: { borderRadius: 12, padding: 16, borderWidth: 1 },
  catIcon: { fontSize: 28, marginBottom: 8 },
  catName: { fontSize: 14, fontWeight: '600' },
});

export default ExploreScreen;
