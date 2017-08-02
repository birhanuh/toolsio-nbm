import React, { Component } from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { fetchSale, updateSale } from '../../actions/saleActions'

// Localization 
import T from 'i18n-react'

class Show extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      _id: this.props.sale ? this.props.sale._id : null,
      name: this.props.sale ? this.props.sale.name : '',
      deadline: this.props.sale ? this.props.sale.deadline : '',
      customer: this.props.sale ? this.props.sale.customer : '',
      status: this.props.sale ? this.props.sale.status : '',
      description: this.props.sale ? this.props.sale.description : '',
    }
  }

  componentDidMount = () => {
    // Fetch Sale when id is present in params
    const { match } = this.props
    if (match.params.id) {
      this.props.fetchSale(match.params.id)
    } 
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      _id: nextProps.sale._id,
      name: nextProps.sale.name,
      deadline: nextProps.sale.deadline,
      customer: nextProps.sale.customer,
      status: nextProps.sale.status,
      description: nextProps.sale.description
    })
  }

  render() {
    const { name, deadline, customer, status, description } = this.state
    console.log('customer: ', customer +' - '+ name)
    return (
      <div className="ui stackable grid">
        <div className="twelve wide column ui segment">  
          <h1 className="ui header">{name}</h1> 
          <dl className="dl-horizontal">
            <dt>{T.translate("sales.show.customer")}</dt>
            <dd>{customer.name}</dd>
            {/*<dt>{T.translate("sales.show.user")}</dt>
            <dd>{sale.user.first_name}</dd>*/}
            <dt>{T.translate("sales.show.deadline")}</dt>
            <dd>{deadline}</dd>
            <dt>{T.translate("sales.show.status")}</dt>
            <dd>
              <div className={classnames("ui uppercase label", {blue: status === 'new', orange: status === 'in progress', green: status === 'ready' })}> 
                {status}
              </div>
            </dd>
           
            <dt>{T.translate("sales.show.description")}</dt>
            <dd>
              {description ? description : '-'}
            </dd>    
          </dl>      
        </div>
      </div>
    )
  }
}

Show.propTypes = {
  fetchSale: React.PropTypes.func.isRequired
}

function mapStateToProps(state, props) {
  const { match } = props
  if (match.params.id) {
    return {
      sale: state.sales.find(item => item._id === match.params.id)
    }
  } 
}

export default connect(mapStateToProps, { fetchSale, updateSale } )(Show)