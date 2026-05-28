export function calculateTotal(price: number, taxRate: number, discount: number = 0): number {
  if (price < 0 || taxRate < 0) {
    throw new Error('Invalid values');
  }
  const tax = price * taxRate;
  const subtotal = price + tax;
  return subtotal - discount;
}

export const processData = async (data: any[], filterParam: string, maxItems: number, sortOrder: string, extraFlag: boolean) => {
  // Complex function example to trigger analyzer
  let result = data.filter(d => d.type === filterParam);
  if (sortOrder === 'asc') {
    result.sort();
  } else {
    result.reverse();
  }
  
  if (extraFlag) {
    result = result.map(r => ({ ...r, extra: true }));
  }
  
  // padding loc to trigger complexity line length rule
  let a = 1; let b = 2; let c = 3; let d = 4; let e = 5; let f = 6;
  a++; b++; c++; d++; e++; f++;
  a++; b++; c++; d++; e++; f++;
  a++; b++; c++; d++; e++; f++;
  a++; b++; c++; d++; e++; f++;
  a++; b++; c++; d++; e++; f++;
  a++; b++; c++; d++; e++; f++;
  a++; b++; c++; d++; e++; f++;
  a++; b++; c++; d++; e++; f++;
  a++; b++; c++; d++; e++; f++;
  
  return result.slice(0, maxItems);
};

export class MathHelper {
  add(a: number, b: number): number {
    return a + b;
  }
  
  multiply(a: number, b: number): number {
    return a * b;
  }
}
