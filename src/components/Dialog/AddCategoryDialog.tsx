import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View, Alert, TextInput } from 'react-native';
import Dialog from 'react-native-dialog';
import Colors from '../../constants/Colors';
import FontNames from '../../constants/FontNames';
import { Chip } from 'react-native-paper';
import { Icon } from 'react-native-elements';
import { RootState } from '../../store/store';
import { useSelector } from 'react-redux';
import { getCategoryStr } from '../../utils/functions';
import { isLarge } from '../../utils/utils';

const AddCategoryDialog: React.FC<{
  visible: boolean;
  setVisible: (command: boolean) => void;
  submitCategory: (category: string) => void;
  deleteCategory: (category: string) => void;
  refresh?: number;
}> = ({ visible, setVisible, submitCategory, deleteCategory, refresh = 0 }) => {
  const [category, setCategory] = React.useState('');

  const { categories } = useSelector((state: RootState) => state.category);

  const ref = React.useRef<TextInput>(null);

  useEffect(() => {
    // page refresh
  }, [refresh]);

  const handleCancel = () => {
    setVisible(false);
  };

  const handleSubmit = () => {
    submitCategory(category);
  };

  return (
    <View>
      <Dialog.Container
        visible={visible}
        onBackdropPress={handleCancel}
        contentStyle={{
          width: isLarge ? 650 : 500,
          borderBottomEndRadius: 30,
          borderTopStartRadius: 30,
          padding: isLarge ? 20 : 15,
        }}>
        <Text
          style={{
            fontFamily: FontNames.MyriadProBold,
            alignSelf: 'flex-start',
            color: Colors.primaryColor,
            textAlign: 'left',
            textTransform: 'uppercase',
            fontSize: isLarge ? 22 : 17,
            marginVertical: isLarge ? 20 : 15,
          }}>
          All Categories
        </Text>

        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}>
          {categories.map((cat) => {
            return (
              <Chip
                key={cat}
                closeIcon={(i) => (
                  <Icon
                    tvParallaxProperties={Icon}
                    size={isLarge ? 20 : 15}
                    name='trash-outline'
                    type='ionicon'
                    color={Colors.redColor}
                  />
                )}
                textStyle={{
                  color: Colors.tertiaryColor,
                  fontFamily: FontNames.MyriadProRegular,
                  fontSize: isLarge ? 20 : 15,
                  padding: 5,
                  textTransform: 'uppercase',
                }}
                style={{
                  backgroundColor: Colors.xtlight,
                  marginRight: isLarge ? 10 : 7,
                  marginBottom: isLarge ? 10 : 7,
                }}
                onClose={() => {
                  deleteCategory(cat);
                }}>
                {getCategoryStr(cat)}
              </Chip>
            );
          })}
        </View>

        <Text
          style={{
            fontFamily: FontNames.MyriadProBold,
            alignSelf: 'flex-start',
            textAlign: 'left',
            textTransform: 'uppercase',
            color: Colors.primaryColor,
            fontSize: isLarge ? 22 : 17,
            marginVertical: isLarge ? 20 : 15,
          }}>
          Insert the category name you want to add
        </Text>

        <Dialog.Input
          underlineColorAndroid={Colors.primaryColor}
          textInputRef={ref}
          style={{
            width: '100%',
            minWidth: isLarge ? 500 : 350,
            maxWidth: isLarge ? 500 : 350,
            ...styles.textStyle,
          }}
          placeholder='Your Category e.g. pepsi'
          onChangeText={(text) => setCategory(text)}></Dialog.Input>

        <Dialog.Button
          style={styles.textStyle}
          color={Colors.primaryColor}
          label='Cancel'
          onPress={handleCancel}
        />
        <Dialog.Button
          style={styles.textStyle}
          color={Colors.primaryColor}
          label='ADD'
          onPress={() => {
            ref.current?.clear();
            handleSubmit();
          }}
        />
      </Dialog.Container>
    </View>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    fontFamily: FontNames.MyriadProRegular,
    fontSize: isLarge ? 20 : 15,
  },
});

export default AddCategoryDialog;
