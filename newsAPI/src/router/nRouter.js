const express = require('express')
const multer = require('multer')
const News  = require('../models/NEWS')
const auth = require('../middleware/Auth')
const router = new express.Router()


router.post('/news', auth, async (req, res) => {
    const news  = new News({
        ...req.body,
        owner: req.reporters._id,
    })

    try {
        await news.save()
        res.status(200).send(news)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/news', auth, async (req, res) => {
    const sort = {}

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        await req.reporters.populate({
            path: 'news',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.reporters.news)
    } catch (e) {
        res.status(500).send('server error')
    }
})

router.get('/news/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const news = await News.findOne({ _id, owner: req.reporters._id })

        if (!news) {
            return res.status(400).send('Unable to find the new')
        }

        res.send(news)
    } catch (e) {
        res.status(500).send('server error')
    }
})

router.patch('/news/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    try {
        const news = await News.findOne({ _id: req.params.id, owner: req.reporters._id})

        if (!news) {
            return res.status(404).send()
        }

        updates.forEach((update) => news[update] = req.body[update])
        await news.save()
        res.send(news)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/news/:id', auth, async (req, res) => {
    try {
        const news = await News.findOneAndDelete({ _id: req.params.id, owner: req.reporters_id })

        if (!news) {
         res.status(400).send('Unable to find the Document')
        }

        res.send(news)
    } catch (e) {
        res.status(500).send()
    }
})

const uploads = multer({
    limits:{
        fileSize:1000000 
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)){
            return cb(new Error('please enter image'))
        }
        cb(undefined,true)
    }
})


router.post('/news/imageNews/:id',auth,uploads.single('imageNews'),async (req,res)=>{
    const _id=req.params.id
    try{
        const news = await News.findOne({_id,owner:req.reporters._id})       
        if(!news){
            return res.status(400).send('unable to send reporters')
            }
        news.imageNews = req.file.buffer
        // news.imageNews.push(req.file.buffer)

        await news.save()
        res.status(200).send(news)
        }catch(e){
            res.status(400).send('upload image')
        }
    }) 

module.exports = router