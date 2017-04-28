import React, { Component } from 'react'

export default function List({ sales }) => {
  const emptyMessage = (
    <p>There are no games yet in your collection.</p>
  )

  const salesList = (
    <p>games list</p>
  )
  
  render() {
    return (
      <div>
        { sales.length === 0 ? emptyMessage }
      </div>   
    )
  }
}

List.propTypes = {
  sales: React.PropTypes.array.isRequired
}