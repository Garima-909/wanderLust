const Joi = require("joi");

const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().allow("", null)
    }).required()
});

module.exports = listingSchema;

const reviewSchema = Joi.object({
    review: Joi.object({
        comment: Joi.string().required(),
        ratings: Joi.number().required().min(1).max(5)
    }).required()
});

module.exports = reviewSchema;