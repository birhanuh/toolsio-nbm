import { 
  addSale, setSales, saleFetched, saleUpdated, saleDeleted, addItem, itemUpdated, itemDeleted
} from '../../actions/saleActions'

describe("actoins", function() { 

  describe("addSale", function() { 

    test('should have a type of "ADD_SALE"', function() {
      expect(addSale().type).toEqual('ADD_SALE')
    })  

    test('should pass on the sale we pass in', function() {
      const sale = {}
      expect(addSale(sale).sale).toEqual(sale)
    })  
  })

  describe("setSales", function() { 

    test('should have a type of "SET_SALES"', function() {
      expect(setSales().type).toEqual('SET_SALES')
    })  

    test('should pass on the sales we pass in', function() {
      const sales = []
      expect(setSales(sales).sales).toEqual(sales)
    })  
  })

  describe("saleUpdated", function() { 

    test('should have a type of "SALE_UPDATED"', function() {
      expect(saleUpdated().type).toEqual('SALE_UPDATED')
    })  
  })

  describe("addItem", function() { 

    test('should have a type of "ADD_ITEM"', function() {
      expect(addItem().type).toEqual('ADD_ITEM')
    })  

    test('should pass on the item we pass in', function() {
      const item = {}
      expect(addItem(item).item).toEqual(item)
    })  
  })

  
})
