import React from 'react';
import { View } from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { VerticalItemList } from '../components';
import { useTheme } from '../hooks/useTheme';

const ContentByCategoryScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { theme, styles: themedStyles } = useTheme();
  const { categoryName } = route.params || {};
  const contentItems = [];

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

  const handleItemPress = (item) => {
    console.log('Content item selected:', item.title);
    // Navigate to content detail screen
    navigation.navigate('ContentDetailScreen', { 
      content: item,
      contentId: item.id 
    });
  };

  // Main Content
  return (
    <View style={themedStyles.container}>
      <VerticalItemList
        data={contentItems}
        onItemPress={handleItemPress}
        emptyMessage={`No content found in ${categoryName || 'this category'}`}
      />
    </View>
  );
};

export default ContentByCategoryScreen;
