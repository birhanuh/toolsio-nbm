import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import { Validation } from '../../utils'
import { fetchSale, deleteSale, addItem } from '../../actions/saleActions'
import { InputField, SelectField } from '../../utils/FormFields'

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
      item: {
        _id: null,
        _creator: null,
        name: "",
        unit: "",
        quantity: "",
        price: "",
        vat: "",
        errors: {
          message: {
            errors: {}
          }
        },
        isLoading: false
      }
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

  handleChange = (e) => {
    if (!!this.state.item.errors.message.errors[e.target.name]) {
      let errors = Object.assign({}, this.state.item.errors)
      delete errors.message.errors[e.target.name]

      let updatedItem = Object.assign({}, this.state.item)
      updatedItem._creator = this.state._id
      updatedItem[e.target.name] = e.target.value

      this.setState({
        item: updatedItem,
        errors
      })
    } else {
      let updatedItem = Object.assign({}, this.state.item)
      updatedItem._creator = this.state._id
      updatedItem[e.target.name] = e.target.value

      this.setState({
        item: updatedItem
      })
    }
  }

  isValid() {
    const { errors, isValid } = Validation.validateItemInput(this.state.item)

    if (!isValid) {
      let updatedItem = Object.assign({}, this.state.item)
      updatedItem.errors.message.errors = errors
      this.setState({
        item: updatedItem
      })
    }

    return isValid
  }

  handleSubmit(event) {
     event.preventDefault()

    // Validation
    if (this.isValid()) { 
      const { _id, _creator, name, unit, quantity, price, vat } = this.state.item
      let updatedItem = Object.assign({}, this.state.item)
      updatedItem.isLoading = true
       this.setState({
        task: updatedItem
      })
      this.props.saveItem({ _id, _creator, name, unit, quantity, price, vat })
        .catch( ( {response} ) => this.setState({ errors: response.data.errors, isLoading: false }) ) 
    }
  }

  render() {
    const { _id, name, deadline, customer, status, description, item } = this.state
  
    return (
      <div className="ui stackable grid">
        <div className="twelve wide column">
          <div className="ui segment">   
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
                <div className={classnames("ui tiny uppercase label", {blue: status === 'new', orange: status === 'on going', red: status === 'delayed', green: status === 'delivered'})}> 
                  {status}
                </div>
              </dd>
             
              <dt>{T.translate("sales.show.description")}</dt>
              <dd>
                {description ? description : '-'}
              </dd>    
            </dl> 

             <h3 className="ui header">{T.translate("sales.items.header")}</h3>

            <form className={classnames("ui form", { loading: item.isLoading })} onSubmit={this.handleSubmit.bind(this)}>
              <table className="ui very basic table item">
                <thead>
                  <tr>
                    <th>{T.translate("sales.items.new.name")}</th>
                    <th>{T.translate("sales.items.new.unit")}</th>
                    <th>{T.translate("sales.items.new.quantity")}</th>
                    <th>{T.translate("sales.items.new.price")}</th>
                    <th>{T.translate("sales.items.new.vat")}</th>
                    <th>{T.translate("sales.items.new.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <InputField
                        name="name" 
                        value={item.name} 
                        onChange={this.handleChange.bind(this)}  
                        placeholder="Name"
                        error={item.errors.message && item.errors.message.errors && item.errors.message.errors.name && item.errors.message.errors.name.message}
                        formClass="field"
                      />
                    </td>
                    <td>
                      <SelectField
                        name="unit"
                        type="select"
                        value={item.unit} 
                        onChange={this.handleChange.bind(this)}  
                        error={item.errors.message && item.errors.message.errors && item.errors.message.errors.unit && item.errors.message.errors.unit.message}
                        formClass="field"
                        options={[
                          <option key="default" value="" disabled>{T.translate("sales.items.new.select_unit")}</option>,
                          <option key="piece" value="piece">Piece</option>,
                          <option key="meter" value="meter">Meter</option>,
                          <option key="kilo gram" value="kilo gram">Kilo gram</option>,
                          <option key="liter" value="liter">Liter</option>
                          ]
                        }
                      />
                    </td>
                    <td>
                      <InputField
                        name="quantity" 
                        value={item.quantity} 
                        onChange={this.handleChange.bind(this)}  
                        placeholder="0"
                        error={item.errors.message && item.errors.message.errors && item.errors.message.errors.quantity && item.errors.message.errors.quantity.message}
                        formClass="field"
                      />
                    </td>
                    <td>
                      <InputField
                        name="price" 
                        value={item.price} 
                        onChange={this.handleChange.bind(this)} 
                        placeholder="0.00"
                        error={item.errors.message && item.errors.message.errors && item.errors.message.errors.price && item.errors.message.errors.price.message}
                        formClass="field"
                      />
                    </td>
                    <td>
                      <InputField
                        name="vat" 
                        value={item.vat} 
                        onChange={this.handleChange.bind(this)} 
                        placeholder="0"
                        error={item.errors.message && item.errors.message.errors && item.errors.message.errors.vat && item.errors.message.errors.vat.message}
                        formClass="field"
                      />
                    </td>
                    {/*<td>
                      <button className="ui icon basic red button" onClick={deleteItem(item._id)}><i className="delete icon"></i></button>
                    </td>
                    <td>
                      <Link className="ui icon basic green button" onClick={updateItem(item._id)}><i className="edit icon"></i></Link>
                    </td>*/}
                    <td className="actions">
                      <button disabled={item.isLoading} className="small ui icon basic turquoise button"><i className="add circle icon icon" aria-hidden="true"></i>&nbsp;{T.translate("sales.items.new.add_item")}</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </form>

            <div className="ui divider"></div>

            <button className="ui negative button" onClick={deleteSale(_id)}><i className="delete icon"></i>{T.translate("button.delete")}</button>
            <Link to={`/sales/edit/${_id}`} className="ui primary button"><i className="edit icon"></i>{T.translate("button.edit")}</Link>
          </div>   
        </div>
      </div>
    )
  }
}

Show.propTypes = {
  fetchSale: React.PropTypes.func.isRequired,
  deleteSale: React.PropTypes.func.isRequired,
  addItem: React.PropTypes.func.isRequired
}

function mapStateToProps(state, props) {
  const { match } = props
  if (match.params.id) {
    return {
      sale: state.sales.find(item => item._id === match.params.id)
    }
  } 
}

export default connect(mapStateToProps, { fetchSale, deleteSale, addItem } )(Show)
