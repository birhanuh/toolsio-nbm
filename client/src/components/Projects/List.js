import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
// Semantic React UI
import { Card as CardElement, Message, Header } from 'semantic-ui-react'
import Card from './Card'

// Localization 
import T from 'i18n-react'

export default function List({ projects, loading }) {
  const emptyMessage = (
    <Message info>
      <Header>
        {T.translate("projects.page.empty_projects_header")}
      </Header>
      <p>{T.translate("projects.page.empty_projects_message")}</p>
    </Message>
  )

  const projectsList = (
    <CardElement.Group itemsPerRow={2} className={classnames("ui from projects", { loading: loading })}>
      { projects.map(project => <Card project={project} key={project.id} />) }
    </CardElement.Group>
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