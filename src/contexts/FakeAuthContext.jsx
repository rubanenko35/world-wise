import {createContext, useContext, useReducer} from "react";

const AuthContext = createContext();

const initialState = {
  useAuth: null,
  isAuthenticated: false,
};

const FAKE_USER = {
  name: "Jack",
  email: "jack@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

function reducer(state, action) {
  switch (action.type) {
    case 'login':
      return {...state, user: action.payload, isAuthenticated: true};
    case 'logout':
      return {...state, user: null, isAuthenticated: false};
    default:
      throw new Error(`Action type "${action.type}" is not supported`);
  }
}

function AuthProvider({children}) {
  const [{user, isAuthenticated}, dispatch] = useReducer(reducer, initialState);

  function login(email, password) {
    if (email === FAKE_USER.email || password === FAKE_USER.password) {
      dispatch({type: 'login', payload: FAKE_USER});
    } else {
      throw new Error('Invalid credentials');
    }
  }

  function logout() {
    dispatch({type: 'logout'});
  }


  return <AuthContext.Provider value={{user, isAuthenticated, login, logout}}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('Auth context is used outside of its provider');
  }

  return context;
}

export {AuthProvider, useAuth};
