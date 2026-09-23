import type { Project, ProjectMedia } from "./types";
// Screenshots live in /public/projects/. "extra" photos show as a strip on the case study page.
export const media: Record<Project["id"], ProjectMedia> = {
  wlg: {
    src: "/projects/wlg.jpg",
    alt: "Winterset Law Group client portal landing screen",
    links: [{ label: "Firm website", href: "https://wintersetlawgroup.com/" }],
    extra: [{ src: "/projects/wlg-site.jpg", alt: "Winterset Law Group public site I maintain" }],
  },
  mosaic: {
    src: "/projects/mosaic.jpg",
    alt: "Mosaic home screen with a live candlestick chart and agent pipeline status",
    links: [],
    extra: [],
  },
  lifescale: {
    src: "/projects/lifescale.jpg",
    alt: "Retrieval pipeline returning ranked ICD-10 codes for a sample query, run on public coding vocabulary, not patient data",
    links: [],
    extra: [],
  },
  signalspace: {
    src: "/projects/signalspace.jpg",
    alt: "SignalSpace dashboard showing detection confidence for each sound class",
    links: [
      { label: "Live demo", href: "https://safety-alert-website.vercel.app" },
      { label: "Frontend code", href: "https://github.com/anibhati/safety-alert-website" },
      { label: "Model + API code", href: "https://github.com/anibhati/SafetyAlertApp" },
    ],
    extra: [
      { src: "/projects/signalspace-talk.jpg", alt: "Presenting SignalSpace at the BDAA Research Gala" },
      { src: "/projects/signalspace-team.jpg", alt: "Our team with our awards at the BDAA Research Gala" },
    ],
  },
};
