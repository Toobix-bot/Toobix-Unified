import { describe, it, expect, beforeEach } from 'vitest'

describe('Example Test Suite', () => {
  beforeEach(() => {
    // Setup before each test
  })
  
  describe('Basic Math', () => {
    it('should add two numbers', () => {
      expect(1 + 1).toBe(2)
    })
    
    it('should subtract numbers', () => {
      expect(5 - 3).toBe(2)
    })
  })
  
  describe('String Operations', () => {
    it('should concatenate strings', () => {
      expect('Hello' + ' ' + 'World').toBe('Hello World')
    })
    
    it('should check string length', () => {
      expect('Toobix'.length).toBe(6)
    })
  })
  
  describe('Array Operations', () => {
    it('should find element in array', () => {
      const arr = [1, 2, 3, 4, 5]
      expect(arr.includes(3)).toBe(true)
    })
    
    it('should map array', () => {
      const arr = [1, 2, 3]
      const doubled = arr.map(x => x * 2)
      expect(doubled).toEqual([2, 4, 6])
    })
  })
})
