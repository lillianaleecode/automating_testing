const assert = require('chai').assert;
const { expect } = require('chai');

const { multiply } = require('../Testing/unitFunctions');



describe('Multiplication', () => {
    
    it('should multiply two numbers', () => {
        const result = multiply(2,4);
        assert.equal(result, 8)
        expect(result).to.be.equal(8)
   
    });
})
;