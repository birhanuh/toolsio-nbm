import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'

export default function Pagination({ path, pages, match, length }) {
    
  let currentPage = 0
  let start = (match && match.params && match.params.start) ? match.params.start : 0
  
  if (!!pages) {
    if ((start/length) < (parseInt(pages)-5)) {
      currentPage = (match && match.params && match.params.start) ? Math.ceil(match.params.start/match.params.length) + 1 : 1
    } else {
      currentPage = !!pages && parseInt(pages)-4
    }  
  }

  // Active page
  let activePage = (match && match.params && match.params.start) ? Math.ceil(match.params.start/match.params.length) + 1 : 1
  
  // Prevoius link
  let previousLink 

  if (currentPage && currentPage === 1 || currentPage < 0) {
    previousLink = (<div className="item disabled">
        <i className="angle left icon"></i>
      </div>)
  } else {
    previousLink = (<Link to={currentPage && currentPage === 1 ? `/${path}/${parseInt(start)}/${length}` : `/${path}/${parseInt(start)-10}/${length}`} className={classnames("item", {disabled: currentPage && currentPage === 1 || currentPage < 0 })} >
        <i className="angle left icon"></i>
      </Link>)
  }

  // Next link
  let nextLink 

  if (currentPage && currentPage+4 === pages) {      
    nextLink = (<div className="item disabled">
      <i className="angle right icon"></i>
    </div>)
  } else {
    nextLink = (<Link to={!!match ? `/${path}/${50}/${length}` : (currentPage && currentPage+4 === (pages) ? `/${path}/${parseInt(match.params.start)}/${length}` : `/${path}/${parseInt(match.params.start)+10}/${length}`)} className={classnames("item", {disabled: currentPage && currentPage+4 === pages})}>
        <i className="angle right icon"></i>
    </Link>)
  }

  const paginationElement = !!pages &&
    (<div className="ui right floated pagination menu">
      {previousLink}
      { currentPage > 0 &&
        <Link to={`/${path}/${((currentPage)*10)-10}/${length}`} className={classnames("item", {active: activePage === currentPage})}>
          {currentPage}
        </Link>
      }
      {currentPage+1 > 0 &&
        <Link to={`/${path}/${((currentPage+1)*10)-10}/${length}`} className={classnames("item", {active: activePage === currentPage+1})}>
          {currentPage+1}
        </Link>
      }
      {currentPage+2 > 0 &&
        <Link to={`/${path}/${((currentPage+2)*10)-10}/${length}`} className={classnames("item", {active: activePage === currentPage+2})}>
          {currentPage+2}
        </Link>
      }
      {currentPage+3 > 0 &&
        <Link to={`/${path}/${((currentPage+3)*10)-10}/${length}`} className={classnames("item", {active: activePage === currentPage+3})}>
          {currentPage+3}
        </Link>
      }
      <Link to={`/${path}/${((currentPage+4)*10)-10}/${length}`} className={classnames("item 4", {active: activePage === currentPage+4})}>
        {currentPage+4}
      </Link>
      {nextLink}
    </div>
  )

  return(
    
    <div>
      {paginationElement}
    </div>
    )
}
