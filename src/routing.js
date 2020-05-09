const siteRoutes = {
  0: {
    path: '/',
    index: '0'
  },
  1: {
    0: {
      path: '/about',
      index: '10'
    },
    1: {
      path: '/about/1',
      index: '11'
    },
    2: {
      path: '/about/2',
      index: '12'
    }
  },
  2: {
    path: '/addplace',
    index: '2'
  },
  3: {
    path: '/register',
    index: '3'
  }
}

let allRoutesArray = []
let allIndexArray = []

const makeArrayOfRoutes = routes => {
  for (const route in routes) {
    if ('0' in routes[route]) {
      console.log(routes[route])
      makeArrayOfRoutes(routes[route])
    } else {
      allRoutesArray.push(routes[route]['path'])
      allIndexArray.push(routes[route]['index'])
    }
  }
}

makeArrayOfRoutes(siteRoutes)
allRoutesArray = allRoutesArray.slice(1)
allRoutesArray.push('/')
allIndexArray = allIndexArray.slice(1)
allIndexArray.push('0')

export { allRoutesArray, allIndexArray }
