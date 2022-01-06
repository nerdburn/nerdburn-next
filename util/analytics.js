import ReactGA from 'react-ga'

const TRACKING_ID = 'G-6QVSLCQ30W'

export const init = () => {
  ReactGA.initialize(TRACKING_ID)
}

export const trackPage = (page) => {
  ReactGA.pageview(page)
}

export const trackEvent = (categoryName, eventName) => {
  ReactGA.event({
    category: categoryName, // Required
    action: eventName, // Required
    label: 'labelName',
    value: 10,
    nonInteraction: false,
  })
}