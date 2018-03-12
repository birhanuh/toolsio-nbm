// import bookshelf from '../../db/bookshelf'

// export default bookshelf.Model.extend({
  
//   tableName: 'customers',
  
//   projects: function() {
//     return this.hasMany('Project', 'customer_id');
//   },

//   sales: function() {
//     return this.hasMany('Sale', 'customer_id');
//   },

//   invoices: function() {
//     return this.hasMany('Invoice', 'customer_id');
//   },

//   initialize: function() {
//     this.on('saving', this.validateContact);
//     this.on('creating', this.setDefaultIsContactIncludedInInvoice);
//   },

//   validateContact: function() {
//     if (!this.get('email') ||  !this.get('phone_number')) throw new Error('Either Phone number or email is required.');
//   },

//   setDefaultIsContactIncludedInInvoice: function() {
//     this.set('is_contact_included_in_invoice', false)
//   },

//   validationErrors: function () {
//     let output = {};

//     function addError(propertyName, errorName) {
//       let propertyErrors = output[propertyName] || [];
//       propertyErrors.push(errorName);
//       output[propertyName] = propertyErrors;
//     }

// },
// {
//   daysBetween: ( date1, date2 ) => {
//     //Get 1 day in milliseconds
//     var one_day=1000*60*60*24;

//     // Convert both dates to milliseconds
//     var date1_ms = date1.getTime();
//     var date2_ms = date2.getTime();

//     // Calculate the difference in milliseconds
//     var difference_ms = date2_ms - date1_ms;
      
//     // Convert back to days and return
//     return Math.round(difference_ms/one_day); 
//   } 
// });

// //customerSchema.index({name: 'text', 'address.street': 'text', 'address.postalCode': 'text', 'address.region': 'text', 'address.country': 'text', 'contact.phoneNumber': 'text', 'contact.email': 'text'})

