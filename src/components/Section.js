import React from 'react';
import { View, Text } from 'react-native';
import { commonStyles } from '../styles';

const Section = ({ title, children, style }) => {
  return (
    <View style={[commonStyles.section, style]}>
      {title && <Text style={commonStyles.sectionHeader}>{title}</Text>}
      {children}
    </View>
  );
};

export default Section;
