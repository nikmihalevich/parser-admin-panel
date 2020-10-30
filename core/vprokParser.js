const tress          = require('tress')
const cheerio        = require('cheerio')
const underscore     = require('underscore');
const axios          = require('axios')

const Vprok          = require('../models/VprokModel')

let results = []

const q = tress((job, callback) => {
    Perekrestok(job.URL, job.product, callback)
}, 10)

const parsePerekData = async (html, product, callback) => {
    // парсим DOM
    let $ = cheerio.load(html)

    let productNameTemplate = product.name + ' ' + product.params.weight + product.params.unit
    let productNameTemplateArr = productNameTemplate.toLowerCase().split(' ')
    let productNameTemplateArrLength = productNameTemplateArr.length
    let productPrice
    let productWeight = 0

    $('.js-catalog-product').each(async(i, elem) => {
        let productTitle = $(elem).find('.js-product__title').attr('title')
        let productTitleArray = [];

        productTitleArray = productTitle.toLowerCase().split(' ')

        productWeight = parseFloat(productTitleArray[productTitleArray.length-1].match(/\d.(\d+)/))

        if(!productWeight) return

        if(typeof productWeight === 'number') {
            productWeight = productWeight.toString()
        }

        if(productWeight !== product.params.weight) return

        if(underscore.intersection(productTitleArray, productNameTemplateArr).length >= productNameTemplateArrLength-1) {
            productPrice = parseFloat($(elem).find('.js-product__cost').attr('data-cost'))
        }

        if(!productPrice) return

        let result = {
            product_id: product.product_id,
            price: productPrice
        }

        results.push(result)

        let vprok = await new Vprok(result)
        await vprok.save()

    })

    callback(null, 'done')
}



const Perekrestok = (url, product, callback) => {
    axios.get(url)
        .then(res => parsePerekData(res.data, product, callback))
}

module.exports = async (products, cb) => {
    return new Promise((resolve, reject) => {
        q.drain = () => {
            resolve()
        }
        for (let i = 0; i < products.length; i++) {
            let URL = encodeURI('https://www.vprok.ru/catalog/search?text=' + products[i].name.toLowerCase())
            q.push({URL, product: products[i]})
        }
    })
}