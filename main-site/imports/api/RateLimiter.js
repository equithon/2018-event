import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { _ } from 'meteor/underscore';

DDPRateLimiter.setErrorMessage(({ timeToReset }) => {
    const time = Math.ceil(timeToReset / 1000);
    const seconds = time === 1 ? 'second' : 'seconds';
    return `Slow down! Too many requests. Try again in ${time} ${seconds}.`;
});

const fetchMethodNames = (methods) => _.pluck(methods, 'name');

const assignLimits = ({ methods, limit, timeRange }) => {
    const methodNames = fetchMethodNames(methods);
    DDPRateLimiter.addRule({
        type: 'method',
        name(name) { return _.contains(methodNames, name); },
    }, limit, timeRange);
};

export const rateLimit = (options) => assignLimits(options);