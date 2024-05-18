import * as Haptics from 'expo-haptics'
import moment from 'moment'
import * as React from 'react'
import {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  View,
} from 'react-native'

import MDateInput from '../../../components/MDateInput'
import MInput from '../../../components/MInput'
import {isUsernameFree} from '../../../configs/api'

export default function RegistrationGeneralInfoStep({
  username,
  setUsername,
  birthday,
  setBirthday,
  gender,
  setGender,
  visible,
  setVisible,
}) {
  const {t} = useTranslation()
  const [usernameUnvalidated, setUsernameUnvalidated] = useState(
    username ? username : '',
  )
  const [usernameErrors, setUsernameErrors] = useState([])
  const [usernameInfo, setUsernameInfo] = useState([])

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
    if (usernameUnvalidated !== username) {
      setUsername(null)
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
              setUsername(usernameUnvalidated)
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
  return (
    <View>
      <MInput
        placeholder="UnauthorizedStack.Register.username"
        style={{marginVertical: 10}}
        value={usernameUnvalidated}
        setValue={setUsernameUnvalidated}
        errors={usernameErrors}
        info={usernameInfo}
      />
      <MDateInput
        placeholder="UnauthorizedStack.Register.birthday"
        maxDate={minBirthday}
        value={birthday}
        setValue={setBirthday}
        visible={visible}
        setVisible={setVisible}
      />

      {!visible ? (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginVertical: 37,
          }}>
          <TouchableWithoutFeedback
            onPress={() => {
              Haptics.selectionAsync().then(() => setGender('FEMALE'))
            }}>
            <Image
              style={{height: 100, width: 100}}
              source={
                gender === 'FEMALE'
                  ? require('../../../../assets/woman_selected.jpg')
                  : require('../../../../assets/woman.jpg')
              }
            />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              Haptics.selectionAsync().then(() => setGender('MALE'))
            }}>
            <Image
              style={{height: 100, width: 100}}
              source={
                gender === 'MALE'
                  ? require('../../../../assets/man_selected.jpg')
                  : require('../../../../assets/man.jpg')
              }
            />
          </TouchableWithoutFeedback>
        </View>
      ) : null}
    </View>
  )
}
