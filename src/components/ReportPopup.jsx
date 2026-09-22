const ReportPopup = ({
  showReportPopup,
  setShowReportPopup,
  formatMissionTime,
  missionHistory,
  missionAlerts,
  sensorData,
  missionSeconds,
  createMissionReport,
}) => {
  if (!showReportPopup) {
    return null
  }

  return (
    <div className="report-popup-overlay">
      <div className="report-popup">
        <h2>MISSION COMPLETED</h2>

        <p>The rover mission has ended successfully.</p>

        <p>
          Mission Duration:{' '}
          <strong>{formatMissionTime()}</strong>
        </p>

        <div className="report-popup-actions">
          <button onClick={() => setShowReportPopup(false)}>
            CLOSE
          </button>

          <button
            onClick={() =>
              createMissionReport({
                missionHistory,
                missionAlerts,
                sensorData,
                missionSeconds,
              })
            }
          >
            GENERATE REPORT
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReportPopup