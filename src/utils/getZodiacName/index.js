import {zodiacDates} from './data'

export const getSignByDate = birthDate => {
  const [_, month, day] = birthDate?.split('-')
  const date = new Date(`2000-${month}-${day}`)

  if (date.toString() === 'Invalid Date') {
    return -1
  }

  const signsData = Object.values(zodiacDates)

  let dateMin
  let dateMax
  const i = signsData.findIndex(sign => {
    dateMin = new Date(sign.dateMin)
    dateMax = new Date(sign.dateMax)

    return (
      (date.getDate() >= dateMin.getDate() &&
        date.getMonth() == dateMin.getMonth()) ||
      (date.getDate() <= dateMax.getDate() &&
        date.getMonth() === dateMax.getMonth())
    )
  })

  return signsData?.[i]?.icon
}
