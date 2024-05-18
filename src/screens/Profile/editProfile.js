import * as Haptics from 'expo-haptics'
import * as React from 'react'
import {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import {useScrollHandlers} from 'react-native-actions-sheet'
import {ScrollView} from 'react-native-gesture-handler'
import {useDispatch} from 'react-redux'

import {deviceInfo} from '../../assets/deviceInfo'
import {normalize} from '../../assets/normalize'
import MCheckbox from '../../components/MCheckbox'
import MDateInput from '../../components/MDateInput'
import MInput from '../../components/MInput'
import MSelectBox from '../../components/MSelectBox'
import MText from '../../components/MText'
import {isUsernameFree, updateProfileInfo} from '../../configs/api'
import InstagramIcon from '../../icons/InstagramIcon'
import VkIcon from '../../icons/VkIcon'
import {updateProfile} from '../../slices/authReducer'
export default function EditProfile({
  username,
  name,
  gender,
  birthday,
  about,
  motivations,
  instagram,
  vk,
  onUpdate,
  sheetRef,
}) {
  const [usernameFinal, setUsernameFinal] = useState(username)
  const [usernameUnvalidated, setUsernameUnvalidated] = useState(username)
  const [nameChanged, setNameChanged] = useState(name)
  const [genderChanged, setGenderChanged] = useState(gender)
  const [birthdayChanged, setBirthdayChanged] = useState(new Date(birthday))
  const [motivationsChanged, setMotivationsChanged] = useState(motivations)
  const [aboutMe, setAboutMe] = useState(about)
  const [instagramChanged, setInstagramChanged] = useState(instagram)
  const [vkChanged, setVkChanged] = useState(vk)
  const [visible, setVisible] = useState(false)

  const scrollHandlers = useScrollHandlers('scrollview-1', sheetRef)

  const [usernameErrors, setUsernameErrors] = useState([])
  const [usernameInfo, setUsernameInfo] = useState([])

  const {t} = useTranslation()
  const dispatch = useDispatch()

  const eighteenYearsAgo = new Date()
  const minBirthday = new Date(
    eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18),
  )

  const isUsernameCorrect = () => {
    const errors = []
    if (
      !usernameUnvalidated.match('^.*[a-zA-Z].*[a-zA-Z].*[a-zA-Z].*$') &&
      usernameUnvalidated.length >= 4
    ) {
      errors.push(t('UnauthorizedStack.Register.usernameMinLettersValidation'))
    }
    if (!usernameUnvalidated.match('^[a-zA-Z0-9\\-\\_]*$')) {
      errors.push(t('UnauthorizedStack.Register.usernameSymbolsValidation'))
    }
    if (
      (usernameUnvalidated.length > 0 && usernameUnvalidated.length < 4) ||
      usernameUnvalidated.length > 16
    ) {
      errors.push(t('UnauthorizedStack.Register.usernameLengthValidation'))
    }
    return errors
  }

  useEffect(() => {
    if (usernameUnvalidated !== usernameFinal) {
      setUsernameFinal(null)
    }
    const validationErrors = isUsernameCorrect(usernameUnvalidated)
    if (validationErrors.length > 0) {
      setUsernameInfo([])
      setUsernameErrors(validationErrors)
    } else {
      setUsernameInfo([])
      setUsernameErrors([])
      const timeout = setTimeout(
        () =>
          isUsernameFree(usernameUnvalidated)
            .then(r => {
              setUsernameErrors([])
              setUsernameInfo([
                t('UnauthorizedStack.Register.usernameFreeValidation'),
              ])
              setUsernameFinal(usernameUnvalidated)
            })
            .catch(e => {
              if (e.response.status === 400) {
                setUsernameErrors([
                  t('UnauthorizedStack.Register.usernameUniqueValidation'),
                ])
                setUsernameInfo([])
              }
            }),
        500,
      )
      return () => clearTimeout(timeout)
    }
  }, [usernameUnvalidated])

  const switchMotivation = m => {
    if (motivationsChanged.includes(m)) {
      setMotivationsChanged(motivationsChanged.filter(item => item !== m))
    } else {
      setMotivationsChanged([...motivationsChanged, m])
    }
  }

  const save = () => {
    Haptics.selectionAsync()
    updateProfileInfo({
      username: usernameUnvalidated,
      name: nameChanged,
      gender: genderChanged,
      birthday: birthdayChanged,
      motivations: motivationsChanged,
      aboutMe,
      instagram: instagramChanged,
      vk: vkChanged,
    })
      .then(r => dispatch(updateProfile(r.data)))
      .then(() => onUpdate())
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={
          deviceInfo?.ios ? normalize(60) : normalize(170)
        }
        behavior="height">
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          {...scrollHandlers}>
          <Pressable>
            <MInput
              placeholder="UnauthorizedStack.Register.username"
              style={{marginTop: 20, marginBottom: 5}}
              withEmptyLine
              value={usernameUnvalidated}
              setValue={setUsernameUnvalidated}
              errors={usernameErrors}
              info={usernameInfo}
            />
            <MInput
              placeholder="UnauthorizedStack.Register.name"
              style={{marginBottom: 15}}
              value={nameChanged}
              setValue={setNameChanged}
            />
            <MDateInput
              placeholder="UnauthorizedStack.Register.birthday"
              style={{marginBottom: 15}}
              maxDate={minBirthday}
              value={birthdayChanged}
              setValue={setBirthdayChanged}
              visible={visible}
              setVisible={setVisible}
            />
            <MInput
              placeholder="UnauthorizedStack.Register.about"
              style={{marginBottom: 15}}
              multiline
              value={aboutMe}
              setValue={setAboutMe}
            />
            <View style={styles.genderContainer}>
              <MText style={styles.genderLabel}>
                {t('Profile.Edit.gender')}
              </MText>
              <View style={styles.genderInnerContainer}>
                <MCheckbox
                  style={styles.genderCheckbox}
                  checked={genderChanged === 'MALE'}
                  setChecked={() => setGenderChanged('MALE')}
                />
                <TouchableOpacity
                  style={styles.genderBox}
                  onPress={() => setGenderChanged('MALE')}>
                  <MText>{t('Profile.Edit.gender.male')}</MText>
                </TouchableOpacity>
                <MCheckbox
                  style={styles.genderCheckbox}
                  checked={genderChanged === 'FEMALE'}
                  setChecked={() => setGenderChanged('FEMALE')}
                />
                <TouchableOpacity
                  style={styles.genderBox}
                  onPress={() => setGenderChanged('FEMALE')}>
                  <MText>{t('Profile.Edit.gender.female')}</MText>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.motivations}>
              <MSelectBox
                text={t('motivations.FIND_PEOPLE')}
                active={motivationsChanged.includes('FIND_PEOPLE')}
                switchActive={() => switchMotivation('FIND_PEOPLE')}
                style={{flex: 1}}
              />
              <View style={{width: 20}} />
              <MSelectBox
                text={t('motivations.FIND_ENTERTAINMENT')}
                active={motivationsChanged.includes('FIND_ENTERTAINMENT')}
                switchActive={() => switchMotivation('FIND_ENTERTAINMENT')}
                style={{flex: 1}}
              />
            </View>
            <View style={styles.motivationsHintContainer}>
              <MText style={styles.motivationsHintStar}>{'* '}</MText>
              <MText style={styles.motivationsHint}>
                {t('UnauthorizedStack.Register.motivationHint')}
              </MText>
            </View>
            <View style={styles.socialsContainer}>
              <View style={styles.socialContainer}>
                <View style={styles.socialIcon}>
                  <VkIcon color="#818195" />
                </View>
                <MInput
                  placeholder="Profile.Edit.social.username"
                  value={vkChanged}
                  setValue={setVkChanged}
                  style={{flex: 1}}
                />
              </View>
              <View style={styles.socialContainer}>
                <View style={styles.socialIcon}>
                  <InstagramIcon color="#818195" />
                </View>
                <MInput
                  placeholder="Profile.Edit.social.username"
                  value={instagramChanged}
                  setValue={setInstagramChanged}
                  style={{flex: 1}}
                />
              </View>
            </View>
          </Pressable>
        </ScrollView>
        <TouchableOpacity
          style={
            usernameFinal === null ? styles.nextButton : styles.nextButtonActive
          }
          onPress={save}
          disabled={usernameFinal === null}>
          <MText style={styles.nextButtonText}>{t('apply')}</MText>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  nextButton: {
    height: 38,
    marginBottom: 10,
    backgroundColor: '#818195',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonActive: {
    height: 38,
    backgroundColor: '#A347FF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  nextButtonText: {
    color: '#fff',
  },
  socialsContainer: {
    marginBottom: 10,
  },
  socialContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  socialIcon: {
    minWidth: 50,
  },
  motivations: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 10,
  },
  motivationsHintContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  motivationsHintStar: {
    color: 'red',
  },
  motivationsHint: {
    color: '#818195',
  },
  genderBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  genderCheckbox: {
    marginHorizontal: 5,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginBottom: 20,
  },
  genderLabel: {
    color: '#818195',
  },
  genderInnerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  container: {
    marginHorizontal: 20,
  },
})
