import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Colors from '../../constants/Colors';

const Card: React.FC<{ style: ViewStyle }> = (props) => {
  return (
    <View style={{ ...styles.card, ...props.style }}>{props.children}</View>
  );
};

const styles = StyleSheet.create({
  card: {
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 4,
    backgroundColor: Colors.white,
    borderBottomEndRadius: 30,
    borderTopStartRadius: 30,
  },
});

export default Card;
