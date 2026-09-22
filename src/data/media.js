// Drop real images into /public/projects/ with these names. Missing files show a labeled placeholder.
// WLG: use a demo account or blurred screenshot. Never show real client data.
export const media = {
  wlg: { src: "/projects/wlg.png", alt: "WLG client portal intake screen with demo data", links: [] },
  mosaic: { src: "/projects/mosaic.png", alt: "Mosaic research report with a live candlestick chart", links: [] },
  lifescale: { src: "/projects/lifescale.png", alt: "LifeScale query interface with sample question", links: [] },
  signalspace: {
    src: "/projects/signalspace.png",
    alt: "SignalSpace live waveform and per-class confidence meters",
    links: [
      { label: "Live demo", href: "https://safety-alert-website.vercel.app" },
      { label: "Frontend code", href: "https://github.com/anibhati/safety-alert-website" },
      { label: "Model + API code", href: "https://github.com/anibhati/SafetyAlertApp" },
    ],
  },
};
