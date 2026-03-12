import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { VerticalItemList } from '../components';
import { useTheme } from '../hooks/useTheme';
import { ApiService } from '../services/ApiService';

const ContentByCategoryScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { theme, styles: themedStyles } = useTheme();
  const { categoryName, categorySlug } = route.params || {};

  const [contentItems, setContentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configure header with theme colors when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      navigation.setOptions({
        headerShown: true,
        title: categoryName || 'Content',
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTintColor: theme.text.primary,
        headerTitleStyle: {
          color: theme.text.primary,
        },
        headerShadowVisible: false,
      });
    }, [navigation, theme, categoryName])
  );

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        const books = await ApiService.getBooks({
          category: categorySlug,
          limit: 50,
        });
        setContentItems(books || []);
      } catch (err) {
        setError(err.message || 'Failed to load books');
      } finally {
        setLoading(false);
      }
    };

    if (categorySlug) {
      loadBooks();
    } else {
      setLoading(false);
    }
  }, [categorySlug]);

  const handleItemPress = (item) => {
    console.log('Content item selected:', item.title);
    navigation.navigate('ContentDetailScreen', {
      content: item,
      contentId: item.id,
    });
  };

  if (loading) {
    return (
      <View style={[themedStyles.container, themedStyles.centered]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[themedStyles.container, themedStyles.centered]}>
        <Text style={{ color: theme.text.secondary, fontSize: 14 }}>
          {error}
        </Text>
      </View>
    );
  }

  return (
    <View style={themedStyles.container}>
      <VerticalItemList
        data={contentItems}
        onItemPress={handleItemPress}
        emptyMessage={'No books found in ' + (categoryName || 'this category')}
      />
    </View>
  );
};

export default ContentByCategoryScreen;
