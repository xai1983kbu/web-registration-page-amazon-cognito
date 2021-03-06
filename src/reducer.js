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
    case 'LOGOUT_USER':
      return {
        ...state,
        currentUser: null
      }
    default:
      return state
  }
}
