export default function (state, action) {
  switch (action.type) {
    case 'LOGIN_USER':
      return {
        ...state,
        currentUser: action.payload.currentUser
      }
    case 'RETRIEVE_USER_FROM_LOCAL':
      return {
        ...state,
        currentUser: action.payload.currentUser
      }
    case 'GET_CREDENTIALS':
      return {
        ...state,
        identity_creds: action.payload.identity_creds
      }
    case 'LOGOUT_USER':
      return {
        ...state,
        currentUser: null,
        isAuth: action.payload.isAuth
      }
    case 'IS_LOGGED_IN':
      return {
        ...state,
        isAuth: action.payload.isAuth
      }
    case 'CREATE_DRAFT':
      return {
        ...state,
        draft: {
          latitude: 0,
          longitude: 0
        }
      }
    case 'UPDATE_DRAFT_LOCATION':
      return {
        ...state,
        draft: action.payload
      }
    case 'DELETE_DRAFT':
      return {
        ...state,
        draft: null
      }
    case 'GET_PINS':
      return {
        ...state,
        pins: action.payload
      }
    case 'CREATE_PIN':
      const newPin = action.payload
      const prevPins = state.pins
      return {
        ...state,
        pins: newPin ? [...prevPins, newPin] : [...prevPins]
      }
    default:
      return state
  }
}
