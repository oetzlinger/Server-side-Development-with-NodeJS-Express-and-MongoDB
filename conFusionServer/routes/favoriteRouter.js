const express = require('express');
const bodyParser = require('body-parser')

const Favorites = require('../models/favorite')

const cors = require('./cors')

const authenticate = require('../authenticate')

const favoritesRouter = express.Router();
favoritesRouter.use(bodyParser.json())

favoritesRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200)
    })
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .populate('user')
            .populate('dishes')
            .then((favorite) => {
                console.log("favorite created ", favorite)
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite)
            })
            .catch((err) => next(err))
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        console.log(req.user)
        Favorites.findOne({ user: req.user._id })
            .then((favorite) => {
                console.log("favorits")
                console.log(favorite)
                if (favorite !== null) {

                    console.log("add ")

                    for (let i = 0; i < req.body.length; i++) {
                        console.log(req.body[i])
                        console.log(favorite.dishes.indexOf(req.body[i]._id))
                        if (favorite.dishes.indexOf(req.body[i]._id) === -1) {
                            favorite.dishes.push(req.body[i]._id)
                        }
                    }
                    favorite.save()
                        .then((favorite) => {
                            console.log('Favorite Created ', favorite);
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        })
                        .catch((err) => next(err))

                } else {
                    console.log("create")
                    Favorites.create({ user: req.user._id, dishes: req.body })
                        .then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        })
                        .catch((err) => next(err))
                }
            })
            .catch((err) => next(err))
        //Favorites.findOne({user})
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /favorites');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOneAndRemove({ user: req.user._id })
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

favoritesRouter.route('/:dishId')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200)
    })
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        console.log(req.params.dishId)
        Favorites.findOne({ user: req.user._id })
            .populate('user')
            .populate('dishes')
            .then((favorite) => {
                console.log(favorite)
                let dishe = favorite.dishes.filter(dis => dis._id.toString() === req.params.dishId.toString())
                console.log(dishe)
                if (dishe) {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(dishe);
                } else {
                    var err = new Error('You do not have dish ' + req.params.dishId);
                    err.status = 404;
                    return next(err);
                }
            })
            .catch((err) => next(err))
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('Post operation is not supported on /favourites/:dishId' + req.params.dishId);
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation is not supported on /favourites/:dishId' + req.params.dishId);
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .populate('user')
            .populate('dishes')
            .then((favorite) => {
                favorite.dishes = favorite.dishes.filter((dishid) => dishid._id.toString() !== req.params.dishId.toString())
                favorite.save()
                    .then((result) => {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/json");
                        res.json(result);
                    })
                    .catch((err) => next(err))

            })
            .catch((err) => next(err))
    })

module.exports = favoritesRouter;