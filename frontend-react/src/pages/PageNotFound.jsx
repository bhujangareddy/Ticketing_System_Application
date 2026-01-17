import { Button } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const PageNotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="fixed top-15 left-5">
      <h1 className='m-2'>404 | Page Not Found</h1>
      <Button onClick={() => navigate("/")} variant='filled' color="primary">Goto Home</Button>
    </div>
  )
}

export default PageNotFound
