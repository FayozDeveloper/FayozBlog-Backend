import {body} from 'express-validator';

export const signUpValidation = [
    body('email', 'Email is not correct').isEmail(),
    body('password', 'Password length is must be more than 5 character').isLength({min: 5}),
    body('fullName', 'FullName length is must be more than 3 character').isLength({min: 3}),
    body('avatarUrl', 'Not Correct URL for Avatar').optional().isURL(),
]

export const loginValidation = [
    body('email', 'Email is not correct').isEmail(),
    body('password', 'Password length is must be more than 5 character').isLength({min: 5}),
]

export const postCreateValidation = [
    body('title', 'Enter a Title post').isLength({min: 3}).isString(),
    body('text', 'Enter a Text post').isLength({min: 3}).isString(),
    body('tags','Neverniy format tegov').optional().isString(),
    body('imageUrl', 'inCorrect link for image').optional().isString(),
]

