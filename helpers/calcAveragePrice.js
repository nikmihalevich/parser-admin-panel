const tress = require('tress')

const q = tress((job, callback) => {
    _calc(job.shopModel, job.products, callback)
}, 10)

module.exports = (shopModel, products) => {

    return new Promise((resolve, reject) => {
        q.drain = () => {
            resolve()
        }
        q.push({shopModel, products})
    })

}

const _calc = async (shopModel, products, callback) => {

    for(let i = 0; i < products.length; i++) {
        let { product_id } = products[i]
        let candidate = await shopModel.find({product_id})
        if(candidate.length > 1) {
            let averagePrice = 0

            await shopModel.deleteMany({product_id})

            for (let j = 0; j < candidate.length; j++)
                averagePrice += candidate[j].price

            averagePrice = Math.floor((averagePrice / candidate.length) * 100) / 100

            let product = new shopModel({
                product_id: product_id,
                price: averagePrice
            })
            await product.save()
        }
    }

    callback(null, "Done")
}