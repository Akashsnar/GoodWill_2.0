import React from 'react'

// Assume you have an array of options
const UserOptions = ['User', 'Ngo', 'Admin'];
const SelectOptionContainer = ({Set_Option_Val}) => {
  return (
    <div className='option-container'>
    {
        UserOptions.map((user,ind)=>{
            return <p key={ind} className='option-p'
             onClick={(e)=>Set_Option_Val(e)}>{user}</p>
        })
    }
      
    </div>
  )
}

export default SelectOptionContainer
