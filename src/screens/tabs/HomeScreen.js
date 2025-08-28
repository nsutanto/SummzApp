import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../../context/AuthContext';
import { commonStyles, colors, spacing } from '../../styles';
import { Card } from '../../components';

const HomeScreen = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState('');

  return (
    <ScrollView style={commonStyles.container}>
      <View style={commonStyles.content}>
        {/* Search Bar */}
        <View style={styles.searchBarContainer}>
          <View style={styles.searchBarWrapper}>
            <Icon name="search" size={24} color={colors.text.secondary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchBar}
              placeholder="Search for books"
              placeholderTextColor={colors.text.secondary}
              value={search}
              onChangeText={setSearch}
              returnKeyType="search"
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    marginBottom: spacing.lg,
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchBar: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text.primary,
    backgroundColor: 'transparent',
  },
});

export default HomeScreen;
