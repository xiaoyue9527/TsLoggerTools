"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
test("log function", () => {
    console.log = jest.fn();
    (0, __1.log)("Hello, World!");
    expect(console.log).toHaveBeenCalledWith("[ts-logger-tools]: Hello, World!");
});
