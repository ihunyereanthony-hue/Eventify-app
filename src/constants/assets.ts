export const Images = {
  // purple app mark, sits next to the "Eventify" wordmark
  logo: require('../../assets/images/icon.png'),
  // cover shown when an event has no image of its own
  eventFallback: require('../../assets/images/landing-image.jpeg'),
  // onboarding slides 1 to 4, in order. If a slide shows the wrong picture, reorder here.
  onboarding: [
    require('../../assets/images/landing-image.jpeg'),
    require('../../assets/images/image.png'),
    require('../../assets/images/image - Copy.png'),
    require('../../assets/images/image - Copy (2).png'),
  ],
} as const;
