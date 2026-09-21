export const safetyLimits = {
  oxygenMin: 19.5,
  co2Max: 5000,
  methaneMax: 1.0,
  temperatureMax: 40,
  humidityMax: 90,
  pressureMin: 90,
  pressureMax: 110,
}

export const evaluateSafety = (sensors) => {
  const alerts = []

  if (sensors.oxygen < safetyLimits.oxygenMin) {
    alerts.push(`Low Oxygen: ${sensors.oxygen}%`)
  }

  if (sensors.co2 > safetyLimits.co2Max) {
    alerts.push(`High CO₂: ${sensors.co2} ppm`)
  }

  if (sensors.methane > safetyLimits.methaneMax) {
    alerts.push(`High Methane: ${sensors.methane}%`)
  }

  if (sensors.temperature > safetyLimits.temperatureMax) {
    alerts.push(`High Temperature: ${sensors.temperature}°C`)
  }

  if (sensors.humidity > safetyLimits.humidityMax) {
    alerts.push(`High Humidity: ${sensors.humidity}%`)
  }

  if (
    sensors.pressure < safetyLimits.pressureMin ||
    sensors.pressure > safetyLimits.pressureMax
  ) {
    alerts.push(`Abnormal Air Pressure: ${sensors.pressure} kPa`)
  }

  return alerts
}