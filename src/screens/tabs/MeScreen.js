import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing } from '../../styles';
import { Section, SettingItem } from '../../components';
import { useTheme } from '../../hooks/useTheme';

const MeScreen = () => {
  const navigation = useNavigation();
  const { user, signOut } = useAuth();
  const { theme, styles: themedStyles } = useTheme();
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
              navigation.reset({
                index: 0,
                routes: [{ name: 'LoginScreen' }],
              });
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
          <View style={[styles.profileCard, { backgroundColor: theme.surface }]}>
            <View style={styles.avatarContainer}>
              {user.photoURL && !imageError ? (
                <Image 
                  source={{ uri: user.photoURL }} 
                  style={styles.avatarImage}
                  onError={() => setImageError(true)}
                />
              ) : (
                <Text style={styles.avatarText}>
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
        
        <TouchableOpacity style={[themedStyles.buttonDanger]} onPress={handleLogout}>
          <Text style={themedStyles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  profileCard: {
    // backgroundColor will be overridden by theme
    padding: spacing.xl,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: spacing.xl,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary, // Keep primary color for avatar
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
    color: colors.white,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    // color will be overridden by theme
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    // color will be overridden by theme
  },
});

export default MeScreen;
