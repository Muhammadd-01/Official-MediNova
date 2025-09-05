import { onCLS, onFID, onLCP } from "web-vitals"

function sendToAnalytics({ name, delta, id }) {
  // This is where you would send the metric to your analytics service
  console.log({ name, delta, id })
}

export function reportWebVitals() {
  onCLS(sendToAnalytics)
  onFID(sendToAnalytics)
  onLCP(sendToAnalytics)
}

