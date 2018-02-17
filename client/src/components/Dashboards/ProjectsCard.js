import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { fetchProjects } from '../../actions/dashboardActions'

import { RadialChart, Hint } from 'react-vis'

// Localization 
import T from 'i18n-react'

class ProjectsCard extends Component {

  state = {
    value: false,
    isLoading: false
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.projects) {
      this.setState({ isLoading: false })
    }
  }

  componentDidMount = () => {
    this.setState({ isLoading: true })
    this.props.fetchProjects()
      .catch( ({response}) => this.setState({ isLoading: false }) )
  }

  render() {

    const { value, isLoading } = this.state
    const { projects } = this.props
   
    const data = projects && projects.lastTwoMonths.length !== 0 && projects.lastTwoMonths[1].data.map(project => {

      let projectStatusClass          
      switch(project.status) {
        case 'new':
          projectStatusClass = 'blue-graph'
          break
        case 'in progress':
          projectStatusClass = 'orange-graph'
          break
        case 'overdue':
          projectStatusClass = 'red-graph'
          break
        case 'finished':
          projectStatusClass = 'green-graph' 
          break
        case 'delivered':
          projectStatusClass = 'turquoise-graph' 
          break
        case 'delayed':
          projectStatusClass = 'red-graph' 
          break  
        default:
          projectStatusClass = 'undefined' 
      }

      return ({theta: project.count, status: project.status, className: ''+projectStatusClass+''})
      })

    const tooltipClass = {
      fontSize: '12px',
      background: 'black', 
      opacity: 0.85, 
      color: '#ffffff', 
      padding: '5px', 
      borderRadius: '5px'
    }

    return (
      <div className={classnames("ui card dashboards form", { loading: isLoading })}>
        <div className="content">
          <div className="right floated">
            <h4 className="ui header">
              <i className="suitcase icon"></i>
            </h4>
          </div> 
          <div className="left floated">
            <h4 className="ui header">
              {T.translate("dashboards.projects.header")}
            </h4>
          </div>       
        </div>

        <div className="image">
          <RadialChart
            className={'donut-chart-example'}
            innerRadius={55}
            radius={95}
            getAngle={d => d.theta}
            data={data ? data : [{theta: 0}]}
            onValueMouseOver={v => this.setState({value: v})}
            onSeriesMouseOut={v => this.setState({value: false})}
            width={300}
            height={200}>
            {value && 
              <Hint value={value}>
                <div style={tooltipClass}>
                  <p><strong>Status: </strong><span style={{textTransform: 'capitalize'}}>{value.status}</span></p>
                  <p><strong>Number: </strong>{value.theta}</p>
                </div>
              </Hint>
            }
          </RadialChart>
        </div>

        <div className="content">
          <div className="right floated">
            <div className="meta">{T.translate("dashboards.this_month")}</div>
            <div className="header">
              {projects && projects.lastTwoMonths.length !== 0 && projects.lastTwoMonths[1].totalCount}
              {projects && projects.lastTwoMonths.length !== 0 && (projects.lastTwoMonths[0].totalCount > projects.lastTwoMonths[1].totalCount ) ? <i className="long arrow down red icon"></i> : 
              <i className="long arrow up green icon"></i>}
            </div>
          </div>     
          <div className="left floated">
            <div className="meta">{T.translate("dashboards.last_month")}</div>
            <div className="header">{projects && projects.lastTwoMonths.length !== 0 && projects.lastTwoMonths[0].totalCount}</div>
          </div>    
        </div>

        {(!!projects || (projects && projects.total && projects.total.count === 0)) &&  
          <div className="content-btn-outer-container">
            <div className="content-btn-inner-container">
              <Link to="/projects" className="ui primary outline button small">
                <i className="check circle outline icon"></i>{T.translate("dashboards.projects.create_first_project")}
              </Link>
            </div>
          </div>
        } 
      </div> 
      )
  }
}

ProjectsCard.propTypes = {  
  fetchProjects: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return {
    projects: state.dashboards.projects
  }
}

export default connect(mapStateToProps, { fetchProjects }) (ProjectsCard)
