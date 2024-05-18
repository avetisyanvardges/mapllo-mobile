import {Divider, Switch} from '@rneui/base'
import React, {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {StyleSheet, TouchableOpacity, View} from 'react-native'

import {deviceInfo} from '../../assets/deviceInfo'
import {normalize} from '../../assets/normalize'
import MCityFilterInput from '../../components/MCityFilterInput'
import MExpandButton from '../../components/MExpandButton'
import MText from '../../components/MText'
import OptionsIcon from '../../icons/OptionsIcon'

export default function EventFilter({
  expanded,
  setExpanded,
  showEvents,
  setShowEvents,
  showPosters,
  setShowPosters,
  dateFilter,
  setDateFilter,
  ownEvents,
  setOwnEvents,
  city,
  setCity,
  placeId,
  setPlaceId,
  menuExpanded,
}) {
  const {t} = useTranslation()
  const [cityFilterFocused, setCityFilterFocused] = useState(false)
  const [expendWidth, setExpendWidth] = useState(220)
  const [expendHeight, setExpendHeight] = useState(normalize(270))
  useEffect(() => {
    if (!expanded) {
      setCityFilterFocused(false)
    }
  }, [expanded])

  useEffect(() => {
    if (menuExpanded) {
      setExpanded(false)
    }
  }, [menuExpanded])

  useEffect(() => {
    if (cityFilterFocused) {
      setExpendWidth(deviceInfo.deviceWidth - normalize(40))
      setExpendHeight(normalize(33))
    } else {
      setExpendWidth(220)
      setExpendHeight(normalize(270))
    }
  }, [cityFilterFocused])

  return (
    <MExpandButton
      smallWidth={35}
      width={expendWidth}
      height={expendHeight}
      expanded={expanded}
      setExpanded={setExpanded}
      backgroundColor="#fff"
      button={
        <View style={styles.smallButton}>
          <OptionsIcon size={15.43} />
        </View>
      }>
      <View
        style={[
          styles.container,
          {
            paddingHorizontal: cityFilterFocused ? 0 : 15,
            paddingVertical: cityFilterFocused ? 0 : 5,
          },
        ]}>
        <View
          style={[
            styles.cityInputContainer,
            {marginVertical: cityFilterFocused ? 0 : 10},
          ]}>
          <MCityFilterInput
            style={styles.city}
            value={city}
            setValue={setCity}
            placeId={placeId}
            setPlaceId={setPlaceId}
            filters
            setFocused={setCityFilterFocused}
            focused={cityFilterFocused}
            setExpanded={setExpanded}
          />
        </View>
        {!cityFilterFocused ? (
          <>
            <View style={[styles.item]}>
              <MText bold>{t('events')}</MText>
              <Switch
                color="#A347FF"
                value={showEvents}
                onValueChange={v => setShowEvents(v)}
              />
            </View>
            <Divider style={styles.divider} />
            <View style={styles.item}>
              <MText bold>{t('posters')}</MText>
              <Switch
                color="#A347FF"
                value={showPosters}
                onValueChange={v => setShowPosters(v)}
              />
            </View>
            <Divider style={styles.divider} />
            <TouchableOpacity
              style={styles.item}
              onPress={() => setDateFilter('any')}>
              <MText
                bold
                style={dateFilter === 'any' ? styles.highlighted : ''}>
                {t('any_day')}
              </MText>
            </TouchableOpacity>
            <Divider style={styles.divider} />
            <TouchableOpacity
              style={styles.item}
              onPress={() => setDateFilter('today')}>
              <MText
                bold
                style={dateFilter === 'today' ? styles.highlighted : ''}>
                {t('today')}
              </MText>
            </TouchableOpacity>
            <Divider style={styles.divider} />
            <TouchableOpacity
              style={styles.item}
              onPress={() => setDateFilter('weekend')}>
              <MText
                bold
                style={dateFilter === 'weekend' ? styles.highlighted : ''}>
                {t('this_weekend')}
              </MText>
            </TouchableOpacity>
            <Divider style={styles.divider} />
            <TouchableOpacity
              style={styles.item}
              onPress={() => setOwnEvents(!ownEvents)}>
              <MText bold style={ownEvents ? styles.highlighted : ''}>
                {t('own_events')}
              </MText>
            </TouchableOpacity>
          </>
        ) : null}
      </View>
    </MExpandButton>
  )
}
const styles = StyleSheet.create({
  container: {},
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
    padding: 10.29,
    borderRadius: 20,
  },
  highlighted: {
    color: '#A347FF',
  },
  cityInputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  city: {
    width: '100%',
  },
})
