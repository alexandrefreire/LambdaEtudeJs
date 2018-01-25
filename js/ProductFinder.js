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

class ProductFinder {
    constructor(repository) {
        this.repository = repository;
    }

    byID(productID) {
        return this.productsMatching(this.matchBy("id", productID));
    }

    byColor(color) {
        return this.productsMatching(this.matchBy("color", color));
    }

    byPrice(price) {
        return this.productsMatching(this.matchBy("price", price));
    }

    bySize(sizeToFind) {
        return this.productsMatching(this.matchBy("size", sizeToFind));
    }

    belowPrice(priceLimit) {
        return this.productsMatching(this.matchLower("price", priceLimit));
    }

    byColorAndBelowPrice(color, priceLimit){
        return this.productsMatching(
            this.and(
                this.matchBy("color", color),
                this.matchLower("price", priceLimit)));
    }

    byColorSizeAndBelowPrice(color, size, priceLimit) {
        return this.productsMatching(
            this.and(
                this.matchBy("color", color),
                this.matchBy("size", size),
                this.matchLower("price", priceLimit)));
    }

    byColorAndAbovePrice(color, priceLimit) {
        return this.productsMatching(
            this.and(
                this.matchBy("color", color),
                this.matchHigher("price", priceLimit)));
    }

    belowPriceAvoidingAColor(priceLimit, color) {
        return this.productsMatching(
            this.and(
                this.not(this.matchBy("color", color)),
                this.matchLower("price", priceLimit)));
    }

    productsMatching(criterion) {
        return this.repository
            .filter(criterion);
    }

    matchBy(fieldName, expectedValue) {
        return product => product[fieldName] === expectedValue;
    }

    matchLower(fieldName, priceLimit) {
        return product => product[fieldName] < priceLimit;
    }

    matchHigher(fieldName, priceLimit) {
        return product => product[fieldName] > priceLimit;
    }

    and(...criteria){
        return product => criteria.every(c => c(product))
    }

    not(criterion){
        return product =>  !criterion(product);
    }

    countByColor(color) {
        return this.byColor(color).length;
    }

    maxPrice() {
        return this.repository.map(p => p.price).reduce((a,b) => Math.max(a,b))
    }

    mostExpensiveProduct() {
        return this.productsMatching(
            this.matchBy("price", this.maxPrice()))[0];
    }

    productsOrderedByPriceAscending() {
        return this.repository.sort((p1,p2) => p1.price - p2.price);
    }

    productsOrderedByPriceDescending() {
        return this.repository.sort((p1,p2) => p2.price - p1.price);;
    }

    averagePrice() {
        return this.repository.map(p=>p.price).reduce((a,b)=>a+b)/this.repository.length;
    }

    productsGroupedByColor() {
        var groupByColor = (colorGroups, product) => {
            var color = product.color
            if (!colorGroups.has(color)) {
                colorGroups.set(color, [])
            }
            colorGroups.get(color).push(product)
            return colorGroups;
        };
        return this.repository.reduce(groupByColor, new Map());
    }

    productNamesOrderedAlphabetically() {
        return []
    }

}
