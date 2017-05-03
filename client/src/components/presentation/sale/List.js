import React from 'react'
import Card from './Card'

export default function List({ sales }) {
  const emptyMessage = (
    <p>There are no games yet in your collection.</p>
  )

  const salesList = (
    <table className="ui striped selectable table">
       <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Status</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          { sales.map(sale => <Card sale={sale} key={sale._id} />) }
        </tbody>
    </table>
  )

  return (
    <div>
      { sales.length === 0 ? emptyMessage : salesList }
    </div>   
  )
}

List.propTypes = {
  sales: React.PropTypes.array.isRequired
}