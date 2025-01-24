import ReactGA from 'react-ga4'

const TRACKING_ID = 'G-6QVSLCQ30W'

export const init = () => {
  ReactGA.initialize(TRACKING_ID)
}

export const trackPage = (page) => {
  console.log('trackPage', page)
  ReactGA.send({ 
    hitType: "pageview", 
    page: page,
    title: page 
  })
}

export const trackEvent = (categoryName, eventName, additionalParams = {}) => {
  ReactGA.event({
    category: categoryName,
    action: eventName,
    ...additionalParams
  })
}