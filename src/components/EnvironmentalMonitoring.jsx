import SensorCard from './SensorCard'

const EnvironmentalMonitoring = ({
  sensorData,
  safetyStatus,
}) => {
  return (
    <section className="monitoring-section">

      <div className="panel">

        <div className="panel-header">

          <h2>
            ENVIRONMENTAL MONITORING
          </h2>

          <span>
            LIVE DATA
          </span>

        </div>

        <div className="sensor-grid">

          <SensorCard
            label="O₂"
            value={sensorData.oxygen}
            unit="%"
            danger={safetyStatus.oxygen}
          />

          <SensorCard
            label="CO₂"
            value={sensorData.co2}
            unit="ppm"
            danger={safetyStatus.co2}
          />

          <SensorCard
            label="CH₄"
            value={sensorData.methane}
            unit="%"
            danger={safetyStatus.methane}
          />

          <SensorCard
            label="TEMPERATURE"
            value={sensorData.temperature}
            unit="°C"
            danger={safetyStatus.temperature}
          />

          <SensorCard
            label="HUMIDITY"
            value={sensorData.humidity}
            unit="%"
            danger={safetyStatus.humidity}
          />

          <SensorCard
            label="AIR PRESSURE"
            value={sensorData.pressure}
            unit="kPa"
            danger={safetyStatus.pressure}
          />

        </div>

      </div>

    </section>
  )
}

export default EnvironmentalMonitoring