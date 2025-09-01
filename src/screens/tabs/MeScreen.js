import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { spacing } from '../../styles';
import { Section, SettingItem } from '../../components';
import { useTheme } from '../../hooks/useTheme';

const MeScreen = () => {
  const { user, signOut } = useAuth();
  const { theme, styles: themedStyles, commonStyles } = useTheme();
  const [imageError, setImageError] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              // No need to manually navigate - AuthContext will handle the state change
              // and automatically switch to LoginScreen
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={[themedStyles.container, { backgroundColor: theme.background }]}>
      <View style={themedStyles.content}>
        {user && (
          <View style={[commonStyles.cardLarge, { backgroundColor: theme.surface, alignItems: 'center' }]}>
            <View style={[styles.avatarContainer, { backgroundColor: theme.primary }]}>
              {user.photoURL && !imageError ? (
                <Image 
                  source={{ uri: user.photoURL }} 
                  style={styles.avatarImage}
                  onError={() => setImageError(true)}
                />
              ) : (
                <Text style={[styles.avatarText, { color: theme.white }]}>
                  {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                </Text>
              )}
            </View>
            <Text style={[styles.userName, { color: theme.text.primary }]}>
              {user.displayName || user.email || 'User'}
            </Text>
            {user.email && (
              <Text style={[styles.userEmail, { color: theme.text.secondary }]}>
                {user.email}
              </Text>
            )}
          </View>
        )}
        
                {/* Account Section */}
        <Section title="Account">
          <SettingItem 
            icon="👤" 
            text="View Profile" 
            onPress={() => {}} 
          />
          <SettingItem 
            icon="💳" 
            text="Subscription" 
            onPress={() => {}} 
            isLast={true}
          />
        </Section>
        
        {/* App Settings Section */}
        <Section title="App Settings">
          <SettingItem 
            icon="🔤" 
            text="Text Size" 
            onPress={() => {}} 
            isLast={true}
          />
        </Section>
        
        <TouchableOpacity style={commonStyles.buttonDanger} onPress={handleLogout}>
          <Text style={commonStyles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
  },
});

export default MeScreen;
