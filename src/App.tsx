import React, { useEffect, useRef, useState } from 'react'
import GraphiQL from 'graphiql'
import 'graphiql/graphiql.min.css'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'

export const firebaseConfig = {
  apiKey: 'AIzaSyDkzVT14QnkR8FF6xc2S0NWdZ1XUOIkiDk',
  authDomain: 'graphiql-a15dd.firebaseapp.com',
  projectId: 'graphiql-a15dd',
  storageBucket: 'graphiql-a15dd.appspot.com',
  messagingSenderId: '607730941176',
  appId: '1:607730941176:web:c14ce9a463d85068e18f0d',
  measurementId: 'G-35W1CWM10E',
}

firebase.initializeApp(firebaseConfig)

const auth = firebase.auth()

const ENDPOINT = '/api'

const inform = `# You must login to query the API
`

const App = () => {
  const graphiqlRef = useRef<GraphiQL>()
  const [token, setToken] = useState('')
  const [user, setUser] = useState<firebase.User | null>(null)

  useEffect(() => {
    const listener = auth.onAuthStateChanged((user) => setUser(user))

    return () => {
      listener()
    }
  }, [auth])

  const login = async () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    const result = await auth.signInWithPopup(provider)
    result.user?.getIdToken().then((token) => setToken(token))
  }

  const logout = async () => {
    await auth.signOut()
    setToken('')
  }

  return (
    <GraphiQL
      // @ts-ignore
      ref={graphiqlRef}
      defaultQuery={inform}
      fetcher={async (graphQLParams) => {
        // @ts-ignore
        const data = await fetch(ENDPOINT, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(graphQLParams),
        })
        return data.json().catch(() => data.text())
      }}
      // readOnly={!user}
    >
      <GraphiQL.Logo>
        {user ? (
          // @ts-ignore
          <img width="35" src={user?.photoURL} alt="logo" />
        ) : (
          <img
            width="35"
            alt="Almanack"
            src="https://raw.githubusercontent.com/almanackdefi/assets/blob/master/blockchains/smartchain/assets/0x0b5bDC795B30Cf6b24752b10bcd8E85b073A3C08/logo.png"
          ></img>
        )}
      </GraphiQL.Logo>
      <GraphiQL.Toolbar>
        {user ? (
          <GraphiQL.ToolbarButton
            onClick={() => logout()}
            label="Logout"
            title="Sign-out"
          ></GraphiQL.ToolbarButton>
        ) : (
          <GraphiQL.ToolbarButton
            onClick={() => login()}
            label="Login"
            title="Sign-in to continue"
          ></GraphiQL.ToolbarButton>
        )}
        <GraphiQL.Button
          onClick={() => graphiqlRef?.current?.handlePrettifyQuery()}
          label="Prettify"
          title="Prettify Query (Shift-Ctrl-P)"
        />
        <GraphiQL.Button
          onClick={() => graphiqlRef?.current?.handleToggleHistory()}
          label="History"
          title="Show History"
        />
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            You are logged in as {user?.email}
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            Login to continue
          </div>
        )}
      </GraphiQL.Toolbar>
    </GraphiQL>
  )
}

export default App
