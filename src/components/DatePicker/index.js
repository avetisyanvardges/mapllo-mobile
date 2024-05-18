import moment from 'moment'
import {useEffect, useState} from 'react'
import {View} from 'react-native'

import {normalize} from '../../assets/normalize'
import Picker from '../Picker/Picker'

const endYear = moment().year() - 18
const startYear = 1950

// Generate days (assuming 31 days for simplicity, you might need to adjust based on month and year)
const days = []
for (let day = 1; day <= 31; day++) {
  days.push({value: day, label: `${day}`})
}

const months = moment.months().map((month, index) => ({
  value: index,
  label: month,
}))

const years = Array.from({length: endYear - startYear + 1}, (_, i) => ({
  value: endYear - i,
  label: `${endYear - i}`,
}))

const DatePicker = ({value, onChange}) => {
  const [selectedYear, setSelectedYear] = useState(0)
  const [selectedMonth, setSelectedMonth] = useState(0) // 0-based index for January
  const [days, setDays] = useState([])
  const [selectedDay, setSelectedDay] = useState(0) // 0-based index for January
  const findDayIndex = days.findIndex(day => {
    return day.label === moment(value).format('DD')
  })
  const findMonthIndex = months.findIndex(month => {
    return month.label === moment(value).format('MMMM')
  })
  const findYearIndex = years.findIndex(year => {
    return year.label === moment(value).format('YYYY')
  })

  useEffect(() => {
    const daysInMonth = moment({
      year: selectedYear,
      month: selectedMonth,
    }).daysInMonth()
    const daysArray = Array.from({length: daysInMonth}, (_, i) => ({
      value: i + 1,
      label: `${i + 1}`,
    }))
    setDays(daysArray)

    setDays(daysArray)
  }, [selectedYear, selectedMonth])

  useEffect(() => {
    if (
      days?.[selectedDay] &&
      months?.[selectedMonth] &&
      years?.[selectedYear]
    ) {
      onChange(
        moment(
          `${days?.[selectedDay]?.label}-${months?.[selectedMonth]?.label}-${years?.[selectedYear]?.label}`,
          'DD-MMMM-YYYY',
        ),
      )
    }
  }, [selectedDay, selectedYear, selectedMonth])

  useEffect(() => {
    console.log(findDayIndex, selectedDay)
    if (findDayIndex && findDayIndex >= 0 && !selectedDay) {
      setSelectedDay(findDayIndex)
    }
  }, [findDayIndex])

  useEffect(() => {
    if (findMonthIndex && findMonthIndex >= 0 && !selectedMonth) {
      setSelectedMonth(findMonthIndex)
    }
  }, [findMonthIndex])

  useEffect(() => {
    if (findYearIndex && findYearIndex >= 0 && !selectedYear) {
      setSelectedYear(findYearIndex)
    }
  }, [findYearIndex])

  return (
    <View style={{marginVertical: normalize(10)}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 998,
        }}>
        <Picker
          itemHeight={normalize(38)}
          values={days}
          selected={selectedDay}
          onIndexChange={index => setSelectedDay(index)}
        />
        <View style={{}}>
          <Picker
            values={months}
            selected={selectedMonth}
            itemHeight={normalize(38)}
            onIndexChange={index => setSelectedMonth(index)}
          />
        </View>
        <Picker
          values={years}
          selected={selectedYear}
          itemHeight={normalize(38)}
          onIndexChange={index => setSelectedYear(index)}
        />
      </View>
      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: normalize(38),
          backgroundColor: '#A347FF',
          top: normalize(38),
          borderRadius: normalize(10),
          zIndex: 1,
        }}
      />
    </View>
  )
}

export default DatePicker
