import rateLimit from 'express-rate-limit'

const MINUTE = 60 * 1000;
const HOUR = 60 * 60 * 1000;

/**
 * Authentication Limiters
 */
export const loginLimiter = rateLimit({
    // 5 per 15 mins
    windowMs: 15 * MINUTE,
    max: 10,
    message: {error: "Too many login attempts, please try again later."},
    standardHeaders: true,
    legacyHeaders: false
});

export const signupLimiter = rateLimit({
    // 2 max per 15mins
    windowMs: 15 * MINUTE,
    max: 2,
    message: { error: 'Too many signup attempts, please try again later.'},
    standardHeaders: true,
    legacyHeaders: false
});

export const deleteUserLimiter = rateLimit({
    // 1 per 8 hours
    windowMs: 8 * HOUR,
    max: 1,
    message: { error: 'Too many deletion attempts, try again later.'},
    standardHeaders: true,
    legacyHeaders: false
})

/**
 * Content Protected Endpoint Limiters
 */
export const editContentLimiter = rateLimit({
    // 2 per 5 mins
    windowMs: 5 * MINUTE,
    max: 2,
    message: { error: 'Too many edit attempts, please try again later.'},
    standardHeaders: true,
    legacyHeaders: false
});

export const addContentLimiter = rateLimit({
    // 1 per hour
    windowMs: HOUR,
    max: 1,
    message: { error: 'Too many add attempts, please try again later.'},
    standardHeaders: true,
    legacyHeaders: false
});

export const deleteContentLimiter = rateLimit({
    // 1 per hour
    windowMs: HOUR,
    max: 1,
    message: { error: 'Too many delete attempts, please try again later.'},
    standardHeaders: true,
    legacyHeaders: false
});

/**
 * Other Limiters
 */
export const dataRetrievalLimiter = rateLimit({
    windowMs: HOUR / 2,
    max: 3000,
    message: { error: "Too mnay retrieval attempts, please try again later."},
    standardHeaders: true,
    legacyHeaders: false
})