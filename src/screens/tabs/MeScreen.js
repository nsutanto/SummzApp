import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';

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
    <ScrollView style={styles.container}>
      <View style={styles.content}>
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
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Account</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>👤</Text>
            <Text style={styles.menuText}>View Profile</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.menuItem, styles.lastMenuItem]}>
            <Text style={styles.menuIcon}>💳</Text>
            <Text style={styles.menuText}>Subscription</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        </View>
        
        {/* App Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>App Settings</Text>
          
          <TouchableOpacity style={[styles.menuItem, styles.lastMenuItem]}>
            <Text style={styles.menuIcon}>🔤</Text>
            <Text style={styles.menuText}>Text Size</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  profileCard: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 30,
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
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 16,
    width: 24,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  menuArrow: {
    fontSize: 20,
    color: '#999',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MeScreen;
