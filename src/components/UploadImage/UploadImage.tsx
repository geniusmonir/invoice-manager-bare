import React from 'react';
import { Text, StyleSheet, Pressable, Platform, Image } from 'react-native';
import Colors from '../../constants/Colors';
import FontNames from '../../constants/FontNames';
import { isAndroid, isLarge } from './../../utils/utils';

const UploadImage: React.FC<{ onPress: () => void; image: string }> = ({
  onPress,
  image,
}) => {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      {!image && <Text style={styles.text}>+</Text>}

      {image.length > 50 && (
        <Image
          source={{ uri: `data:image/jpeg;base64,${image}` }}
          style={styles.image}
        />
      )}

      {/* {image.length > 0 && image.length < 50 && (
        <Image
          source={{ uri: `${URLConfig.avatarUrl}${image}` }}
          style={styles.image}
        />
      )} */}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: isLarge ? 160 : 125,
    height: isLarge ? 160 : 125,
    marginVertical: 15,
    alignItems: 'center',
    borderRadius: 100,
    borderColor: Colors.xplight,
    backgroundColor: 'white',
    borderWidth: 5,
    justifyContent: 'center',
  },

  text: {
    fontFamily: FontNames.MyriadProBold,
    fontSize: isLarge ? 50 : 39,
    color: Colors.primaryColor,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: isAndroid ? 10 : 0,
    paddingTop: isAndroid ? 0 : 5,
  },

  image: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
    alignItems: 'center',
  },
});

export default UploadImage;
