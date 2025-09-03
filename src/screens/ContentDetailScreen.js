import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRoute } from '@react-navigation/native';
import { useTheme } from '../hooks/useTheme';
import { spacing, shadows } from '../styles';

const ContentDetailScreen = () => {
  const route = useRoute();
  const { theme, styles: themedStyles } = useTheme();
  
  // Get the book/content data from navigation parameters
  const { content } = route.params || {};
  
  if (!content) {
    return (
      <View style={[themedStyles.container, themedStyles.centered]}>
        <Text style={[{ color: theme.text.secondary }]}>
          No content available
        </Text>
      </View>
    );
  }

  const handlePlayPause = () => {
    console.log('Play/Pause pressed for:', content.title);
    // TODO: Implement play/pause functionality
  };

  const handleRewind = () => {
    console.log('Rewind pressed for:', content.title);
    // TODO: Implement rewind functionality
  };

  const handleForward = () => {
    console.log('Forward pressed for:', content.title);
    // TODO: Implement forward functionality
  };

  return (
    <View style={[themedStyles.container, themedStyles.centered]}>
      {/* Book Cover */}
      <View style={[styles.bookContainer, shadows.medium]}>
        <Image 
          source={{ uri: content.cover_image_url }}
          style={styles.bookCover}
          resizeMode="cover"
        />
      </View>

      {/* Book Title */}
      <Text style={[themedStyles.text?.primary || { color: theme.text.primary }, styles.title]}>
        {content.title}
      </Text>
      {content.author && (
        <Text style={[themedStyles.text?.secondary || { color: theme.text.secondary }, styles.author]}>
          {content.author}
        </Text>
      )}

      {/* Play Controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity 
          style={styles.controlButton}
          onPress={handleRewind}
          activeOpacity={0.7}
        >
          <Icon name="replay-10" size={32} color={theme.text.primary} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.playButton, { backgroundColor: theme.primary }, shadows.medium]}
          onPress={handlePlayPause}
          activeOpacity={0.7}
        >
          <Icon name="play-arrow" size={48} color={theme.surface} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.controlButton}
          onPress={handleForward}
          activeOpacity={0.7}
        >
          <Icon name="forward-10" size={32} color={theme.text.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bookContainer: {
    marginBottom: spacing.xl,
  },
  bookCover: {
    width: 200,
    height: 300,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.lg,
  },
  author: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: spacing.xxl,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xl,
  },
  controlButton: {
    padding: spacing.md,
  },
  playButton: {
    borderRadius: 40,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ContentDetailScreen;
