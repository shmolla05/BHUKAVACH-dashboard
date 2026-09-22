const SensorInputPanel = ({
  roverActive,
  sensorData,
  setSensorData,
}) => {
  return (
    <section className="sensor-input-section">

      <div className="panel">

        <div className="panel-header">

          <h2>
            PROTOTYPE SENSOR INPUT
          </h2>

          <span>
            {roverActive
              ? 'MANUAL DATA'
              : 'ROVER INACTIVE'}
          </span>

        </div>

        <div className="sensor-input-grid">

          {/* OXYGEN */}
          <div className="sensor-control">

            <button
              disabled={!roverActive}
              onClick={() =>
                setSensorData({
                  ...sensorData,
                  oxygen: Number(
                    Math.max(
                      0,
                      sensorData.oxygen - 0.1
                    ).toFixed(1)
                  ),
                })
              }
            >
              −
            </button>

            <input
              className="sensor-value"
              type="number"
              step="0.1"
              value={sensorData.oxygen}
              disabled={!roverActive}
              onChange={(e) =>
                setSensorData({
                  ...sensorData,
                  oxygen: Number(e.target.value),
                })
              }
            />

            <button
              disabled={!roverActive}
              onClick={() =>
                setSensorData({
                  ...sensorData,
                  oxygen: Number(
                    (sensorData.oxygen + 0.1).toFixed(1)
                  ),
                })
              }
            >
              +
            </button>

          </div>

          {/* CO2 */}
          <div className="sensor-control">

            <button
              disabled={!roverActive}
              onClick={() =>
                setSensorData({
                  ...sensorData,
                  co2: Math.max(0, sensorData.co2 - 10),
                })
              }
            >
              −
            </button>

            <input
              className="sensor-value"
              type="number"
              value={sensorData.co2}
              disabled={!roverActive}
              onChange={(e) =>
                setSensorData({
                  ...sensorData,
                  co2: Number(e.target.value),
                })
              }
            />

            <button
              disabled={!roverActive}
              onClick={() =>
                setSensorData({
                  ...sensorData,
                  co2: sensorData.co2 + 10,
                })
              }
            >
              +
            </button>

          </div>

          {/* METHANE */}
          <div className="sensor-control">

            <button
              disabled={!roverActive}
              onClick={() =>
                setSensorData({
                  ...sensorData,
                  methane: Number(
                    Math.max(
                      0,
                      sensorData.methane - 0.1
                    ).toFixed(1)
                  ),
                })
              }
            >
              −
            </button>

            <input
              className="sensor-value"
              type="number"
              step="0.1"
              value={sensorData.methane}
              disabled={!roverActive}
              onChange={(e) =>
                setSensorData({
                  ...sensorData,
                  methane: Number(e.target.value),
                })
              }
            />

            <button
              disabled={!roverActive}
              onClick={() =>
                setSensorData({
                  ...sensorData,
                  methane: Number(
                    (sensorData.methane + 0.1).toFixed(1)
                  ),
                })
              }
            >
              +
            </button>

          </div>

          {/* TEMPERATURE */}
          <div className="sensor-control">

            <button
              disabled={!roverActive}
              onClick={() =>
                setSensorData({
                  ...sensorData,
                  temperature: Number(
                    (sensorData.temperature - 0.5).toFixed(1)
                  ),
                })
              }
            >
              −
            </button>

            <input
              className="sensor-value"
              type="number"
              step="0.5"
              value={sensorData.temperature}
              disabled={!roverActive}
              onChange={(e) =>
                setSensorData({
                  ...sensorData,
                  temperature: Number(e.target.value),
                })
              }
            />

            <button
              disabled={!roverActive}
              onClick={() =>
                setSensorData({
                  ...sensorData,
                  temperature: Number(
                    (sensorData.temperature + 0.5).toFixed(1)
                  ),
                })
              }
            >
              +
            </button>

          </div>

          {/* HUMIDITY */}
          <div className="sensor-control">

            <button
              disabled={!roverActive}
              onClick={() =>
                setSensorData({
                  ...sensorData,
                  humidity: Math.max(
                    0,
                    sensorData.humidity - 1
                  ),
                })
              }
            >
              −
            </button>

            <input
              className="sensor-value"
              type="number"
              value={sensorData.humidity}
              disabled={!roverActive}
              onChange={(e) =>
                setSensorData({
                  ...sensorData,
                  humidity: Number(e.target.value),
                })
              }
            />

            <button
              disabled={!roverActive}
              onClick={() =>
                setSensorData({
                  ...sensorData,
                  humidity: sensorData.humidity + 1,
                })
              }
            >
              +
            </button>

          </div>

          {/* AIR PRESSURE */}
          <div className="sensor-control">

            <button
              disabled={!roverActive}
              onClick={() =>
                setSensorData({
                  ...sensorData,
                  pressure: Number(
                    (sensorData.pressure - 0.1).toFixed(1)
                  ),
                })
              }
            >
              −
            </button>

            <input
              className="sensor-value"
              type="number"
              step="0.1"
              value={sensorData.pressure}
              disabled={!roverActive}
              onChange={(e) =>
                setSensorData({
                  ...sensorData,
                  pressure: Number(e.target.value),
                })
              }
            />

            <button
              disabled={!roverActive}
              onClick={() =>
                setSensorData({
                  ...sensorData,
                  pressure: Number(
                    (sensorData.pressure + 0.1).toFixed(1)
                  ),
                })
              }
            >
              +
            </button>

          </div>

        </div>

      </div>

    </section>
  )
}

export default SensorInputPanel