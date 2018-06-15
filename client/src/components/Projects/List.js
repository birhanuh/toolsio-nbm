import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import Card from './Card'

// Localization 
import T from 'i18n-react'

export default function List({ projects, loading }) {
  const emptyMessage = (
    <div className="ui info message">
      <div className="header">
        {T.translate("projects.page.empty_projects_header")}
      </div>
      <p>{T.translate("projects.page.empty_projects_message")}</p>
    </div>
  )

  const projectsList = (
    <div className={classnames("ui two cards projects", { loading: loading })}>
      { projects.map(project => <Card project={project} key={project.id} />) }
    </div>
  )

  return (
    <div>
      { projects.length === 0 ? emptyMessage : projectsList }
    </div>   
  )
}

List.propTypes = {
  projects: PropTypes.array.isRequired
}