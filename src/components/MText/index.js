import {StyleSheet, Text} from 'react-native'

export default function MText(props) {
  const customStyles = []
  if (props.bold) {
    customStyles.push(styles.boldText)
  }
  if (props.boldbold) {
    customStyles.push(styles.boldboldText)
  }
  if (customStyles.length === 0) {
    customStyles.push(styles.text)
  }
  return (
    <Text
      {...props}
      allowFontScaling={false}
      style={[customStyles, props.style]}
    />
  )
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
  },
  boldText: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 12,
  },
  boldboldText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 12,
  },
})
