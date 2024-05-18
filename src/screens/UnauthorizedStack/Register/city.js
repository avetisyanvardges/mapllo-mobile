import MCityInput from '../../../components/MCityInput'
import {Linking, StyleSheet, View} from 'react-native'
import {useTranslation} from 'react-i18next'
import MCheckbox from '../../../components/MCheckbox'
import CompasIcon from '../../../icons/CompasIcon'
import {fsUrl} from '../../../configs/constants'
import MText from '../../../components/MText'
import MSelectBox from '../../../components/MSelectBox'
import CompasSimpleIcon from '../../../icons/CompasSimpleIcon'

export default function RegistrationCityStep({
  motivations,
  setMotivations,
  showLocation,
  setShowLocation,
  accepted,
  setAccepted,
  city,
  setCity,
  placeId,
  setPlaceId,
}) {
  const {t} = useTranslation()

  const pickPrivacyFile = () => {
    Linking.openURL(fsUrl + '/docs/privacy.pdf')
  }

  const pickTermsFile = () => {
    Linking.openURL(fsUrl + '/docs/terms.pdf')
  }

  const switchMotivation = m => {
    if (motivations.includes(m)) {
      setMotivations(motivations.filter(item => item !== m))
    } else {
      setMotivations([...motivations, m])
    }
  }

  return (
    <View>
      <View style={styles.cityInputContainer}>
        <MCityInput
          style={styles.city}
          value={city}
          setValue={setCity}
          placeId={placeId}
          setPlaceId={setPlaceId}
        />
      </View>
      <View style={styles.motivations}>
        <MSelectBox
          text={t('motivations.FIND_PEOPLE')}
          active={motivations.includes('FIND_PEOPLE')}
          switchActive={() => switchMotivation('FIND_PEOPLE')}
          style={{flex: 1}}
        />
        <View style={{width: 20}} />
        <MSelectBox
          text={t('motivations.FIND_ENTERTAINMENT')}
          active={motivations.includes('FIND_ENTERTAINMENT')}
          switchActive={() => switchMotivation('FIND_ENTERTAINMENT')}
          style={{flex: 1}}
        />
      </View>
      <View style={styles.motivationsHintContainer}>
        <MText style={styles.motivationsHintStar}>{'*'}</MText>
        <MText style={styles.motivationsHint}>
          {t('UnauthorizedStack.Register.motivationHint')}
        </MText>
      </View>
      <View style={styles.showMap}>
        <MCheckbox
          checked={showLocation}
          setChecked={setShowLocation}
          style={styles.checkbox}
        />
        <MText>{t('UnauthorizedStack.Register.showMap')}</MText>
        {showLocation ? (
          <CompasSimpleIcon active={true} style={styles.showMapCompas} />
        ) : (
          <CompasIcon style={styles.showMapCompas} />
        )}
      </View>
      <View style={styles.accept}>
        <MCheckbox
          checked={accepted}
          setChecked={setAccepted}
          style={styles.checkbox}
        />
        <MText>
          {t('UnauthorizedStack.Register.acceptSquare')}
          <MText style={styles.docLink} onPress={pickTermsFile}>
            {t('UnauthorizedStack.Register.tos')}
          </MText>
          {' & '}
          <MText style={styles.docLink} onPress={pickPrivacyFile}>
            {t('UnauthorizedStack.Register.pp')}
          </MText>
        </MText>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
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
    fontSize: 10,
  },
  motivationsHint: {
    color: '#818195',
    fontSize: 10,
  },
  cityInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  docLink: {
    textDecorationLine: 'underline',
  },
  checkbox: {
    padding: 0,
    marginRight: 10,
  },
  accept: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginBottom: 20,
  },
  showMap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 5,
  },
  showMapCompas: {
    marginLeft: 10,
  },
  city: {
    marginBottom: 20,
    flex: 1,
  },
})
