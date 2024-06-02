import { type Request, type Response, Router } from 'express'
import { isValidObjectId } from 'mongoose'
import Category from '../models/category.js'
import Product from '../models/product.js'

const router = Router()

router.get('/', async (req: Request, res: Response) => {
  let filter = {}
  if (req.query.categories) {
    filter = { category: `${req.query.categories}`.split(',') }
  }
  const productList = await Product.find(filter).populate('category')
  // const productList = await Product.find().select('name image -_id')

  if (!productList) {
    res.status(500).json({ success: false })
  }
  res.send(productList)
})

router.get('/:id', async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id).populate('category')

  if (!product) {
    res.status(500).json({ success: false })
  }
  res.send(product)
})

router.post('/', async (req: Request, res: Response) => {
  const category = await Category.findById(req.body.category)
  if (!category) return res.status(400).send('Invalid category')

  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: req.body.image,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  })

  product = await product.save()

  if (!product) {
    return res.status(500).send('The product cannot be created')
  }
  res.send(product)
})

router.put('/:id', async (req: Request, res: Response) => {
  if (!isValidObjectId(req.params.id)) {
    res.status(400).send('Invalid product ID')
  }
  const category = await Category.findById(req.body.category)
  if (!category) return res.status(400).send('Invalid category')

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: req.body.image,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    },
    { new: true },
  )

  if (!product) {
    return res.status(400).send('The product cannot be updated')
  }
  res.send(product)
})

router.delete('/:id', (req: Request, res: Response) => {
  Product.findByIdAndDelete(req.params.id)
    .then(product => {
      if (product) {
        return res
          .status(200)
          .json({ success: true, message: 'The product is deleted!' })
      }
      return res
        .status(404)
        .json({ success: false, message: 'Product not found' })
    })
    .catch(err => {
      return res.status(400).json({ success: false, error: err })
    })
})

router.get('/get/count', async (req: Request, res: Response) => {
  const productCount = await Product.countDocuments()

  if (!productCount) {
    res.status(500).json({ success: false })
  }
  res.send({ productCount: productCount })
})

router.get('/get/featured/:count?', async (req: Request, res: Response) => {
  const count = req.params.count ? Number.parseInt(req.params.count) : 0
  const products = await Product.find({ isFeatured: true }).limit(count)

  if (!products) {
    res.status(500).json({ success: false })
  }
  res.send(products)
})

export default router
