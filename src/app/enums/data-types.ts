export enum DataType {
  // Primitive types
  Integer = 'integer',
  Double = 'double',
  String = 'string',
  Boolean = 'boolean',

  // Array types - 1D
  IntegerArray = 'integer[]',
  DoubleArray = 'double[]',
  StringArray = 'string[]',
  BooleanArray = 'boolean[]',

  // Matrix types - 2D
  IntegerMatrix = 'integer[][]',
  DoubleMatrix = 'double[][]',
  StringMatrix = 'string[][]',
  BooleanMatrix = 'boolean[][]',
}
