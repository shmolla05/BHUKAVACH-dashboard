import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export const generateMissionReport = ({
  missionHistory,
  missionAlerts,
  sensorData,
  missionSeconds,
}) => {
  const doc = new jsPDF()

  const formatMissionTime = () => {
    const hours = Math.floor(missionSeconds / 3600)

    const minutes = Math.floor(
      (missionSeconds % 3600) / 60
    )

    const seconds = missionSeconds % 60

    return `${String(hours).padStart(2, '0')}:${String(
      minutes
    ).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  const formatMissionSeconds = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60

    return `${String(minutes).padStart(2, '0')}:${String(
      seconds
    ).padStart(2, '0')}`
  }

  const reportDate = new Date().toLocaleString()

  doc.setFontSize(20)
  doc.text('BHUKAVACH MISSION REPORT', 14, 20)

  doc.setFontSize(11)
  doc.text(`Mission Date: ${reportDate}`, 14, 30)
  doc.text(`Mission Duration: ${formatMissionTime()}`, 14, 37)
  doc.text(
    `Recorded Data Points: ${missionHistory.length}`,
    14,
    44
  )

  doc.setFontSize(14)
  doc.text('Mission Summary', 14, 56)

  const latestData =
    missionHistory.length > 0
      ? missionHistory[missionHistory.length - 1]
      : sensorData

  const recordedData =
    missionHistory.length > 0
      ? missionHistory
      : [sensorData]

  const getStatistics = (key) => {
    const values = recordedData.map((item) =>
      Number(item[key])
    )

    const min = Math.min(...values)
    const max = Math.max(...values)
    const average =
      values.reduce((sum, value) => sum + value, 0) /
      values.length

    return {
      min,
      max,
      average,
    }
  }

  const statistics = [
    ['Oxygen (O₂)', '%', getStatistics('oxygen')],
    ['Carbon Dioxide (CO₂)', 'ppm', getStatistics('co2')],
    ['Methane (CH₄)', '%', getStatistics('methane')],
    ['Temperature', '°C', getStatistics('temperature')],
    ['Humidity', '%', getStatistics('humidity')],
    ['Air Pressure', 'kPa', getStatistics('pressure')],
  ]

  autoTable(doc, {
    startY: 62,
    head: [['Parameter', 'Value']],
    body: [
      ['Oxygen (O₂)', `${latestData.oxygen}%`],
      ['Carbon Dioxide (CO₂)', `${latestData.co2} ppm`],
      ['Methane (CH₄)', `${latestData.methane}%`],
      ['Temperature', `${latestData.temperature} °C`],
      ['Humidity', `${latestData.humidity}%`],
      ['Air Pressure', `${latestData.pressure} kPa`],
    ],
  })

  const statisticsStartY =
    doc.lastAutoTable.finalY + 12

  doc.setFontSize(14)
  doc.text(
    'Mission Statistics',
    14,
    statisticsStartY
  )

  const statisticsRows = statistics.map(
    ([parameter, unit, values]) => [
      parameter,
      `${values.min.toFixed(2)} ${unit}`,
      `${values.max.toFixed(2)} ${unit}`,
      `${values.average.toFixed(2)} ${unit}`,
    ]
  )

  autoTable(doc, {
    startY: statisticsStartY + 5,
    head: [
      ['Parameter', 'Minimum', 'Maximum', 'Average'],
    ],
    body: statisticsRows,
    styles: {
      fontSize: 8,
    },
  })

  const alertStartY =
    doc.lastAutoTable.finalY + 15

  doc.setFontSize(14)
  doc.text('Mission Alerts', 14, alertStartY)

  if (missionAlerts.length === 0) {
    doc.setFontSize(10)

    doc.text(
      'NO SAFETY ALERTS RECORDED DURING THE MISSION',
      14,
      alertStartY + 8
    )
  } else {
    const alertRows = []

    missionAlerts.forEach((event) => {
      event.alerts.forEach((alert) => {
        alertRows.push([
          formatMissionSeconds(event.time),
          alert,
        ])
      })
    })

    autoTable(doc, {
      startY: alertStartY + 5,
      head: [['Mission Time', 'Alert']],
      body: alertRows,
    })
  }

  let dataStartY

  if (missionAlerts.length === 0) {
    dataStartY = alertStartY + 28
  } else {
    dataStartY =
      doc.lastAutoTable.finalY + 20
  }

  doc.setFontSize(14)
  doc.text('Mission Data', 14, dataStartY)

  const dataRows = missionHistory.map((data) => [
    formatMissionSeconds(data.time),
    data.oxygen,
    data.co2,
    data.methane,
    data.temperature,
    data.humidity,
    data.pressure,
  ])

  autoTable(doc, {
    startY: dataStartY + 5,
    head: [[
      'Time',
      'O₂ %',
      'CO₂ ppm',
      'CH₄ %',
      'Temp °C',
      'Humidity %',
      'Pressure kPa',
    ]],
    body: dataRows,
    styles: {
      fontSize: 7,
    },
  })

   const addParameterGraph = ({
    title,
    key,
    unit,
    startY,
    }) => {
    if (missionHistory.length === 0) {
      return
    }

    const graphStartX = 30
    const graphStartY = startY
    const graphWidth = 155
    const graphHeight = 60

    const values = missionHistory.map(
      (data) => Number(data[key])
    )

    const actualMin = Math.min(...values)
    const actualMax = Math.max(...values)

    let graphMin
    let graphMax

    if (actualMin === actualMax) {
      graphMin = actualMin - 1
      graphMax = actualMax + 1
    } else {
      const range = actualMax - actualMin
      const padding = Math.max(range * 0.1, 1)

      graphMin = actualMin - padding
      graphMax = actualMax + padding
    }

    const graphRange = graphMax - graphMin

    doc.setFontSize(14)
    doc.setTextColor(0, 0, 0)
    doc.text(title, 14, graphStartY - 8)

    doc.setDrawColor(120, 120, 120)

    doc.rect(
      graphStartX,
      graphStartY,
      graphWidth,
      graphHeight
    )

    doc.setFontSize(7)

    for (let i = 0; i <= 4; i++) {
      const ratio = i / 4

      const y =
        graphStartY +
        graphHeight -
        ratio * graphHeight

      const value =
        graphMin + ratio * graphRange

      doc.setDrawColor(220, 220, 220)

      if (i > 0 && i < 4) {
        doc.line(
          graphStartX,
          y,
          graphStartX + graphWidth,
          y
        )
      }

      doc.setTextColor(40, 40, 40)

      doc.text(
        `${value.toFixed(2)} ${unit}`,
        8,
        y + 2
      )
    }

    const totalPoints = missionHistory.length

    const timePositions = [
      0,
      Math.floor((totalPoints - 1) / 2),
      totalPoints - 1,
    ]

    timePositions.forEach((index) => {
      const data = missionHistory[index]

      const x =
        totalPoints === 1
          ? graphStartX
          : graphStartX +
            (index / (totalPoints - 1)) *
              graphWidth

      const timeLabel =
        formatMissionSeconds(data.time)

      doc.setFontSize(7)
      doc.setTextColor(40, 40, 40)

      doc.text(
        timeLabel,
        x - 8,
        graphStartY + graphHeight + 8
      )

      doc.setDrawColor(150, 150, 150)

      doc.line(
        x,
        graphStartY + graphHeight,
        x,
        graphStartY + graphHeight + 3
      )
    })

    doc.setFontSize(8)

    doc.text(
      'Mission Time',
      graphStartX + 65,
      graphStartY + graphHeight + 17
    )

    doc.setDrawColor(80, 80, 80)
    doc.setLineWidth(1)

    for (
      let i = 0;
      i < missionHistory.length - 1;
      i++
    ) {
      const current = missionHistory[i]
      const next = missionHistory[i + 1]

      const x1 =
        graphStartX +
        (i / (missionHistory.length - 1)) *
          graphWidth

      const x2 =
        graphStartX +
        ((i + 1) /
          (missionHistory.length - 1)) *
          graphWidth

      const y1 =
        graphStartY +
        graphHeight -
        ((Number(current[key]) - graphMin) /
          graphRange) *
          graphHeight

      const y2 =
        graphStartY +
        graphHeight -
        ((Number(next[key]) - graphMin) /
          graphRange) *
          graphHeight

      doc.line(x1, y1, x2, y2)
    }

    doc.setLineWidth(1)
  }

  doc.addPage()

  addParameterGraph({
  title: 'Oxygen (O₂) Trend',
  key: 'oxygen',
  unit: '%',
  startY: 25,
})

  addParameterGraph({
    title: 'Carbon Dioxide (CO₂) Trend',
    key: 'co2',
    unit: 'ppm',
    startY: 125,
  })

  doc.addPage()

  addParameterGraph({
    title: 'Methane (CH₄) Trend',
    key: 'methane',
    unit: '%',
    startY: 25,
  })

  addParameterGraph({
    title: 'Temperature Trend',
    key: 'temperature',
    unit: '°C',
    startY: 125,
  })

  doc.addPage()

  addParameterGraph({
    title: 'Humidity Trend',
    key: 'humidity',
    unit: '%',
    startY: 25,
  })

  addParameterGraph({
    title: 'Air Pressure Trend',
    key: 'pressure',
    unit: 'kPa',
    startY: 125,
  })

  doc.save('BHUKAVACH-Mission-Report.pdf')
}