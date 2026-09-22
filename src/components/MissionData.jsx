import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const MissionData = ({ missionHistory }) => {
  return (
    <section className="mission-data-section">

      <div className="panel">

        <div className="panel-header">

          <h2>MISSION DATA</h2>

          <span>RECORDED EVERY SECOND</span>

        </div>

        <div className="mission-chart-grid">

          {/* TEMPERATURE */}

          <div className="mission-chart-card">

            <h3>TEMPERATURE</h3>

            {missionHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height="90%">

                <LineChart data={missionHistory}>

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="time" />

                  <YAxis />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="temperature"
                    stroke="#e05252"
                    strokeWidth={2}
                    dot={false}
                  />

                </LineChart>

              </ResponsiveContainer>
            ) : (
              <div className="chart-empty">
                NO DATA
              </div>
            )}

          </div>

          {/* HUMIDITY */}

          <div className="mission-chart-card">

            <h3>HUMIDITY</h3>

            {missionHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height="90%">

                <LineChart data={missionHistory}>

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="time" />

                  <YAxis />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="humidity"
                    stroke="#4da6ff"
                    strokeWidth={2}
                    dot={false}
                  />

                </LineChart>

              </ResponsiveContainer>
            ) : (
              <div className="chart-empty">
                NO DATA
              </div>
            )}

          </div>

          {/* OXYGEN */}

          <div className="mission-chart-card">

            <h3>O₂</h3>

            {missionHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height="90%">

                <LineChart data={missionHistory}>

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="time" />

                  <YAxis />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="oxygen"
                    stroke="#45e07b"
                    strokeWidth={2}
                    dot={false}
                  />

                </LineChart>

              </ResponsiveContainer>
            ) : (
              <div className="chart-empty">
                NO DATA
              </div>
            )}

          </div>

          {/* CO2 */}

          <div className="mission-chart-card">

            <h3>CO₂</h3>

            {missionHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height="90%">

                <LineChart data={missionHistory}>

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="time" />

                  <YAxis />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="co2"
                    stroke="#f0b44d"
                    strokeWidth={2}
                    dot={false}
                  />

                </LineChart>

              </ResponsiveContainer>
            ) : (
              <div className="chart-empty">
                NO DATA
              </div>
            )}

          </div>

          {/* METHANE */}

          <div className="mission-chart-card">

            <h3>CH₄</h3>

            {missionHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height="90%">

                <LineChart data={missionHistory}>

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="time" />

                  <YAxis />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="methane"
                    stroke="#c77dff"
                    strokeWidth={2}
                    dot={false}
                  />

                </LineChart>

              </ResponsiveContainer>
            ) : (
              <div className="chart-empty">
                NO DATA
              </div>
            )}

          </div>

          {/* AIR PRESSURE */}

          <div className="mission-chart-card">

            <h3>AIR PRESSURE</h3>

            {missionHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height="90%">

                <LineChart data={missionHistory}>

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="time" />

                  <YAxis />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="pressure"
                    stroke="#9da2a5"
                    strokeWidth={2}
                    dot={false}
                  />

                </LineChart>

              </ResponsiveContainer>
            ) : (
              <div className="chart-empty">
                NO DATA
              </div>
            )}

          </div>

        </div>

      </div>

    </section>
  )
}

export default MissionData