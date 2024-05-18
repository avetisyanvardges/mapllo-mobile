import {StyleSheet, View} from 'react-native'
import MText from '../../../components/MText'

export default function StepHeader({stepNumber, title, subtitle}) {
  return (
    <View style={styles.container}>
      <MText style={styles.number}>{'0' + stepNumber}</MText>
      <MText style={styles.title}>{title}</MText>
      {/*<MText style={styles.subTitle}>{subtitle}</MText>*/}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 24,
  },
  number: {
    fontSize: 100,
    fontFamily: 'Montserrat_400Regular',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 3,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Montserrat_500Medium',
    color: '#fff',
    marginBottom: 25,
  },
  subTitle: {
    fontSize: 20,
    marginBottom: 10,
    color: '#fff',
  },
})
