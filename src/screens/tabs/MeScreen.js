import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { commonStyles, colors, spacing } from '../../styles';

const MeScreen = () => {
  const navigation = useNavigation();
  const { user, signOut } = useAuth();

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
    <ScrollView style={commonStyles.container}>
      <View style={commonStyles.content}>
        {user && (
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.userName}>
              {user.displayName || user.email || 'User'}
            </Text>
            {user.email && (
              <Text style={styles.userEmail}>{user.email}</Text>
            )}
          </View>
        )}
        
        {/* Account Section */}
        <View style={commonStyles.section}>
          <Text style={commonStyles.sectionHeader}>Account</Text>
          
          <TouchableOpacity style={commonStyles.menuItem}>
            <Text style={commonStyles.menuIcon}>👤</Text>
            <Text style={commonStyles.menuText}>View Profile</Text>
            <Text style={commonStyles.menuArrow}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[commonStyles.menuItem, commonStyles.lastMenuItem]}>
            <Text style={commonStyles.menuIcon}>💳</Text>
            <Text style={commonStyles.menuText}>Subscription</Text>
            <Text style={commonStyles.menuArrow}>›</Text>
          </TouchableOpacity>
        </View>
        
        {/* App Settings Section */}
        <View style={commonStyles.section}>
          <Text style={commonStyles.sectionHeader}>App Settings</Text>
          
          <TouchableOpacity style={[commonStyles.menuItem, commonStyles.lastMenuItem]}>
            <Text style={commonStyles.menuIcon}>🔤</Text>
            <Text style={commonStyles.menuText}>Text Size</Text>
            <Text style={commonStyles.menuArrow}>›</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={commonStyles.buttonDanger} onPress={handleLogout}>
          <Text style={commonStyles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  profileCard: {
    backgroundColor: colors.white,
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
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.white,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: colors.text.secondary,
  },
});

export default MeScreen;
