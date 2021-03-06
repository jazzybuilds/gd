var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import React from 'react';
import { UniformContext } from '../components/UniformContext';
export function withUniformContext(Component) {
    return function ComponentWithContext(props) {
        return (React.createElement(UniformContext.Consumer, null, function (context) { return React.createElement(Component, __assign({}, props, { uniformContext: context })); }));
    };
}
//# sourceMappingURL=withUniformContext.js.map