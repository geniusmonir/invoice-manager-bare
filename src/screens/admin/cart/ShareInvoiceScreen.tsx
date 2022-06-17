import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@rneui/themed';
import { ShareInvoiceScreensProps } from '../../../types/mainNavigatorTypes';
import Colors from '../../../constants/Colors';
import FontNames from '../../../constants/FontNames';
import GlobalButton from '../../../components/Buttons/GlobalButton';
import { FAB } from 'react-native-paper';
import { shareAsync } from 'expo-sharing';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { isLarge } from '../../../utils/utils';

const ShareInvoiceScreen: React.FC<ShareInvoiceScreensProps> = ({
  route,
  navigation,
}: ShareInvoiceScreensProps) => {
  const { currentPdfUri } = useSelector((state: RootState) => state.invoice);
  const { business_name, invoiceNumber } = route.params;

  return (
    <View style={styles.container}>
      <View style={{ ...styles.settingsHeaderWrapper, marginTop: 200 }}>
        <Text style={styles.settingsHeader}>
          CONGRATULATIONS! Order Submitted
        </Text>
        <Text style={{ ...styles.settingsText, marginTop: 50 }}>
          {business_name}
        </Text>
        <Text style={{ ...styles.settingsText }}>
          Invoice Number{' '}
          <Text
            style={{
              ...styles.settingsText,
              fontSize: isLarge ? 35 : 28,
              color: Colors.primaryColor,
            }}>
            #{invoiceNumber}
          </Text>
        </Text>
      </View>

      <View style={{ flexDirection: 'row' }}>
        <GlobalButton
          onPress={async () => {
            await shareAsync(currentPdfUri, {
              UTI: '.pdf',
              mimeType: 'application/pdf',
            });
          }}
          title='Share'
          width={isLarge ? 200 : 155}
          color={Colors.xplight}
          fontColor={Colors.primaryColor}
        />
      </View>

      <FAB
        style={styles.fab}
        color={Colors.primaryColor}
        icon='home'
        onPress={() => {
          navigation.getParent()?.navigate('HomeDr');
        }}
      />
    </View>
  );
};

export const screenOptions = (navigator: ShareInvoiceScreensProps) => {
  return {
    headerTitle: 'Share invoice Screen',
  };
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.greyBackgroundColor,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  settingsHeaderWrapper: {
    marginVertical: isLarge ? 30 : 24,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsHeader: {
    fontFamily: FontNames.MyriadProRegular,
    fontSize: isLarge ? 30 : 24,
    textTransform: 'uppercase',
    color: Colors.primaryColor,
    marginBottom: isLarge ? 10 : 7,
  },
  settingsText: {
    fontFamily: FontNames.MyriadProRegular,
    fontSize: isLarge ? 20 : 15,
    textTransform: 'uppercase',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.xplight,
    color: Colors.primaryColor,
  },
});
export default ShareInvoiceScreen;
