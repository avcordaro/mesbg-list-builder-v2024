export const RootFallback = () => {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "1rem",
        }}
      >
        <div
          style={{
            textAlign: "center",
            maxWidth: "66ch",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <h3 style={{ fontSize: "2rem" }}>A Shadow Has Fallen!</h3>
          <p>
            “This page was cast into the fires of Mount Doom… and did not
            return”
          </p>
          <div>
            <div
              role="alert"
              style={{
                background: "rgb(253, 237, 237)",
                color: "rgb(95, 33, 32)",
                padding: "1.2rem",
                backgroundColor: "lightpink",
                borderRadius: "2px",
                textAlign: "left",
                marginBottom: "1rem",
              }}
            >
              <h4>Help us help you!</h4>
              <div>
                Please do share a screenshot of this page with us either via
                email or in our discord. We do like to know what happend and
                resolve the issue.
              </div>
            </div>
            <p>
              <a href="https://discord.gg/MZfUgRtV56">
                https://discord.gg/MZfUgRtV56
              </a>{" "}
              or{" "}
              <a href="mailto:support@mesbg-list-builder.com?subject=MESBG List Builder (v2024) - Bug/Correction">
                support@mesbg-list-builder.com
              </a>
              .
            </p>
          </div>

          <a
            href="https://mesbg-list-builder.com"
            style={{
              padding: "0.2rem",
              textTransform: "uppercase",
              fontSize: "0.9rem",
              background: "rgb(229, 246, 253)",
              borderColor: "rgb(1, 67, 97)",
              borderStyle: "solid",
              borderRadius: "2px",
              borderWidth: "1px",
              color: "rgb(1, 67, 97)",
              cursor: "pointer",
              textDecoration: "none",
            }}
          >
            Return to the Shire
          </a>
        </div>
      </div>
    </>
  );
};
