import React, {Fragment, useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {Modal, StyleSheet, TouchableOpacity, View} from 'react-native'

import {deviceInfo} from '../../assets/deviceInfo'
import {normalize} from '../../assets/normalize'
import MCityFilterInput from '../../components/MCityFilterInput'
import MDropdown from '../../components/MDropdown'
import MExpandButton from '../../components/MExpandButton'
import MSlider from '../../components/MSlider'
import MText from '../../components/MText'
import OptionsIcon from '../../icons/OptionsIcon'

export default function UserFilter({
  expanded,
  setExpanded,
  genderFilter,
  setGenderFilter,
  ageFilterLeft,
  setAgeFilterLeft,
  ageFilterRight,
  setAgeFilterRight,
  motivationFilter,
  setMotivationFilter,
  city,
  setCity,
  placeId,
  setPlaceId,
}) {
  const {t} = useTranslation()
  const [cityFilterFocused, setCityFilterFocused] = useState(false)
  const [expendWidth, setExpendWidth] = useState(300)
  const [expendHeight, setExpendHeight] = useState(normalize(270))
  useEffect(() => {
    if (!expanded) {
      setCityFilterFocused(false)
    }
  }, [expanded])

  useEffect(() => {
    if (cityFilterFocused) {
      setExpendWidth(deviceInfo.deviceWidth - normalize(40))
      setExpendHeight(normalize(33))
    } else {
      setExpendWidth(300)
      setExpendHeight(normalize(270))
    }
  }, [cityFilterFocused])

  const setValue = value => {
    setAgeFilterLeft(value[0])
    setAgeFilterRight(value[1])
  }

  return (
    <>
      <MExpandButton
        smallWidth={35}
        width={expendWidth}
        height={expendHeight}
        expanded={expanded}
        setExpanded={setExpanded}
        backgroundColor="#fff"
        button={
          <View style={styles.smallButton}>
            <OptionsIcon />
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
              <MText bold style={{marginVertical: 10}}>
                {t('interested_in')}
              </MText>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }}>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    genderFilter === 'FEMALE' ? styles.active : {},
                  ]}
                  onPress={() => setGenderFilter('FEMALE')}>
                  <MText
                    bold
                    style={genderFilter === 'FEMALE' ? styles.activeText : {}}>
                    {t('girls')}
                  </MText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    genderFilter === 'MALE' ? styles.active : {},
                  ]}
                  onPress={() => setGenderFilter('MALE')}>
                  <MText
                    bold
                    style={genderFilter === 'MALE' ? styles.activeText : {}}>
                    {t('guys')}
                  </MText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    genderFilter === 'ANY' ? styles.active : {},
                  ]}
                  onPress={() => setGenderFilter('ANY')}>
                  <MText
                    bold
                    style={genderFilter === 'ANY' ? styles.activeText : {}}>
                    {t('all')}
                  </MText>
                </TouchableOpacity>
              </View>
              <MText bold style={{marginBottom: 20}}>
                {t('age')}
              </MText>
              <MSlider
                left={ageFilterLeft}
                right={ageFilterRight}
                setVal={setValue}
              />
              <MDropdown
                values={[
                  {text: t('find_entertainment'), val: 'FIND_ENTERTAINMENT'},
                  {text: t('find_friends'), val: 'FIND_PEOPLE'},
                  {text: t('any_motivation'), val: 'ANY'},
                ]}
                val={motivationFilter}
                setVal={v => setMotivationFilter(v)}
              />
            </>
          ) : null}
        </View>
      </MExpandButton>
    </>
  )
}
const styles = StyleSheet.create({
  activeText: {
    color: '#fff',
  },
  active: {
    backgroundColor: '#A347FF',
  },
  genderButton: {
    backgroundColor: '#F3F3F3',
    paddingHorizontal: 23,
    paddingVertical: 10,
    borderRadius: 10,
  },
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
    padding: 10,
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
