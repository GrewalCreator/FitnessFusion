import React, {useState, useEffect} from 'react'

function App(){

  const [data, setData] = useState('')

  useEffect(() => {
    fetch("/test").then(
      res => res.json()
    ).then(
      data => {
        setData(data)
        console.log(data)
      }
    )
  }, [])
  
  return (
    <div>
      {(typeof data.object === 'undefined') ? (
        <p>Loading...</p>
      ) : (
        data.object.map((o, i) => (
          <p key={i}>{o}</p>
        ))
      )}
    </div>
  )
}

export default App