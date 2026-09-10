const Joi = require("joi");

const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string()
            .min(2)
            .max(100)
            .required(),

        description: Joi.string()
            .min(10)
            .max(1000)
            .required(),

        image: Joi.object({
            url: Joi.string()
                .uri()
                .required(),

            filename: Joi.string()
                .default("listingimage")
        }).required(),

        price: Joi.number()
            .min(1)
            .required(),

        location: Joi.string()
            .min(2)
            .required(),

        country: Joi.string()
            .min(2)
            .required()
    }).required()
});


const reviewSchema=Joi.object({
    review:Joi.object({
        rating:Joi.number().min(1).max(5).required(),
        comment:Joi.string().required()
    }).required()
});

module.exports = { listingSchema ,reviewSchema};