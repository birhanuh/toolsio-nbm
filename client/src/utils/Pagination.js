import React from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'

export default function Pagination({ path, count, offset, limit }) {
    
  let currentPage = 0
  offset = offset ? offset : 0
  
  if ((offset/limit) < (parseInt(count)-5)) {
    currentPage = offset ? Math.ceil(offset/limit) + 1 : 1
  } else {
    currentPage = parseInt(count)-4
  }  

  // Active page
  let activePage = offset ? Math.ceil(offset/limit) + 1 : 1
  
  // Prevoius link
  let previousLink 

  if (currentPage && currentPage === 1 || currentPage < 0) {
    previousLink = (<div className="item disabled">
        <i className="angle left icon"></i>
      </div>)
  } else {
    previousLink = (<Link to={currentPage && currentPage === 1 ? `/${path}/${parseInt(offset)}/${limit}` : 
        `/${path}/${parseInt(offset)-10}/${limit}`} className={classnames("item", {disabled: currentPage && currentPage === 1 || currentPage < 0 })} >
        <i className="angle left icon"></i>
      </Link>)
  }

  // Next link
  let nextLink 

  if (currentPage && currentPage+4 === count) {      
    nextLink = (<div className="item disabled">
      <i className="angle right icon"></i>
    </div>)
  } else {
    nextLink = (<Link to={!offset ? `/${path}/${50}/${limit}` : (currentPage && currentPage+4 === (count) ? `/${path}/${parseInt(offset)}/${limit}` : 
        `/${path}/${parseInt(offset)+10}/${limit}`)} className={classnames("item", {disabled: currentPage && currentPage+4 === count})}>
        <i className="angle right icon"></i>
    </Link>)
  }

  const paginationElement =
    (<div className="ui right floated pagination menu">
      {previousLink}
      { currentPage > 0 &&
        <Link to={`/${path}/${((currentPage)*10)-10}/${limit}`} className={classnames("item", {active: activePage === currentPage})}>
          {currentPage}
        </Link>
      }
      {currentPage+1 > 0 &&
        <Link to={`/${path}/${((currentPage+1)*10)-10}/${limit}`} className={classnames("item", {active: activePage === currentPage+1})}>
          {currentPage+1}
        </Link>
      }
      {currentPage+2 > 0 &&
        <Link to={`/${path}/${((currentPage+2)*10)-10}/${limit}`} className={classnames("item", {active: activePage === currentPage+2})}>
          {currentPage+2}
        </Link>
      }
      {currentPage+3 > 0 &&
        <Link to={`/${path}/${((currentPage+3)*10)-10}/${limit}`} className={classnames("item", {active: activePage === currentPage+3})}>
          {currentPage+3}
        </Link>
      }
      <Link to={`/${path}/${((currentPage+4)*10)-10}/${limit}`} className={classnames("item 4", {active: activePage === currentPage+4})}>
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
