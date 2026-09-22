const SystemStatus = ({
  hasAlert,
  alerts,
}) => {
  return (
    <section className="alert-panel">

      <h2>
        SYSTEM STATUS
      </h2>

      <div
        className={
          hasAlert
            ? 'alert-status'
            : 'normal-status'
        }
      >

        {hasAlert
          ? alerts.map((alert, index) => (
              <div key={index}>
                ⚠ {alert}
              </div>
            ))
          : '● NORMAL'}

      </div>

    </section>
  )
}

export default SystemStatus