import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity,
         TextInput, FlatList, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { spacing, shadows, typography } from '../../styles';
import { HorizontalItemList, LoadingIndicator, ErrorState } from '../../components';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../context/AuthContext';
import { ApiService } from '../../services/ApiService';

const HeroHeader = ({ user, theme }) => {
  const firstName = user?.displayName?.split(' ')[0] || null;
  return (
    <View style={[heroStyles.container, { backgroundColor: theme.surface }]}>
      <Text style={[heroStyles.greeting, { color: theme.text.secondary }]}>
        {firstName ? `Good morning, ${firstName}` : 'Good morning'}
      </Text>
      <Text style={[heroStyles.title, { color: theme.text.primary }]}>
        What will you{'\n'}learn today?
      </Text>
    </View>
  );
};

const HomeScreen = () => {
  const navigation = useNavigation();
  const { theme, styles: themedStyles } = useTheme();
  const { user } = useAuth();

  const [categories, setCategories] = useState([]);
  const [booksByCategory, setBooksByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePill, setActivePill] = useState(null); // null = All
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const cats = await ApiService.getCategories();
        setCategories(cats);

        const bookResults = await Promise.all(
          cats.map(cat => ApiService.getBooks({ category: cat.slug, limit: 8 }))
        );

        const map = {};
        cats.forEach((cat, i) => {
          map[cat.id] = bookResults[i] || [];
        });
        setBooksByCategory(map);
      } catch (err) {
        setError(err.message || 'Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleItemPress = (item) => {
    navigation.navigate('ContentDetailScreen', {
      content: item,
      contentId: item.id,
    });
  };

  const handleSeeAllPress = (category) => {
    navigation.navigate('ContentByCategoryScreen', {
      categoryName: category.name,
      categoryId: category.id,
      categorySlug: category.slug,
    });
  };

  const getFilteredBooks = (categoryId) => {
    const books = booksByCategory[categoryId] || [];
    if (!search.trim()) return books;
    const q = search.trim().toLowerCase();
    return books.filter(b => b.title?.toLowerCase().includes(q));
  };

  const visibleCategories = activePill
    ? categories.filter(c => c.id === activePill)
    : categories;

  const pillData = [{ id: null, name: 'All', icon: '' }, ...categories];

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {/* A: Hero header — not inside ScrollView */}
      <HeroHeader user={user} theme={theme} />

      {loading ? (
        <LoadingIndicator />
      ) : error ? (
        <ErrorState message={error} />
      ) : (
        <ScrollView style={[themedStyles.container, { backgroundColor: theme.background }]}>
          <View style={themedStyles.content}>
            {/* B: Search Bar */}
            <View style={styles.searchBarContainer}>
              <View style={[
                styles.searchBarWrapper,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border.light,
                }
              ]}>
                <Icon
                  name="search"
                  size={24}
                  color={theme.text.secondary}
                  style={styles.searchIcon}
                />
                <TextInput
                  style={[styles.searchBar, { color: theme.text.primary }]}
                  placeholder="Search for books"
                  placeholderTextColor={theme.text.secondary}
                  value={search}
                  onChangeText={setSearch}
                  returnKeyType="search"
                />
              </View>
            </View>

            {/* C: Category Pills */}
            <FlatList
              data={pillData}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id === null ? 'all' : String(item.id)}
              style={styles.pillList}
              contentContainerStyle={styles.pillListContent}
              renderItem={({ item }) => {
                const isActive = activePill === item.id;
                const label = item.id === null
                  ? 'All'
                  : `${item.icon} ${item.name}`.trim();
                return (
                  <TouchableOpacity
                    style={[
                      styles.pill,
                      isActive
                        ? { backgroundColor: theme.primary, borderColor: theme.primary }
                        : { backgroundColor: theme.surface, borderColor: theme.border.light },
                    ]}
                    onPress={() => setActivePill(item.id)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        { color: isActive ? '#fff' : theme.text.secondary },
                      ]}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />

            {/* D: Category Sections */}
            {visibleCategories.map((category, index) => {
              const content = getFilteredBooks(category.id);

              if (content.length === 0) return null;

              const sectionTitle = (index === 0 && activePill === null)
                ? "Editor's Pick"
                : category.name;

              return (
                <View key={category.id} style={styles.categorySection}>
                  <View style={styles.categoryHeader}>
                    <View style={styles.categoryTitleContainer}>
                      {(index !== 0 || activePill !== null) && (
                        <Text style={styles.categoryEmoji}>{category.icon}</Text>
                      )}
                      <Text
                        style={[styles.categoryTitle, { color: theme.text.primary }]}
                        numberOfLines={2}
                      >
                        {sectionTitle}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => handleSeeAllPress(category)}>
                      <Text style={[styles.seeAllText, { color: theme.primary }]}>
                        See All
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <HorizontalItemList
                    data={content}
                    onItemPress={handleItemPress}
                    itemWidth={140}
                    itemHeight={190}
                    spacing={spacing.lg}
                  />
                </View>
              );
            })}

            {/* Empty state when search yields nothing */}
            {visibleCategories.length > 0 &&
              visibleCategories.every(c => getFilteredBooks(c.id).length === 0) && (
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: theme.text.secondary }]}>
                  No results found
                </Text>
              </View>
            )}

            {categories.length === 0 && (
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: theme.text.secondary }]}>
                  No categories available
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    marginTop: Platform.OS === 'ios' ? 0 : 16,
    marginBottom: 24,
  },
  searchBarWrapper: {
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 48,
    ...shadows.small,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchBar: {
    flex: 1,
    ...typography.body,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingHorizontal: 0,
    width: '100%',
  },
  categoryTitleContainer: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 12,
    alignItems: 'flex-start',
  },
  categoryEmoji: {
    fontSize: 20,
    marginRight: 8,
    lineHeight: 26,
  },
  categoryTitle: {
    ...typography.subtitle,
    lineHeight: 26,
    flex: 1,
    textAlign: 'left',
    includeFontPadding: false,
    textAlignVertical: 'top',
  },
  seeAllText: {
    ...typography.bodySecondary,
    fontWeight: '600',
    flexShrink: 0,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    ...typography.body,
  },
  // Category pills
  pillList: {
    marginBottom: 24,
  },
  pillListContent: {
    paddingRight: 8,
  },
  pill: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 7,
    marginRight: 8,
  },
  pillText: {
    fontSize: 13,
  },
});

const heroStyles = StyleSheet.create({
  container: {
    paddingTop: 52,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 13,
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
