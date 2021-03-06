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

class Product {
  constructor(id, name, color, price, size) {
    Object.defineProperty(this, 'id', { value: id, writeable: false })
    Object.defineProperty(this, 'name', { value: name, writeable: false })
    Object.defineProperty(this, 'color', { value: color, writeable: false })
    Object.defineProperty(this, 'price', { value: price, writeable: false })
    Object.defineProperty(this, 'size', { value: size, writeable: false })
  }
}
