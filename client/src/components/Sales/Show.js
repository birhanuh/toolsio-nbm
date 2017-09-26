import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import Moment from 'moment'
import { addFlashMessage } from '../../actions/flashMessages'
import { fetchSale, deleteSale } from '../../actions/saleActions'

import ItemForm from './Items/Form'

// Localization 
import T from 'i18n-react'

import $ from 'jquery'

// Modal
$.fn.modal = require('semantic-ui-modal')
$.fn.dimmer = require('semantic-ui-dimmer')

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
      items: this.props.sale ? this.props.sale.items : []
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
      _id: nextProps.sale ? nextProps.sale._id : null,
      name: nextProps.sale ? nextProps.sale.name : '',
      deadline: nextProps.sale ? nextProps.sale.deadline : '',
      customer: nextProps.sale ? nextProps.sale.customer : '',
      status: nextProps.sale ? nextProps.sale.status : '',
      description: nextProps.sale ? nextProps.sale.description : '',
      items: nextProps.sale ? nextProps.sale.items : []
    })
  }

  showConfirmationModal(event) {
    event.preventDefault()

    // Show modal
    $('.small.modal.sale').modal('show')
  }

  hideConfirmationModal(event) {
    event.preventDefault()

    // Show modal
    $('.small.modal.sale').modal('hide')
  }

  handleDelete(id, event) {
    event.preventDefault()
    
    let name = this.props.sale.name

    this.props.deleteSale(id).then(
      () => {
        this.props.addFlashMessage({
          type: 'success',
          text: T.translate("sales.show.flash.success_delete", { name: name})
        })  
        this.context.router.history.push('/sales')
      },
      ({ response }) => {
      }
    ) 
    
  }

  render() {
    const { _id, name, deadline, customer, status, description, items } = this.state
    
    return (
      <div className="ui stackable grid">
        <div className="twelve wide column">
          <div className="ui segment">    
            <h1 className={classnames("ui header", {blue: status === 'new', orange: status === 'on going', green: status === 'finished' || status === 'delivered', red: status === 'delayed'})}>{name}</h1> 
            <dl className="dl-horizontal">
              <dt>{T.translate("sales.show.customer")}</dt>
              <dd>{customer ? customer.name: <p className="blue">{T.translate("sales.show.no_customer")}</p>}</dd>
              {/*<dt>{T.translate("sales.show.user")}</dt>
              <dd>{sale.user.first_name}</dd>*/}
              <dt>{T.translate("sales.show.deadline")}</dt>
              <dd>{Moment(deadline).format('DD/MM/YYYY')}</dd>
              <dt>{T.translate("sales.show.status")}</dt>
              <dd>
                <div className={classnames("ui tiny uppercase label", {blue: status === 'new', orange: status === 'on going', green: status === 'finished' || status === 'delivered', red: status === 'delayed'})}> 
                  {status}
                </div>
              </dd>
             
              <dt>{T.translate("sales.show.description")}</dt>
              <dd>
                {description ? description : '-'}
              </dd>    
            </dl>  

            <h3 className="ui header">{T.translate("sales.items.header")}</h3>

            { items && this.state._id && <ItemForm creator={this.state._id} items={this.state.items} /> }
            
            <div className="ui divider"></div>

            <button className="ui negative button" onClick={this.showConfirmationModal.bind(this)}><i className="delete icon"></i>{T.translate("button.delete")}</button>
            <Link to={`/sales/edit/${_id}`} className="ui primary button"><i className="edit icon"></i>{T.translate("button.edit")}</Link>
          </div>    
        </div>

        <div className="ui small modal sale">
          <div className="header">Confirmation</div>
          <div className="content">
            <p>{T.translate("sales.show.confirmation_msg")}</p>
          </div>
          <div className="actions">
            <button className="ui button" onClick={this.hideConfirmationModal.bind(this)}>{T.translate("button.cancel")}</button>
            <button className="ui negative button" onClick={this.handleDelete.bind(this, _id)}>{T.translate("button.delete")}</button>
          </div>
        </div>
      </div>
    )
  }
}

Show.propTypes = {
  fetchSale: PropTypes.func.isRequired,
  deleteSale: PropTypes.func.isRequired,
  addFlashMessage: PropTypes.func.isRequired
}

Show.contextTypes = {
  router: PropTypes.object.isRequired
}

function mapStateToProps(state, props) {
  const { match } = props
  if (match.params.id) {
    return {
      sale: state.sales.find(item => item._id === match.params.id)
    }
  } 
}

export default connect(mapStateToProps, { fetchSale, deleteSale, addFlashMessage } )(Show)