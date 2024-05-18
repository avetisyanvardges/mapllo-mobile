import {Divider} from '@rneui/base'
import React from 'react'
import {useTranslation} from 'react-i18next'
import {StyleSheet, TouchableOpacity, View} from 'react-native'

import MExpandButton from '../../components/MExpandButton'
import MText from '../../components/MText'
import PenIcon from '../../icons/PenIcon'
import {navigate} from '../../services/NavigationService'

export default function ProfileMenu({expanded, setExpanded, show, editPhoto}) {
  const {t} = useTranslation()

  return (
    <MExpandButton
      smallWidth={35}
      width={220}
      height={70}
      expanded={expanded}
      setExpanded={setExpanded}
      backgroundColor="rgba(16,16,34,0.4)"
      button={
        <View style={styles.smallButton}>
          <PenIcon />
        </View>
      }>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            setExpanded(false)
            show()
          }}>
          <MText style={styles.editListItem}>{t('Profile.editInfo')}</MText>
        </TouchableOpacity>
        <Divider style={styles.divider} />
        <TouchableOpacity
          onPress={() => {
            editPhoto()
            setExpanded(false)
          }}>
          <MText style={styles.editListItem}>{t('Profile.editPhoto')}</MText>
        </TouchableOpacity>
      </View>
    </MExpandButton>
  )
}
const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 28,
  },
  divider: {
    marginVertical: 5,
  },
  smallButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    width: 35,
    height: 35,
  },
  editListItem: {
    fontSize: 12,
    paddingVertical: 4,
    color: '#2c2c2c',
  },
})
