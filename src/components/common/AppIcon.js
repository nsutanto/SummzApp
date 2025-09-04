import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { ICON_LIBRARIES } from '../../constants/icons';

const AppIcon = ({ 
  library = ICON_LIBRARIES.MATERIAL, 
  name, 
  size = 24, 
  color = '#000',
  style,
  ...props 
}) => {
  const IconComponent = {
    [ICON_LIBRARIES.MATERIAL]: MaterialIcons,
    [ICON_LIBRARIES.MATERIAL_COMMUNITY]: MaterialCommunityIcons,
    [ICON_LIBRARIES.IONICONS]: Ionicons,
    [ICON_LIBRARIES.FEATHER]: Feather,
    [ICON_LIBRARIES.ANT_DESIGN]: AntDesign,
    [ICON_LIBRARIES.FONT_AWESOME]: FontAwesome,
  }[library] || MaterialIcons;

  return (
    <IconComponent 
      name={name} 
      size={size} 
      color={color} 
      style={style}
      {...props}
    />
  );
};

export default AppIcon;
