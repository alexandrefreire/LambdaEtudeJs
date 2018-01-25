// ***************************************************************************
// Copyright (c) 2017, Industrial Logic, Inc., All Rights Reserved.
//
// This code is the exclusive property of Industrial Logic, Inc. It may ONLY be
// used by students during Industrial Logic's workshops or by individuals
// who are being coached by Industrial Logic on a project.
//
// This code may NOT be copied or used for any other purpose without the prior
// written consent of Industrial Logic, Inc.
// ****************************************************************************

const fireTruck = new Product("f1234", "Fire Truck", Color.red, 8.95, ProductSize.MEDIUM)
const barbieClassic = new Product("b7654", "Barbie Classic", Color.yellow, 15.95, ProductSize.SMALL)
const frisbee = new Product("f4321", "Frisbee", Color.pink, 9.99, ProductSize.LARGE)
const baseball = new Product("b2343", "Baseball", Color.white, 8.95, ProductSize.NOT_APPLICABLE)
const toyConvertible = new Product("p1112", "Toy Porsche Convertible", Color.red, 230.00, ProductSize.NOT_APPLICABLE)

QUnit.module("Product Finder", {
    beforeEach: function (assert) {
        this.repository = []
        this.repository.push(fireTruck)
        this.repository.push(barbieClassic)
        this.repository.push(frisbee)
        this.repository.push(baseball)
        this.repository.push(toyConvertible)

        this.finder = new ProductFinder(this.repository)
    }
})

QUnit.assert.contains = function (collection, thing) {
    for (var obj of collection) {
        if (thing == obj) {
            return true
        }
    }
    return false
}

QUnit.test("testFindByID", function (assert) {
    var productID = "f1234"
    var foundProducts = this.finder.byID(productID)

    assert.equal(foundProducts.length, 1, "found 1 product with ID:f1234")

    assert.ok(assert.contains(foundProducts, fireTruck), "found product with ID:f1234")
})

QUnit.test("testFindBySize", function (assert) {
    var foundProducts = this.finder.bySize(ProductSize.MEDIUM)
    assert.equal(foundProducts.length, 1, "found medium-sized products")

    foundProducts = this.finder.bySize(ProductSize.NOT_APPLICABLE)
    assert.equal(foundProducts.length, 2, "found products where size is not applicable")
})

QUnit.test("testFindByColor", function (assert) {
    var foundProducts = this.finder.byColor(Color.red)
    assert.equal(foundProducts.length, 2, "found 2 red products")

    assert.ok(assert.contains(foundProducts, fireTruck), "found fireTruck")

    assert.ok(assert.contains(foundProducts, toyConvertible), "found Toy Porsche Convertible")
})

QUnit.test("testFindByPrice", function (assert) {
    var foundProducts = this.finder.byPrice(8.95)
    assert.equal(foundProducts.length, 2, "found products that cost  $8.95")
    for (var p of foundProducts) {
        assert.ok(p.price == 8.95)
    }
})

QUnit.test("testFindBelowPrice", function (assert) {
    var foundProducts = this.finder.belowPrice(10.00)
    assert.equal(foundProducts.length, 3, "found products below $10.00")
    for (var p of foundProducts) {
        assert.ok(p.price < 10.00)
    }
})

QUnit.test("testFindByColorAndBelowPrice", function (assert) {
    var foundProducts = this.finder.byColorAndBelowPrice(Color.red, 10.00)
    assert.equal(foundProducts.length, 1, "found red products below $10.00")
    assert.equal(foundProducts[0], fireTruck, "found firetruck when looking for cheap red toys")
})

QUnit.test("testFindByColorSizeAndBelowPrice", function (assert) {
    var foundProducts = this.finder.byColorSizeAndBelowPrice(Color.red, ProductSize.SMALL, 10.00)

    assert.equal(foundProducts.length, 0, "found no small red products below $10.00")

    foundProducts = this.finder.byColorSizeAndBelowPrice(Color.red, ProductSize.MEDIUM, 10.00)

    assert.equal(foundProducts[0], fireTruck, "found firetruck when looking for cheap medium red toys")
})

QUnit.test("testFindByColorAndAbovePrice", function (assert) {
    var foundProducts = this.finder.byColorAndAbovePrice(Color.white, 25.00)
    assert.equal(foundProducts.length, 0, "found no blue products above $25.00")

    foundProducts = this.finder.byColorAndAbovePrice(Color.red, 25.00)

    assert.equal(foundProducts[0], toyConvertible, "found toy convertible when looking for red toys > $25.00")
})

QUnit.test("testFindBelowPriceAvoidingAColor", function (assert) {
    var foundProducts = this.finder.belowPriceAvoidingAColor(9.00, Color.white)
    assert.equal(foundProducts.length, 1, "found 1 non-white product < $9.00")
    assert.ok(assert.contains(foundProducts, fireTruck), "found fireTruck")

    foundProducts = this.finder.belowPriceAvoidingAColor(9.00, Color.red)
    assert.equal(foundProducts.length, 1, "found 1 non-red product < $9.00")
    assert.ok(assert.contains(foundProducts, baseball), "found baseball")
})

QUnit.test("countProductsByColor", function (assert) {
    assert.equal(this.finder.countByColor(Color.red), 2)
    assert.equal(this.finder.countByColor(Color.blue), 0)
})

QUnit.test("maxPriceForAll", function (assert) {
    assert.equal(this.finder.maxPrice(), 230.0)
})

QUnit.test("averagePriceForAllProducts", function (assert) {
    assert.ok(Math.abs(this.finder.averagePrice() - 54.768) < 0.0001)
})

QUnit.test("mostExpensiveProduct", function (assert) {
    assert.equal(this.finder.mostExpensiveProduct(), toyConvertible)
})

QUnit.test("productsOrderedByPriceAscending", function (assert) {
    var orderedProducts = this.finder.productsOrderedByPriceAscending()
    assert.equal(orderedProducts.length, 5)
    let expected = [ fireTruck, baseball, frisbee, barbieClassic, toyConvertible];
    orderedProducts.forEach(product => {
        assert.equal(product, expected.shift())
    })
})

QUnit.test("productsOrderedByPriceDescending", function (assert) {
    var orderedProducts = this.finder.productsOrderedByPriceDescending()
    assert.equal(orderedProducts.length, 5)
    var expected = [toyConvertible, barbieClassic, frisbee, fireTruck, baseball];
    orderedProducts.forEach(product => {
        assert.equal(product, expected.shift())
    })
})

QUnit.test("productsGroupedByColor", function (assert) {
    var colorGroups = this.finder.productsGroupedByColor()

    assert.equal(Array.from(colorGroups).length, 4)
    assert.deepEqual(colorGroups.get(Color.red), [toyConvertible, fireTruck])
    assert.deepEqual(colorGroups.get(Color.pink), [frisbee])
    assert.deepEqual(colorGroups.get(Color.white), [baseball])
    assert.deepEqual(colorGroups.get(Color.yellow), [barbieClassic])
})

QUnit.skip("listOfAllProductNamesOrderedAlphabetically", function (assert) {
    var names = ["Barbie Classic", "Baseball", "Fire Truck", "Frisbee", "Toy Porsche Convertible"]
    assert.deepEqual(this.finder.ProductNamesOrderedAlphabetically(), names)
})
