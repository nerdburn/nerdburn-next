import ReactGA from 'react-ga4'

const TRACKING_ID = 'G-6QVSLCQ30W'

export const init = () => {
  ReactGA.initialize(TRACKING_ID)
}

export const trackPage = (page) => {
  ReactGA.send({ 
    hitType: "pageview", 
    page, 
    title: "Custom Title" 
  })
}

export const trackEvent = (categoryName, eventName, additionalParams = {}) => {
  ReactGA.event({
    category: categoryName,
    action: eventName,
    ...additionalParams
  })
}