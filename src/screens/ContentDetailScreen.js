import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useTheme } from '../hooks/useTheme';
import { spacing, shadows } from '../styles';
import { AppIcon, IconButton } from '../components';
import { ICONS, ICON_LIBRARIES } from '../constants/icons';

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
          source={{ uri: 'https://picsum.photos/200/300' }}
          style={styles.bookCover}
          resizeMode="cover"
        />
      </View>

      {/* Book Title */}
      <Text style={[{ color: theme.text.primary }, styles.title]}>
        {content.title}
      </Text>
      {content.author && (
        <Text style={[{ color: theme.text.secondary }, styles.author]}>
          {content.author}
        </Text>
      )}

      {/* Play Controls */}
      <View style={styles.controlsContainer}>
        <IconButton
          iconName={ICONS.REWIND}
          iconLibrary={ICON_LIBRARIES.MATERIAL}
          iconSize={32}
          iconColor={theme.text.primary}
          onPress={handleRewind}
          buttonStyle={styles.controlButton}
        />

        <TouchableOpacity 
          style={[styles.playButton, { backgroundColor: theme.primary }, shadows.medium]}
          onPress={handlePlayPause}
          activeOpacity={0.7}
        >
          <AppIcon 
            library={ICON_LIBRARIES.MATERIAL}
            name={ICONS.PLAY} 
            size={48} 
            color={theme.surface} 
          />
        </TouchableOpacity>

        <IconButton
          iconName={ICONS.FORWARD}
          iconLibrary={ICON_LIBRARIES.MATERIAL}
          iconSize={32}
          iconColor={theme.text.primary}
          onPress={handleForward}
          buttonStyle={styles.controlButton}
        />
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
