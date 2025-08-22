import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';

const HomeScreen = () => {
  const { user } = useAuth();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {user && (
          <View style={styles.welcomeCard}>
            <Text style={styles.welcomeTitle}>Welcome back!</Text>
            <Text style={styles.welcomeText}>
              {user.displayName || user.email || 'User'}
            </Text>
          </View>
        )}
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent Activity</Text>
          <Text style={styles.cardText}>Your recent summaries will appear here</Text>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Create New Summary</Text>
          </TouchableOpacity>
        </View>
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
  welcomeCard: {
    backgroundColor: '#4285F4',
    padding: 20,
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
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  welcomeText: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#666',
  },
  actionButton: {
    backgroundColor: '#4285F4',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;
