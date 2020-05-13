const siteRoutes = {
  0: {
    link: '/',
    index: '0',
    name: 'Home'
  },
  1: {
    0: {
      link: '/about',
      index: '10',
      name: 'About',

      ariaOwns: 'simmple-menu',
      ariaPopup: 'true',
      mouseOver: true
    },
    1: {
      link: '/about/1',
      index: '11',
      name: 'Our Purpose'
    },
    2: {
      link: '/about/2',
      index: '12',
      name: 'Our Advantage'
    }
  },
  2: {
    link: '/addplace',
    index: '2',
    name: 'Add new place'
  },
  3: {
    link: '/searchplace',
    index: '3',
    name: 'Search places'
  },
  4: {
    link: '/register',
    index: '4',
    name: 'Register'
  }
}

let allRoutesArray = []
let allIndexArray = []

const makeArrayOfRoutes = routes => {
  for (const route in routes) {
    if ('0' in routes[route]) {
      // console.log(routes[route])
      makeArrayOfRoutes(routes[route])
    } else {
      allRoutesArray.push(routes[route]['link'])
      allIndexArray.push(routes[route]['index'])
    }
  }
}

makeArrayOfRoutes(siteRoutes)
allRoutesArray = allRoutesArray.slice(1)
allRoutesArray.push('/')
allIndexArray = allIndexArray.slice(1)
allIndexArray.push('0')

export { allRoutesArray, allIndexArray, siteRoutes }
