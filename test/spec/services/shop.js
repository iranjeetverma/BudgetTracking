'use strict';

describe('Service: Shop', function () {

  // load the service's module
  beforeEach(module('budgetTrackingApp'));

  // instantiate service
  var Shop;
  beforeEach(inject(function (_Shop_) {
    Shop = _Shop_;
  }));

  it('should do something', function () {
    expect(!!Shop).toBe(true);
  });

});
