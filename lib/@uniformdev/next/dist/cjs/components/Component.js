"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Component = void 0;
var react_1 = __importDefault(require("react"));
var Component = /** @class */ (function (_super) {
    __extends(Component, _super);
    /**
     *
     */
    function Component(props) {
        return _super.call(this, props) || this;
    }
    Object.defineProperty(Component.prototype, "renderingContext", {
        get: function () {
            return this.props.renderingContext;
        },
        enumerable: false,
        configurable: true
    });
    return Component;
}(react_1.default.Component));
exports.Component = Component;
//# sourceMappingURL=Component.js.map