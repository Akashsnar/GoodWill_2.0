(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.solrApi = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],2:[function(require,module,exports){

},{}],3:[function(require,module,exports){
(function (Buffer){(function (){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = { __proto__: Uint8Array.prototype, foo: function () { return 42 } }
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  buf.__proto__ = Buffer.prototype
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species != null &&
    Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  })
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayLike(value)
  }

  if (value == null) {
    throw TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  var valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  var b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(
      value[Symbol.toPrimitive]('string'), encodingOrOffset, length
    )
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype
Buffer.__proto__ = Uint8Array

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  buf.__proto__ = Buffer.prototype
  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (isInstance(buf, Uint8Array)) {
      buf = Buffer.from(buf)
    }
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  var len = string.length
  var mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  var strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
        : (firstByte > 0xBF) ? 2
          : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  newBuf.__proto__ = Buffer.prototype
  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (var i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding)
    var len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

}).call(this)}).call(this,require("buffer").Buffer)
},{"base64-js":1,"buffer":3,"ieee754":4}],4:[function(require,module,exports){
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],5:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],6:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],7:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":5,"./encode":6}],8:[function(require,module,exports){
(function (Buffer){(function (){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _superagent = _interopRequireDefault(require("superagent"));
var _querystring = _interopRequireDefault(require("querystring"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
* @module ApiClient
* @version 9.6.0
*/
/**
* Manages low level client-server communications, parameter marshalling, etc. There should not be any need for an
* application to use this class directly - the *Api and model classes provide the public API for the service. The
* contents of this file should be regarded as internal but are documented for completeness.
* @alias module:ApiClient
* @class
*/
var ApiClient = /*#__PURE__*/function () {
  /**
   * The base URL against which to resolve every API call's (relative) path.
   * Overrides the default value set in spec file if present
   * @param {String} basePath
   */
  function ApiClient() {
    var basePath = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'http://localhost';
    _classCallCheck(this, ApiClient);
    /**
     * The base URL against which to resolve every API call's (relative) path.
     * @type {String}
     * @default http://localhost
     */
    this.basePath = basePath.replace(/\/+$/, '');

    /**
     * The authentication methods to be included for all API calls.
     * @type {Array.<String>}
     */
    this.authentications = {};

    /**
     * The default HTTP headers to be included for all API calls.
     * @type {Array.<String>}
     * @default {}
     */
    this.defaultHeaders = {
      'User-Agent': 'OpenAPI-Generator/9.6.0/Javascript'
    };

    /**
     * The default HTTP timeout for all API calls.
     * @type {Number}
     * @default 60000
     */
    this.timeout = 60000;

    /**
     * If set to false an additional timestamp parameter is added to all API GET calls to
     * prevent browser caching
     * @type {Boolean}
     * @default true
     */
    this.cache = true;

    /**
     * If set to true, the client will save the cookies from each server
     * response, and return them in the next request.
     * @default false
     */
    this.enableCookies = false;

    /*
     * Used to save and return cookies in a node.js (non-browser) setting,
     * if this.enableCookies is set to true.
     */
    if (typeof window === 'undefined') {
      this.agent = new _superagent["default"].agent();
    }

    /*
     * Allow user to override superagent agent
     */
    this.requestAgent = null;

    /*
     * Allow user to add superagent plugins
     */
    this.plugins = null;
  }

  /**
  * Returns a string representation for an actual parameter.
  * @param param The actual parameter.
  * @returns {String} The string representation of <code>param</code>.
  */
  return _createClass(ApiClient, [{
    key: "paramToString",
    value: function paramToString(param) {
      if (param == undefined || param == null) {
        return '';
      }
      if (param instanceof Date) {
        return param.toJSON();
      }
      if (ApiClient.canBeJsonified(param)) {
        return JSON.stringify(param);
      }
      return param.toString();
    }

    /**
    * Returns a boolean indicating if the parameter could be JSON.stringified
    * @param param The actual parameter
    * @returns {Boolean} Flag indicating if <code>param</code> can be JSON.stringified
    */
  }, {
    key: "buildUrl",
    value:
    /**
     * Builds full URL by appending the given path to the base URL and replacing path parameter place-holders with parameter values.
     * NOTE: query parameters are not handled here.
     * @param {String} path The path to append to the base URL.
     * @param {Object} pathParams The parameter values to append.
     * @param {String} apiBasePath Base path defined in the path, operation level to override the default one
     * @returns {String} The encoded path with parameter values substituted.
     */
    function buildUrl(path, pathParams, apiBasePath) {
      var _this = this;
      if (!path.match(/^\//)) {
        path = '/' + path;
      }
      var url = this.basePath + path;

      // use API (operation, path) base path if defined
      if (apiBasePath !== null && apiBasePath !== undefined) {
        url = apiBasePath + path;
      }
      url = url.replace(/\{([\w-\.]+)\}/g, function (fullMatch, key) {
        var value;
        if (pathParams.hasOwnProperty(key)) {
          value = _this.paramToString(pathParams[key]);
        } else {
          value = fullMatch;
        }
        return encodeURIComponent(value);
      });
      return url;
    }

    /**
    * Checks whether the given content type represents JSON.<br>
    * JSON content type examples:<br>
    * <ul>
    * <li>application/json</li>
    * <li>application/json; charset=UTF8</li>
    * <li>APPLICATION/JSON</li>
    * </ul>
    * @param {String} contentType The MIME content type to check.
    * @returns {Boolean} <code>true</code> if <code>contentType</code> represents JSON, otherwise <code>false</code>.
    */
  }, {
    key: "isJsonMime",
    value: function isJsonMime(contentType) {
      return Boolean(contentType != null && contentType.match(/^application\/json(;.*)?$/i));
    }

    /**
    * Chooses a content type from the given array, with JSON preferred; i.e. return JSON if included, otherwise return the first.
    * @param {Array.<String>} contentTypes
    * @returns {String} The chosen content type, preferring JSON.
    */
  }, {
    key: "jsonPreferredMime",
    value: function jsonPreferredMime(contentTypes) {
      for (var i = 0; i < contentTypes.length; i++) {
        if (this.isJsonMime(contentTypes[i])) {
          return contentTypes[i];
        }
      }
      return contentTypes[0];
    }

    /**
    * Checks whether the given parameter value represents file-like content.
    * @param param The parameter to check.
    * @returns {Boolean} <code>true</code> if <code>param</code> represents a file.
    */
  }, {
    key: "isFileParam",
    value: function isFileParam(param) {
      // fs.ReadStream in Node.js and Electron (but not in runtime like browserify)
      if (typeof require === 'function') {
        var fs;
        try {
          fs = require('fs');
        } catch (err) {}
        if (fs && fs.ReadStream && param instanceof fs.ReadStream) {
          return true;
        }
      }

      // Buffer in Node.js
      if (typeof Buffer === 'function' && param instanceof Buffer) {
        return true;
      }

      // Blob in browser
      if (typeof Blob === 'function' && param instanceof Blob) {
        return true;
      }

      // File in browser (it seems File object is also instance of Blob, but keep this for safe)
      if (typeof File === 'function' && param instanceof File) {
        return true;
      }
      return false;
    }

    /**
    * Normalizes parameter values:
    * <ul>
    * <li>remove nils</li>
    * <li>keep files and arrays</li>
    * <li>format to string with `paramToString` for other cases</li>
    * </ul>
    * @param {Object.<String, Object>} params The parameters as object properties.
    * @returns {Object.<String, Object>} normalized parameters.
    */
  }, {
    key: "normalizeParams",
    value: function normalizeParams(params) {
      var newParams = {};
      for (var key in params) {
        if (params.hasOwnProperty(key) && params[key] != undefined && params[key] != null) {
          var value = params[key];
          if (this.isFileParam(value) || Array.isArray(value)) {
            newParams[key] = value;
          } else {
            newParams[key] = this.paramToString(value);
          }
        }
      }
      return newParams;
    }

    /**
    * Builds a string representation of an array-type actual parameter, according to the given collection format.
    * @param {Array} param An array parameter.
    * @param {module:ApiClient.CollectionFormatEnum} collectionFormat The array element separator strategy.
    * @returns {String|Array} A string representation of the supplied collection, using the specified delimiter. Returns
    * <code>param</code> as is if <code>collectionFormat</code> is <code>multi</code>.
    */
  }, {
    key: "buildCollectionParam",
    value: function buildCollectionParam(param, collectionFormat) {
      if (param == null) {
        return null;
      }
      switch (collectionFormat) {
        case 'csv':
          return param.map(this.paramToString, this).join(',');
        case 'ssv':
          return param.map(this.paramToString, this).join(' ');
        case 'tsv':
          return param.map(this.paramToString, this).join('\t');
        case 'pipes':
          return param.map(this.paramToString, this).join('|');
        case 'multi':
          //return the array directly as SuperAgent will handle it as expected
          return param.map(this.paramToString, this);
        case 'passthrough':
          return param;
        default:
          throw new Error('Unknown collection format: ' + collectionFormat);
      }
    }

    /**
    * Applies authentication headers to the request.
    * @param {Object} request The request object created by a <code>superagent()</code> call.
    * @param {Array.<String>} authNames An array of authentication method names.
    */
  }, {
    key: "applyAuthToRequest",
    value: function applyAuthToRequest(request, authNames) {
      var _this2 = this;
      authNames.forEach(function (authName) {
        var auth = _this2.authentications[authName];
        switch (auth.type) {
          case 'basic':
            if (auth.username || auth.password) {
              request.auth(auth.username || '', auth.password || '');
            }
            break;
          case 'bearer':
            if (auth.accessToken) {
              var localVarBearerToken = typeof auth.accessToken === 'function' ? auth.accessToken() : auth.accessToken;
              request.set({
                'Authorization': 'Bearer ' + localVarBearerToken
              });
            }
            break;
          case 'apiKey':
            if (auth.apiKey) {
              var data = {};
              if (auth.apiKeyPrefix) {
                data[auth.name] = auth.apiKeyPrefix + ' ' + auth.apiKey;
              } else {
                data[auth.name] = auth.apiKey;
              }
              if (auth['in'] === 'header') {
                request.set(data);
              } else {
                request.query(data);
              }
            }
            break;
          case 'oauth2':
            if (auth.accessToken) {
              request.set({
                'Authorization': 'Bearer ' + auth.accessToken
              });
            }
            break;
          default:
            throw new Error('Unknown authentication type: ' + auth.type);
        }
      });
    }

    /**
     * Deserializes an HTTP response body into a value of the specified type.
     * @param {Object} response A SuperAgent response object.
     * @param {(String|Array.<String>|Object.<String, Object>|Function)} returnType The type to return. Pass a string for simple types
     * or the constructor function for a complex type. Pass an array containing the type name to return an array of that type. To
     * return an object, pass an object with one property whose name is the key type and whose value is the corresponding value type:
     * all properties on <code>data<code> will be converted to this type.
     * @returns A value of the specified type.
     */
  }, {
    key: "deserialize",
    value: function deserialize(response, returnType) {
      if (response == null || returnType == null || response.status == 204) {
        return null;
      }

      // Rely on SuperAgent for parsing response body.
      // See http://visionmedia.github.io/superagent/#parsing-response-bodies
      var data = response.body;
      if (data == null || _typeof(data) === 'object' && typeof data.length === 'undefined' && !Object.keys(data).length) {
        // SuperAgent does not always produce a body; use the unparsed response as a fallback
        data = response.text;
      }
      return ApiClient.convertToType(data, returnType);
    }

    /**
     * Callback function to receive the result of the operation.
     * @callback module:ApiClient~callApiCallback
     * @param {String} error Error message, if any.
     * @param data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Invokes the REST service using the supplied settings and parameters.
     * @param {String} path The base URL to invoke.
     * @param {String} httpMethod The HTTP method to use.
     * @param {Object.<String, String>} pathParams A map of path parameters and their values.
     * @param {Object.<String, Object>} queryParams A map of query parameters and their values.
     * @param {Object.<String, Object>} headerParams A map of header parameters and their values.
     * @param {Object.<String, Object>} formParams A map of form parameters and their values.
     * @param {Object} bodyParam The value to pass as the request body.
     * @param {Array.<String>} authNames An array of authentication type names.
     * @param {Array.<String>} contentTypes An array of request MIME types.
     * @param {Array.<String>} accepts An array of acceptable response MIME types.
     * @param {(String|Array|ObjectFunction)} returnType The required type to return; can be a string for simple types or the
     * constructor for a complex type.
     * @param {String} apiBasePath base path defined in the operation/path level to override the default one
     * @param {module:ApiClient~callApiCallback} callback The callback function.
     * @returns {Object} The SuperAgent request object.
     */
  }, {
    key: "callApi",
    value: function callApi(path, httpMethod, pathParams, queryParams, headerParams, formParams, bodyParam, authNames, contentTypes, accepts, returnType, apiBasePath, callback) {
      var _this3 = this;
      var url = this.buildUrl(path, pathParams, apiBasePath);
      var request = (0, _superagent["default"])(httpMethod, url);
      if (this.plugins !== null) {
        for (var index in this.plugins) {
          if (this.plugins.hasOwnProperty(index)) {
            request.use(this.plugins[index]);
          }
        }
      }

      // apply authentications
      this.applyAuthToRequest(request, authNames);

      // set query parameters
      if (httpMethod.toUpperCase() === 'GET' && this.cache === false) {
        queryParams['_'] = new Date().getTime();
      }
      request.query(this.normalizeParams(queryParams));

      // set header parameters
      request.set(this.defaultHeaders).set(this.normalizeParams(headerParams));

      // set requestAgent if it is set by user
      if (this.requestAgent) {
        request.agent(this.requestAgent);
      }

      // set request timeout
      request.timeout(this.timeout);
      var contentType = this.jsonPreferredMime(contentTypes);
      if (contentType) {
        // Issue with superagent and multipart/form-data (https://github.com/visionmedia/superagent/issues/746)
        if (contentType != 'multipart/form-data') {
          request.type(contentType);
        }
      }
      if (contentType === 'application/x-www-form-urlencoded') {
        request.send(_querystring["default"].stringify(this.normalizeParams(formParams)));
      } else if (contentType == 'multipart/form-data') {
        var _formParams = this.normalizeParams(formParams);
        for (var key in _formParams) {
          if (_formParams.hasOwnProperty(key)) {
            var _formParamsValue = _formParams[key];
            if (this.isFileParam(_formParamsValue)) {
              // file field
              request.attach(key, _formParamsValue);
            } else if (Array.isArray(_formParamsValue) && _formParamsValue.length && this.isFileParam(_formParamsValue[0])) {
              // multiple files
              _formParamsValue.forEach(function (file) {
                return request.attach(key, file);
              });
            } else {
              request.field(key, _formParamsValue);
            }
          }
        }
      } else if (bodyParam !== null && bodyParam !== undefined) {
        if (!request.header['Content-Type']) {
          request.type('application/json');
        }
        request.send(bodyParam);
      }
      var accept = this.jsonPreferredMime(accepts);
      if (accept) {
        request.accept(accept);
      }
      if (returnType === 'Blob') {
        request.responseType('blob');
      } else if (returnType === 'String') {
        request.responseType('text');
      }

      // Attach previously saved cookies, if enabled
      if (this.enableCookies) {
        if (typeof window === 'undefined') {
          this.agent._attachCookies(request);
        } else {
          request.withCredentials();
        }
      }
      request.end(function (error, response) {
        if (callback) {
          var data = null;
          if (!error) {
            try {
              data = _this3.deserialize(response, returnType);
              if (_this3.enableCookies && typeof window === 'undefined') {
                _this3.agent._saveCookies(response);
              }
            } catch (err) {
              error = err;
            }
          }
          callback(error, data, response);
        }
      });
      return request;
    }

    /**
    * Parses an ISO-8601 string representation or epoch representation of a date value.
    * @param {String} str The date value as a string.
    * @returns {Date} The parsed date object.
    */
  }, {
    key: "hostSettings",
    value:
    /**
      * Gets an array of host settings
      * @returns An array of host settings
      */
    function hostSettings() {
      return [{
        'url': "",
        'description': "No description provided"
      }];
    }
  }, {
    key: "getBasePathFromSettings",
    value: function getBasePathFromSettings(index) {
      var variables = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var servers = this.hostSettings();

      // check array index out of bound
      if (index < 0 || index >= servers.length) {
        throw new Error("Invalid index " + index + " when selecting the host settings. Must be less than " + servers.length);
      }
      var server = servers[index];
      var url = server['url'];

      // go through variable and assign a value
      for (var variable_name in server['variables']) {
        if (variable_name in variables) {
          var variable = server['variables'][variable_name];
          if (!('enum_values' in variable) || variable['enum_values'].includes(variables[variable_name])) {
            url = url.replace("{" + variable_name + "}", variables[variable_name]);
          } else {
            throw new Error("The variable `" + variable_name + "` in the host URL has invalid value " + variables[variable_name] + ". Must be " + server['variables'][variable_name]['enum_values'] + ".");
          }
        } else {
          // use default value
          url = url.replace("{" + variable_name + "}", server['variables'][variable_name]['default_value']);
        }
      }
      return url;
    }

    /**
    * Constructs a new map or array model from REST data.
    * @param data {Object|Array} The REST data.
    * @param obj {Object|Array} The target object or array.
    */
  }], [{
    key: "canBeJsonified",
    value: function canBeJsonified(str) {
      if (typeof str !== 'string' && _typeof(str) !== 'object') return false;
      try {
        var type = str.toString();
        return type === '[object Object]' || type === '[object Array]';
      } catch (err) {
        return false;
      }
    }
  }, {
    key: "parseDate",
    value: function parseDate(str) {
      if (isNaN(str)) {
        return new Date(str.replace(/(\d)(T)(\d)/i, '$1 $3'));
      }
      return new Date(+str);
    }

    /**
    * Converts a value to the specified type.
    * @param {(String|Object)} data The data to convert, as a string or object.
    * @param {(String|Array.<String>|Object.<String, Object>|Function)} type The type to return. Pass a string for simple types
    * or the constructor function for a complex type. Pass an array containing the type name to return an array of that type. To
    * return an object, pass an object with one property whose name is the key type and whose value is the corresponding value type:
    * all properties on <code>data<code> will be converted to this type.
    * @returns An instance of the specified type or null or undefined if data is null or undefined.
    */
  }, {
    key: "convertToType",
    value: function convertToType(data, type) {
      if (data === null || data === undefined) return data;
      switch (type) {
        case 'Boolean':
          return Boolean(data);
        case 'Integer':
          return parseInt(data, 10);
        case 'Number':
          return parseFloat(data);
        case 'String':
          return String(data);
        case 'Date':
          return ApiClient.parseDate(String(data));
        case 'Blob':
          return data;
        default:
          if (type === Object) {
            // generic object, return directly
            return data;
          } else if (typeof type.constructFromObject === 'function') {
            // for model type like User and enum class
            return type.constructFromObject(data);
          } else if (Array.isArray(type)) {
            // for array type like: ['String']
            var itemType = type[0];
            return data.map(function (item) {
              return ApiClient.convertToType(item, itemType);
            });
          } else if (_typeof(type) === 'object') {
            // for plain object type like: {'String': 'Integer'}
            var keyType, valueType;
            for (var k in type) {
              if (type.hasOwnProperty(k)) {
                keyType = k;
                valueType = type[k];
                break;
              }
            }
            var result = {};
            for (var k in data) {
              if (data.hasOwnProperty(k)) {
                var key = ApiClient.convertToType(k, keyType);
                var value = ApiClient.convertToType(data[k], valueType);
                result[key] = value;
              }
            }
            return result;
          } else {
            // for unknown type, return the data directly
            return data;
          }
      }
    }
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj, itemType) {
      if (Array.isArray(data)) {
        for (var i = 0; i < data.length; i++) {
          if (data.hasOwnProperty(i)) obj[i] = ApiClient.convertToType(data[i], itemType);
        }
      } else {
        for (var k in data) {
          if (data.hasOwnProperty(k)) obj[k] = ApiClient.convertToType(data[k], itemType);
        }
      }
    }
  }]);
}();
/**
 * Enumeration of collection format separator strategies.
 * @enum {String}
 * @readonly
 */
ApiClient.CollectionFormatEnum = {
  /**
   * Comma-separated values. Value: <code>csv</code>
   * @const
   */
  CSV: ',',
  /**
   * Space-separated values. Value: <code>ssv</code>
   * @const
   */
  SSV: ' ',
  /**
   * Tab-separated values. Value: <code>tsv</code>
   * @const
   */
  TSV: '\t',
  /**
   * Pipe(|)-separated values. Value: <code>pipes</code>
   * @const
   */
  PIPES: '|',
  /**
   * Native array. Value: <code>multi</code>
   * @const
   */
  MULTI: 'multi'
};

/**
* The default API client implementation.
* @type {module:ApiClient}
*/
ApiClient.instance = new ApiClient();
var _default = exports["default"] = ApiClient;
}).call(this)}).call(this,require("buffer").Buffer)
},{"buffer":3,"fs":2,"querystring":7,"superagent":91}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
var _GetAliasPropertyResponse = _interopRequireDefault(require("../model/GetAliasPropertyResponse"));
var _GetAllAliasPropertiesResponse = _interopRequireDefault(require("../model/GetAllAliasPropertiesResponse"));
var _SolrJerseyResponse = _interopRequireDefault(require("../model/SolrJerseyResponse"));
var _UpdateAliasPropertiesRequestBody = _interopRequireDefault(require("../model/UpdateAliasPropertiesRequestBody"));
var _UpdateAliasPropertyRequestBody = _interopRequireDefault(require("../model/UpdateAliasPropertyRequestBody"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
* AliasProperties service.
* @module api/AliasPropertiesApi
* @version 9.6.0
*/
var AliasPropertiesApi = exports["default"] = /*#__PURE__*/function () {
  /**
  * Constructs a new AliasPropertiesApi. 
  * @alias module:api/AliasPropertiesApi
  * @class
  * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
  * default to {@link module:ApiClient#instance} if unspecified.
  */
  function AliasPropertiesApi(apiClient) {
    _classCallCheck(this, AliasPropertiesApi);
    this.apiClient = apiClient || _ApiClient["default"].instance;
  }

  /**
   * Callback function to receive the result of the createOrUpdateAliasProperty operation.
   * @callback module:api/AliasPropertiesApi~createOrUpdateAliasPropertyCallback
   * @param {String} error Error message, if any.
   * @param {module:model/SolrJerseyResponse} data The data returned by the service call.
   * @param {String} response The complete HTTP response.
   */

  /**
   * Update a specific property for a collection alias.
   * @param {String} aliasName Alias Name
   * @param {String} propName Property Name
   * @param {module:model/UpdateAliasPropertyRequestBody} updateAliasPropertyRequestBody Property value that needs to be updated
   * @param {module:api/AliasPropertiesApi~createOrUpdateAliasPropertyCallback} callback The callback function, accepting three arguments: error, data, response
   * data is of type: {@link module:model/SolrJerseyResponse}
   */
  return _createClass(AliasPropertiesApi, [{
    key: "createOrUpdateAliasProperty",
    value: function createOrUpdateAliasProperty(aliasName, propName, updateAliasPropertyRequestBody, callback) {
      var postBody = updateAliasPropertyRequestBody;
      // verify the required parameter 'aliasName' is set
      if (aliasName === undefined || aliasName === null) {
        throw new Error("Missing the required parameter 'aliasName' when calling createOrUpdateAliasProperty");
      }
      // verify the required parameter 'propName' is set
      if (propName === undefined || propName === null) {
        throw new Error("Missing the required parameter 'propName' when calling createOrUpdateAliasProperty");
      }
      // verify the required parameter 'updateAliasPropertyRequestBody' is set
      if (updateAliasPropertyRequestBody === undefined || updateAliasPropertyRequestBody === null) {
        throw new Error("Missing the required parameter 'updateAliasPropertyRequestBody' when calling createOrUpdateAliasProperty");
      }
      var pathParams = {
        'aliasName': aliasName,
        'propName': propName
      };
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['*/*'];
      var returnType = _SolrJerseyResponse["default"];
      return this.apiClient.callApi('/aliases/{aliasName}/properties/{propName}', 'PUT', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }

    /**
     * Callback function to receive the result of the deleteAliasProperty operation.
     * @callback module:api/AliasPropertiesApi~deleteAliasPropertyCallback
     * @param {String} error Error message, if any.
     * @param {module:model/SolrJerseyResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Delete a specific property for a collection alias.
     * @param {String} aliasName Alias Name
     * @param {String} propName Property Name
     * @param {module:api/AliasPropertiesApi~deleteAliasPropertyCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/SolrJerseyResponse}
     */
  }, {
    key: "deleteAliasProperty",
    value: function deleteAliasProperty(aliasName, propName, callback) {
      var postBody = null;
      // verify the required parameter 'aliasName' is set
      if (aliasName === undefined || aliasName === null) {
        throw new Error("Missing the required parameter 'aliasName' when calling deleteAliasProperty");
      }
      // verify the required parameter 'propName' is set
      if (propName === undefined || propName === null) {
        throw new Error("Missing the required parameter 'propName' when calling deleteAliasProperty");
      }
      var pathParams = {
        'aliasName': aliasName,
        'propName': propName
      };
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['*/*'];
      var returnType = _SolrJerseyResponse["default"];
      return this.apiClient.callApi('/aliases/{aliasName}/properties/{propName}', 'DELETE', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }

    /**
     * Callback function to receive the result of the getAliasProperty operation.
     * @callback module:api/AliasPropertiesApi~getAliasPropertyCallback
     * @param {String} error Error message, if any.
     * @param {module:model/GetAliasPropertyResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get a specific property for a collection alias.
     * @param {String} aliasName Alias Name
     * @param {String} propName Property Name
     * @param {module:api/AliasPropertiesApi~getAliasPropertyCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/GetAliasPropertyResponse}
     */
  }, {
    key: "getAliasProperty",
    value: function getAliasProperty(aliasName, propName, callback) {
      var postBody = null;
      // verify the required parameter 'aliasName' is set
      if (aliasName === undefined || aliasName === null) {
        throw new Error("Missing the required parameter 'aliasName' when calling getAliasProperty");
      }
      // verify the required parameter 'propName' is set
      if (propName === undefined || propName === null) {
        throw new Error("Missing the required parameter 'propName' when calling getAliasProperty");
      }
      var pathParams = {
        'aliasName': aliasName,
        'propName': propName
      };
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['*/*'];
      var returnType = _GetAliasPropertyResponse["default"];
      return this.apiClient.callApi('/aliases/{aliasName}/properties/{propName}', 'GET', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }

    /**
     * Callback function to receive the result of the getAllAliasProperties operation.
     * @callback module:api/AliasPropertiesApi~getAllAliasPropertiesCallback
     * @param {String} error Error message, if any.
     * @param {module:model/GetAllAliasPropertiesResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get properties for a collection alias.
     * @param {String} aliasName Alias Name
     * @param {module:api/AliasPropertiesApi~getAllAliasPropertiesCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/GetAllAliasPropertiesResponse}
     */
  }, {
    key: "getAllAliasProperties",
    value: function getAllAliasProperties(aliasName, callback) {
      var postBody = null;
      // verify the required parameter 'aliasName' is set
      if (aliasName === undefined || aliasName === null) {
        throw new Error("Missing the required parameter 'aliasName' when calling getAllAliasProperties");
      }
      var pathParams = {
        'aliasName': aliasName
      };
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['*/*'];
      var returnType = _GetAllAliasPropertiesResponse["default"];
      return this.apiClient.callApi('/aliases/{aliasName}/properties', 'GET', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }

    /**
     * Callback function to receive the result of the updateAliasProperties operation.
     * @callback module:api/AliasPropertiesApi~updateAliasPropertiesCallback
     * @param {String} error Error message, if any.
     * @param {module:model/SolrJerseyResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Update properties for a collection alias.
     * @param {String} aliasName Alias Name
     * @param {module:model/UpdateAliasPropertiesRequestBody} updateAliasPropertiesRequestBody Properties that need to be updated
     * @param {module:api/AliasPropertiesApi~updateAliasPropertiesCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/SolrJerseyResponse}
     */
  }, {
    key: "updateAliasProperties",
    value: function updateAliasProperties(aliasName, updateAliasPropertiesRequestBody, callback) {
      var postBody = updateAliasPropertiesRequestBody;
      // verify the required parameter 'aliasName' is set
      if (aliasName === undefined || aliasName === null) {
        throw new Error("Missing the required parameter 'aliasName' when calling updateAliasProperties");
      }
      // verify the required parameter 'updateAliasPropertiesRequestBody' is set
      if (updateAliasPropertiesRequestBody === undefined || updateAliasPropertiesRequestBody === null) {
        throw new Error("Missing the required parameter 'updateAliasPropertiesRequestBody' when calling updateAliasProperties");
      }
      var pathParams = {
        'aliasName': aliasName
      };
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['*/*'];
      var returnType = _SolrJerseyResponse["default"];
      return this.apiClient.callApi('/aliases/{aliasName}/properties', 'PUT', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }
  }]);
}();
},{"../ApiClient":8,"../model/GetAliasPropertyResponse":49,"../model/GetAllAliasPropertiesResponse":50,"../model/SolrJerseyResponse":81,"../model/UpdateAliasPropertiesRequestBody":85,"../model/UpdateAliasPropertyRequestBody":86}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
var _GetAliasByNameResponse = _interopRequireDefault(require("../model/GetAliasByNameResponse"));
var _ListAliasesResponse = _interopRequireDefault(require("../model/ListAliasesResponse"));
var _SolrJerseyResponse = _interopRequireDefault(require("../model/SolrJerseyResponse"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
* Aliases service.
* @module api/AliasesApi
* @version 9.6.0
*/
var AliasesApi = exports["default"] = /*#__PURE__*/function () {
  /**
  * Constructs a new AliasesApi. 
  * @alias module:api/AliasesApi
  * @class
  * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
  * default to {@link module:ApiClient#instance} if unspecified.
  */
  function AliasesApi(apiClient) {
    _classCallCheck(this, AliasesApi);
    this.apiClient = apiClient || _ApiClient["default"].instance;
  }

  /**
   * Callback function to receive the result of the deleteAlias operation.
   * @callback module:api/AliasesApi~deleteAliasCallback
   * @param {String} error Error message, if any.
   * @param {module:model/SolrJerseyResponse} data The data returned by the service call.
   * @param {String} response The complete HTTP response.
   */

  /**
   * Deletes an alias by its name
   * @param {String} aliasName The name of the alias to delete
   * @param {Object} opts Optional parameters
   * @param {String} opts.async 
   * @param {module:api/AliasesApi~deleteAliasCallback} callback The callback function, accepting three arguments: error, data, response
   * data is of type: {@link module:model/SolrJerseyResponse}
   */
  return _createClass(AliasesApi, [{
    key: "deleteAlias",
    value: function deleteAlias(aliasName, opts, callback) {
      opts = opts || {};
      var postBody = null;
      // verify the required parameter 'aliasName' is set
      if (aliasName === undefined || aliasName === null) {
        throw new Error("Missing the required parameter 'aliasName' when calling deleteAlias");
      }
      var pathParams = {
        'aliasName': aliasName
      };
      var queryParams = {
        'async': opts['async']
      };
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['*/*'];
      var returnType = _SolrJerseyResponse["default"];
      return this.apiClient.callApi('/aliases/{aliasName}', 'DELETE', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }

    /**
     * Callback function to receive the result of the getAliasByName operation.
     * @callback module:api/AliasesApi~getAliasByNameCallback
     * @param {String} error Error message, if any.
     * @param {module:model/GetAliasByNameResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get details for a specific collection alias.
     * @param {String} aliasName Alias name.
     * @param {module:api/AliasesApi~getAliasByNameCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/GetAliasByNameResponse}
     */
  }, {
    key: "getAliasByName",
    value: function getAliasByName(aliasName, callback) {
      var postBody = null;
      // verify the required parameter 'aliasName' is set
      if (aliasName === undefined || aliasName === null) {
        throw new Error("Missing the required parameter 'aliasName' when calling getAliasByName");
      }
      var pathParams = {
        'aliasName': aliasName
      };
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['*/*'];
      var returnType = _GetAliasByNameResponse["default"];
      return this.apiClient.callApi('/aliases/{aliasName}', 'GET', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }

    /**
     * Callback function to receive the result of the getAliases operation.
     * @callback module:api/AliasesApi~getAliasesCallback
     * @param {String} error Error message, if any.
     * @param {module:model/ListAliasesResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * List the existing collection aliases.
     * @param {module:api/AliasesApi~getAliasesCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/ListAliasesResponse}
     */
  }, {
    key: "getAliases",
    value: function getAliases(callback) {
      var postBody = null;
      var pathParams = {};
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['*/*'];
      var returnType = _ListAliasesResponse["default"];
      return this.apiClient.callApi('/aliases', 'GET', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }
  }]);
}();
},{"../ApiClient":8,"../model/GetAliasByNameResponse":48,"../model/ListAliasesResponse":55,"../model/SolrJerseyResponse":81}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
var _BalanceReplicasRequestBody = _interopRequireDefault(require("../model/BalanceReplicasRequestBody"));
var _MigrateReplicasRequestBody = _interopRequireDefault(require("../model/MigrateReplicasRequestBody"));
var _SolrJerseyResponse = _interopRequireDefault(require("../model/SolrJerseyResponse"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
* Cluster service.
* @module api/ClusterApi
* @version 9.6.0
*/
var ClusterApi = exports["default"] = /*#__PURE__*/function () {
  /**
  * Constructs a new ClusterApi. 
  * @alias module:api/ClusterApi
  * @class
  * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
  * default to {@link module:ApiClient#instance} if unspecified.
  */
  function ClusterApi(apiClient) {
    _classCallCheck(this, ClusterApi);
    this.apiClient = apiClient || _ApiClient["default"].instance;
  }

  /**
   * Callback function to receive the result of the balanceReplicas operation.
   * @callback module:api/ClusterApi~balanceReplicasCallback
   * @param {String} error Error message, if any.
   * @param {module:model/SolrJerseyResponse} data The data returned by the service call.
   * @param {String} response The complete HTTP response.
   */

  /**
   * Balance Replicas across the given set of Nodes.
   * @param {Object} opts Optional parameters
   * @param {module:model/BalanceReplicasRequestBody} opts.balanceReplicasRequestBody Contains user provided parameters
   * @param {module:api/ClusterApi~balanceReplicasCallback} callback The callback function, accepting three arguments: error, data, response
   * data is of type: {@link module:model/SolrJerseyResponse}
   */
  return _createClass(ClusterApi, [{
    key: "balanceReplicas",
    value: function balanceReplicas(opts, callback) {
      opts = opts || {};
      var postBody = opts['balanceReplicasRequestBody'];
      var pathParams = {};
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['*/*'];
      var returnType = _SolrJerseyResponse["default"];
      return this.apiClient.callApi('/cluster/replicas/balance', 'POST', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }

    /**
     * Callback function to receive the result of the migrateReplicas operation.
     * @callback module:api/ClusterApi~migrateReplicasCallback
     * @param {String} error Error message, if any.
     * @param {module:model/SolrJerseyResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Migrate Replicas from a given set of nodes.
     * @param {module:model/MigrateReplicasRequestBody} migrateReplicasRequestBody Contains user provided parameters
     * @param {module:api/ClusterApi~migrateReplicasCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/SolrJerseyResponse}
     */
  }, {
    key: "migrateReplicas",
    value: function migrateReplicas(migrateReplicasRequestBody, callback) {
      var postBody = migrateReplicasRequestBody;
      // verify the required parameter 'migrateReplicasRequestBody' is set
      if (migrateReplicasRequestBody === undefined || migrateReplicasRequestBody === null) {
        throw new Error("Missing the required parameter 'migrateReplicasRequestBody' when calling migrateReplicas");
      }
      var pathParams = {};
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['*/*'];
      var returnType = _SolrJerseyResponse["default"];
      return this.apiClient.callApi('/cluster/replicas/migrate', 'POST', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }
  }]);
}();
},{"../ApiClient":8,"../model/BalanceReplicasRequestBody":30,"../model/MigrateReplicasRequestBody":61,"../model/SolrJerseyResponse":81}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
var _BackupDeletionResponseBody = _interopRequireDefault(require("../model/BackupDeletionResponseBody"));
var _CreateCollectionBackupRequestBody = _interopRequireDefault(require("../model/CreateCollectionBackupRequestBody"));
var _ListCollectionBackupsResponse = _interopRequireDefault(require("../model/ListCollectionBackupsResponse"));
var _PurgeUnusedFilesRequestBody = _interopRequireDefault(require("../model/PurgeUnusedFilesRequestBody"));
var _PurgeUnusedResponse = _interopRequireDefault(require("../model/PurgeUnusedResponse"));
var _SolrJerseyResponse = _interopRequireDefault(require("../model/SolrJerseyResponse"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
* CollectionBackups service.
* @module api/CollectionBackupsApi
* @version 9.6.0
*/
var CollectionBackupsApi = exports["default"] = /*#__PURE__*/function () {
  /**
  * Constructs a new CollectionBackupsApi. 
  * @alias module:api/CollectionBackupsApi
  * @class
  * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
  * default to {@link module:ApiClient#instance} if unspecified.
  */
  function CollectionBackupsApi(apiClient) {
    _classCallCheck(this, CollectionBackupsApi);
    this.apiClient = apiClient || _ApiClient["default"].instance;
  }

  /**
   * Callback function to receive the result of the createCollectionBackup operation.
   * @callback module:api/CollectionBackupsApi~createCollectionBackupCallback
   * @param {String} error Error message, if any.
   * @param {module:model/SolrJerseyResponse} data The data returned by the service call.
   * @param {String} response The complete HTTP response.
   */

  /**
   * Creates a new backup point for a collection
   * @param {String} collectionName 
   * @param {String} backupName 
   * @param {Object} opts Optional parameters
   * @param {module:model/CreateCollectionBackupRequestBody} opts.createCollectionBackupRequestBody 
   * @param {module:api/CollectionBackupsApi~createCollectionBackupCallback} callback The callback function, accepting three arguments: error, data, response
   * data is of type: {@link module:model/SolrJerseyResponse}
   */
  return _createClass(CollectionBackupsApi, [{
    key: "createCollectionBackup",
    value: function createCollectionBackup(collectionName, backupName, opts, callback) {
      opts = opts || {};
      var postBody = opts['createCollectionBackupRequestBody'];
      // verify the required parameter 'collectionName' is set
      if (collectionName === undefined || collectionName === null) {
        throw new Error("Missing the required parameter 'collectionName' when calling createCollectionBackup");
      }
      // verify the required parameter 'backupName' is set
      if (backupName === undefined || backupName === null) {
        throw new Error("Missing the required parameter 'backupName' when calling createCollectionBackup");
      }
      var pathParams = {
        'collectionName': collectionName,
        'backupName': backupName
      };
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['*/*'];
      var returnType = _SolrJerseyResponse["default"];
      return this.apiClient.callApi('/collections/{collectionName}/backups/{backupName}/versions', 'POST', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }

    /**
     * Callback function to receive the result of the deleteMultipleBackupsByRecency operation.
     * @callback module:api/CollectionBackupsApi~deleteMultipleBackupsByRecencyCallback
     * @param {String} error Error message, if any.
     * @param {module:model/BackupDeletionResponseBody} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Delete all incremental backup points older than the most recent N
     * @param {String} backupName 
     * @param {Object} opts Optional parameters
     * @param {Number} opts.retainLatest 
     * @param {String} opts.location 
     * @param {String} opts.repository 
     * @param {String} opts.async 
     * @param {module:api/CollectionBackupsApi~deleteMultipleBackupsByRecencyCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/BackupDeletionResponseBody}
     */
  }, {
    key: "deleteMultipleBackupsByRecency",
    value: function deleteMultipleBackupsByRecency(backupName, opts, callback) {
      opts = opts || {};
      var postBody = null;
      // verify the required parameter 'backupName' is set
      if (backupName === undefined || backupName === null) {
        throw new Error("Missing the required parameter 'backupName' when calling deleteMultipleBackupsByRecency");
      }
      var pathParams = {
        'backupName': backupName
      };
      var queryParams = {
        'retainLatest': opts['retainLatest'],
        'location': opts['location'],
        'repository': opts['repository'],
        'async': opts['async']
      };
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['*/*'];
      var returnType = _BackupDeletionResponseBody["default"];
      return this.apiClient.callApi('/backups/{backupName}/versions', 'DELETE', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }

    /**
     * Callback function to receive the result of the deleteSingleBackupById operation.
     * @callback module:api/CollectionBackupsApi~deleteSingleBackupByIdCallback
     * @param {String} error Error message, if any.
     * @param {module:model/BackupDeletionResponseBody} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Delete incremental backup point by ID
     * @param {String} backupName 
     * @param {String} backupId 
     * @param {Object} opts Optional parameters
     * @param {String} opts.location 
     * @param {String} opts.repository 
     * @param {String} opts.async 
     * @param {module:api/CollectionBackupsApi~deleteSingleBackupByIdCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/BackupDeletionResponseBody}
     */
  }, {
    key: "deleteSingleBackupById",
    value: function deleteSingleBackupById(backupName, backupId, opts, callback) {
      opts = opts || {};
      var postBody = null;
      // verify the required parameter 'backupName' is set
      if (backupName === undefined || backupName === null) {
        throw new Error("Missing the required parameter 'backupName' when calling deleteSingleBackupById");
      }
      // verify the required parameter 'backupId' is set
      if (backupId === undefined || backupId === null) {
        throw new Error("Missing the required parameter 'backupId' when calling deleteSingleBackupById");
      }
      var pathParams = {
        'backupName': backupName,
        'backupId': backupId
      };
      var queryParams = {
        'location': opts['location'],
        'repository': opts['repository'],
        'async': opts['async']
      };
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['*/*'];
      var returnType = _BackupDeletionResponseBody["default"];
      return this.apiClient.callApi('/backups/{backupName}/versions/{backupId}', 'DELETE', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }

    /**
     * Callback function to receive the result of the garbageCollectUnusedBackupFiles operation.
     * @callback module:api/CollectionBackupsApi~garbageCollectUnusedBackupFilesCallback
     * @param {String} error Error message, if any.
     * @param {module:model/PurgeUnusedResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Garbage collect orphaned incremental backup files
     * @param {String} backupName 
     * @param {Object} opts Optional parameters
     * @param {module:model/PurgeUnusedFilesRequestBody} opts.purgeUnusedFilesRequestBody Request body parameters for the orphaned file cleanup
     * @param {module:api/CollectionBackupsApi~garbageCollectUnusedBackupFilesCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/PurgeUnusedResponse}
     */
  }, {
    key: "garbageCollectUnusedBackupFiles",
    value: function garbageCollectUnusedBackupFiles(backupName, opts, callback) {
      opts = opts || {};
      var postBody = opts['purgeUnusedFilesRequestBody'];
      // verify the required parameter 'backupName' is set
      if (backupName === undefined || backupName === null) {
        throw new Error("Missing the required parameter 'backupName' when calling garbageCollectUnusedBackupFiles");
      }
      var pathParams = {
        'backupName': backupName
      };
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['*/*'];
      var returnType = _PurgeUnusedResponse["default"];
      return this.apiClient.callApi('/backups/{backupName}/purgeUnused', 'PUT', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }

    /**
     * Callback function to receive the result of the listBackupsAtLocation operation.
     * @callback module:api/CollectionBackupsApi~listBackupsAtLocationCallback
     * @param {String} error Error message, if any.
     * @param {module:model/ListCollectionBackupsResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * List existing incremental backups at the specified location.
     * @param {String} backupName 
     * @param {Object} opts Optional parameters
     * @param {String} opts.location 
     * @param {String} opts.repository 
     * @param {module:api/CollectionBackupsApi~listBackupsAtLocationCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/ListCollectionBackupsResponse}
     */
  }, {
    key: "listBackupsAtLocation",
    value: function listBackupsAtLocation(backupName, opts, callback) {
      opts = opts || {};
      var postBody = null;
      // verify the required parameter 'backupName' is set
      if (backupName === undefined || backupName === null) {
        throw new Error("Missing the required parameter 'backupName' when calling listBackupsAtLocation");
      }
      var pathParams = {
        'backupName': backupName
      };
      var queryParams = {
        'location': opts['location'],
        'repository': opts['repository']
      };
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['*/*'];
      var returnType = _ListCollectionBackupsResponse["default"];
      return this.apiClient.callApi('/backups/{backupName}/versions', 'GET', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }
  }]);
}();
},{"../ApiClient":8,"../model/BackupDeletionResponseBody":29,"../model/CreateCollectionBackupRequestBody":33,"../model/ListCollectionBackupsResponse":56,"../model/PurgeUnusedFilesRequestBody":63,"../model/PurgeUnusedResponse":64,"../model/SolrJerseyResponse":81}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
var _SolrJerseyResponse = _interopRequireDefault(require("../model/SolrJerseyResponse"));
var _UpdateCollectionPropertyRequestBody = _interopRequireDefault(require("../model/UpdateCollectionPropertyRequestBody"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
* CollectionProperties service.
* @module api/CollectionPropertiesApi
* @version 9.6.0
*/
var CollectionPropertiesApi = exports["default"] = /*#__PURE__*/function () {
  /**
  * Constructs a new CollectionPropertiesApi. 
  * @alias module:api/CollectionPropertiesApi
  * @class
  * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
  * default to {@link module:ApiClient#instance} if unspecified.
  */
  function CollectionPropertiesApi(apiClient) {
    _classCallCheck(this, CollectionPropertiesApi);
    this.apiClient = apiClient || _ApiClient["default"].instance;
  }

  /**
   * Callback function to receive the result of the createOrUpdateCollectionProperty operation.
   * @callback module:api/CollectionPropertiesApi~createOrUpdateCollectionPropertyCallback
   * @param {String} error Error message, if any.
   * @param {module:model/SolrJerseyResponse} data The data returned by the service call.
   * @param {String} response The complete HTTP response.
   */

  /**
   * Create or update a collection property
   * @param {String} collName 
   * @param {String} propName 
   * @param {Object} opts Optional parameters
   * @param {module:model/UpdateCollectionPropertyRequestBody} opts.updateCollectionPropertyRequestBody 
   * @param {module:api/CollectionPropertiesApi~createOrUpdateCollectionPropertyCallback} callback The callback function, accepting three arguments: error, data, response
   * data is of type: {@link module:model/SolrJerseyResponse}
   */
  return _createClass(CollectionPropertiesApi, [{
    key: "createOrUpdateCollectionProperty",
    value: function createOrUpdateCollectionProperty(collName, propName, opts, callback) {
      opts = opts || {};
      var postBody = opts['updateCollectionPropertyRequestBody'];
      // verify the required parameter 'collName' is set
      if (collName === undefined || collName === null) {
        throw new Error("Missing the required parameter 'collName' when calling createOrUpdateCollectionProperty");
      }
      // verify the required parameter 'propName' is set
      if (propName === undefined || propName === null) {
        throw new Error("Missing the required parameter 'propName' when calling createOrUpdateCollectionProperty");
      }
      var pathParams = {
        'collName': collName,
        'propName': propName
      };
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['*/*'];
      var returnType = _SolrJerseyResponse["default"];
      return this.apiClient.callApi('/collections/{collName}/properties/{propName}', 'PUT', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }

    /**
     * Callback function to receive the result of the deleteCollectionProperty operation.
     * @callback module:api/CollectionPropertiesApi~deleteCollectionPropertyCallback
     * @param {String} error Error message, if any.
     * @param {module:model/SolrJerseyResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Delete the specified collection property from the collection
     * @param {String} collName 
     * @param {String} propName 
     * @param {module:api/CollectionPropertiesApi~deleteCollectionPropertyCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/SolrJerseyResponse}
     */
  }, {
    key: "deleteCollectionProperty",
    value: function deleteCollectionProperty(collName, propName, callback) {
      var postBody = null;
      // verify the required parameter 'collName' is set
      if (collName === undefined || collName === null) {
        throw new Error("Missing the required parameter 'collName' when calling deleteCollectionProperty");
      }
      // verify the required parameter 'propName' is set
      if (propName === undefined || propName === null) {
        throw new Error("Missing the required parameter 'propName' when calling deleteCollectionProperty");
      }
      var pathParams = {
        'collName': collName,
        'propName': propName
      };
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['*/*'];
      var returnType = _SolrJerseyResponse["default"];
      return this.apiClient.callApi('/collections/{collName}/properties/{propName}', 'DELETE', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }
  }]);
}();
},{"../ApiClient":8,"../model/SolrJerseyResponse":81,"../model/UpdateCollectionPropertyRequestBody":87}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
var _CreateCollectionSnapshotRequestBody = _interopRequireDefault(require("../model/CreateCollectionSnapshotRequestBody"));
var _CreateCollectionSnapshotResponse = _interopRequireDefault(require("../model/CreateCollectionSnapshotResponse"));
var _DeleteCollectionSnapshotResponse = _interopRequireDefault(require("../model/DeleteCollectionSnapshotResponse"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
* CollectionSnapshots service.
* @module api/CollectionSnapshotsApi
* @version 9.6.0
*/
var CollectionSnapshotsApi = exports["default"] = /*#__PURE__*/function () {
  /**
  * Constructs a new CollectionSnapshotsApi. 
  * @alias module:api/CollectionSnapshotsApi
  * @class
  * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
  * default to {@link module:ApiClient#instance} if unspecified.
  */
  function CollectionSnapshotsApi(apiClient) {
    _classCallCheck(this, CollectionSnapshotsApi);
    this.apiClient = apiClient || _ApiClient["default"].instance;
  }

  /**
   * Callback function to receive the result of the createCollectionSnapshot operation.
   * @callback module:api/CollectionSnapshotsApi~createCollectionSnapshotCallback
   * @param {String} error Error message, if any.
   * @param {module:model/CreateCollectionSnapshotResponse} data The data returned by the service call.
   * @param {String} response The complete HTTP response.
   */

  /**
   * Creates a new snapshot of the specified collection.
   * @param {String} collName The name of the collection.
   * @param {String} snapshotName The name of the snapshot to be created.
   * @param {module:model/CreateCollectionSnapshotRequestBody} createCollectionSnapshotRequestBody Contains user provided parameters
   * @param {module:api/CollectionSnapshotsApi~createCollectionSnapshotCallback} callback The callback function, accepting three arguments: error, data, response
   * data is of type: {@link module:model/CreateCollectionSnapshotResponse}
   */
  return _createClass(CollectionSnapshotsApi, [{
    key: "createCollectionSnapshot",
    value: function createCollectionSnapshot(collName, snapshotName, createCollectionSnapshotRequestBody, callback) {
      var postBody = createCollectionSnapshotRequestBody;
      // verify the required parameter 'collName' is set
      if (collName === undefined || collName === null) {
        throw new Error("Missing the required parameter 'collName' when calling createCollectionSnapshot");
      }
      // verify the required parameter 'snapshotName' is set
      if (snapshotName === undefined || snapshotName === null) {
        throw new Error("Missing the required parameter 'snapshotName' when calling createCollectionSnapshot");
      }
      // verify the required parameter 'createCollectionSnapshotRequestBody' is set
      if (createCollectionSnapshotRequestBody === undefined || createCollectionSnapshotRequestBody === null) {
        throw new Error("Missing the required parameter 'createCollectionSnapshotRequestBody' when calling createCollectionSnapshot");
      }
      var pathParams = {
        'collName': collName,
        'snapshotName': snapshotName
      };
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['*/*'];
      var returnType = _CreateCollectionSnapshotResponse["default"];
      return this.apiClient.callApi('/collections/{collName}/snapshots/{snapshotName}', 'POST', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }

    /**
     * Callback function to receive the result of the deleteCollectionSnapshot operation.
     * @callback module:api/CollectionSnapshotsApi~deleteCollectionSnapshotCallback
     * @param {String} error Error message, if any.
     * @param {module:model/DeleteCollectionSnapshotResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Delete an existing collection-snapshot by name.
     * @param {String} collName The name of the collection.
     * @param {String} snapshotName The name of the snapshot to be deleted.
     * @param {Object} opts Optional parameters
     * @param {Boolean} opts.followAliases A flag that treats the collName parameter as a collection alias. (default to false)
     * @param {String} opts.async 
     * @param {module:api/CollectionSnapshotsApi~deleteCollectionSnapshotCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/DeleteCollectionSnapshotResponse}
     */
  }, {
    key: "deleteCollectionSnapshot",
    value: function deleteCollectionSnapshot(collName, snapshotName, opts, callback) {
      opts = opts || {};
      var postBody = null;
      // verify the required parameter 'collName' is set
      if (collName === undefined || collName === null) {
        throw new Error("Missing the required parameter 'collName' when calling deleteCollectionSnapshot");
      }
      // verify the required parameter 'snapshotName' is set
      if (snapshotName === undefined || snapshotName === null) {
        throw new Error("Missing the required parameter 'snapshotName' when calling deleteCollectionSnapshot");
      }
      var pathParams = {
        'collName': collName,
        'snapshotName': snapshotName
      };
      var queryParams = {
        'followAliases': opts['followAliases'],
        'async': opts['async']
      };
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['*/*'];
      var returnType = _DeleteCollectionSnapshotResponse["default"];
      return this.apiClient.callApi('/collections/{collName}/snapshots/{snapshotName}', 'DELETE', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }
  }]);
}();
},{"../ApiClient":8,"../model/CreateCollectionSnapshotRequestBody":36,"../model/CreateCollectionSnapshotResponse":37,"../model/DeleteCollectionSnapshotResponse":42}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
var _BalanceShardUniqueRequestBody = _interopRequireDefault(require("../model/BalanceShardUniqueRequestBody"));
var _CreateCollectionRequestBody = _interopRequireDefault(require("../model/CreateCollectionRequestBody"));
var _ListCollectionsResponse = _interopRequireDefault(require("../model/ListCollectionsResponse"));
var _ReloadCollectionRequestBody = _interopRequireDefault(require("../model/ReloadCollectionRequestBody"));
var _RenameCollectionRequestBody = _interopRequireDefault(require("../model/RenameCollectionRequestBody"));
var _SubResponseAccumulatingJerseyResponse = _interopRequireDefault(require("../model/SubResponseAccumulatingJerseyResponse"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
* Collections service.
* @module api/CollectionsApi
* @version 9.6.0
*/
var CollectionsApi = exports["default"] = /*#__PURE__*/function () {
  /**
  * Constructs a new CollectionsApi. 
  * @alias module:api/CollectionsApi
  * @class
  * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
  * default to {@link module:ApiClient#instance} if unspecified.
  */
  function CollectionsApi(apiClient) {
    _classCallCheck(this, CollectionsApi);
    this.apiClient = apiClient || _ApiClient["default"].instance;
  }

  /**
   * Callback function to receive the result of the balanceShardUnique operation.
   * @callback module:api/CollectionsApi~balanceShardUniqueCallback
   * @param {String} error Error message, if any.
   * @param {module:model/SubResponseAccumulatingJerseyResponse} data The data returned by the service call.
   * @param {String} response The complete HTTP response.
   */

  /**
   * Ensure a specified per-shard property is distributed evenly amongst physical nodes comprising a collection
   * @param {String} collectionName 
   * @param {Object} opts Optional parameters
   * @param {module:model/BalanceShardUniqueRequestBody} opts.balanceShardUniqueRequestBody 
   * @param {module:api/CollectionsApi~balanceShardUniqueCallback} callback The callback function, accepting three arguments: error, data, response
   * data is of type: {@link module:model/SubResponseAccumulatingJerseyResponse}
   */
  return _createClass(CollectionsApi, [{
    key: "balanceShardUnique",
    value: function balanceShardUnique(collectionName, opts, callback) {
      opts = opts || {};
      var postBody = opts['balanceShardUniqueRequestBody'];
      // verify the required parameter 'collectionName' is set
      if (collectionName === undefined || collectionName === null) {
        throw new Error("Missing the required parameter 'collectionName' when calling balanceShardUnique");
      }
      var pathParams = {
        'collectionName': collectionName
      };
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['*/*'];
      var returnType = _SubResponseAccumulatingJerseyResponse["default"];
      return this.apiClient.callApi('/collections/{collectionName}/balance-shard-unique', 'POST', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }

    /**
     * Callback function to receive the result of the createCollection operation.
     * @callback module:api/CollectionsApi~createCollectionCallback
     * @param {String} error Error message, if any.
     * @param {module:model/SubResponseAccumulatingJerseyResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Creates a new SolrCloud collection.
     * @param {Object} opts Optional parameters
     * @param {module:model/CreateCollectionRequestBody} opts.createCollectionRequestBody 
     * @param {module:api/CollectionsApi~createCollectionCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/SubResponseAccumulatingJerseyResponse}
     */
  }, {
    key: "createCollection",
    value: function createCollection(opts, callback) {
      opts = opts || {};
      var postBody = opts['createCollectionRequestBody'];
      var pathParams = {};
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['*/*'];
      var returnType = _SubResponseAccumulatingJerseyResponse["default"];
      return this.apiClient.callApi('/collections', 'POST', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }

    /**
     * Callback function to receive the result of the deleteCollection operation.
     * @callback module:api/CollectionsApi~deleteCollectionCallback
     * @param {String} error Error message, if any.
     * @param {module:model/SubResponseAccumulatingJerseyResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Deletes a collection from SolrCloud
     * @param {String} collectionName The name of the collection to be deleted.
     * @param {Object} opts Optional parameters
     * @param {Boolean} opts.followAliases 
     * @param {String} opts.async An ID to track the request asynchronously
     * @param {module:api/CollectionsApi~deleteCollectionCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/SubResponseAccumulatingJerseyResponse}
     */
  }, {
    key: "deleteCollection",
    value: function deleteCollection(collectionName, opts, callback) {
      opts = opts || {};
      var postBody = null;
      // verify the required parameter 'collectionName' is set
      if (collectionName === undefined || collectionName === null) {
        throw new Error("Missing the required parameter 'collectionName' when calling deleteCollection");
      }
      var pathParams = {
        'collectionName': collectionName
      };
      var queryParams = {
        'followAliases': opts['followAliases'],
        'async': opts['async']
      };
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['*/*'];
      var returnType = _SubResponseAccumulatingJerseyResponse["default"];
      return this.apiClient.callApi('/collections/{collectionName}', 'DELETE', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }

    /**
     * Callback function to receive the result of the listCollections operation.
     * @callback module:api/CollectionsApi~listCollectionsCallback
     * @param {String} error Error message, if any.
     * @param {module:model/ListCollectionsResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * List all collections in this Solr cluster
     * @param {module:api/CollectionsApi~listCollectionsCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/ListCollectionsResponse}
     */
  }, {
    key: "listCollections",
    value: function listCollections(callback) {
      var postBody = null;
      var pathParams = {};
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['*/*'];
      var returnType = _ListCollectionsResponse["default"];
      return this.apiClient.callApi('/collections', 'GET', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }

    /**
     * Callback function to receive the result of the reloadCollection operation.
     * @callback module:api/CollectionsApi~reloadCollectionCallback
     * @param {String} error Error message, if any.
     * @param {module:model/SubResponseAccumulatingJerseyResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Reload all cores in the specified collection.
     * @param {String} collectionName 
     * @param {Object} opts Optional parameters
     * @param {module:model/ReloadCollectionRequestBody} opts.reloadCollectionRequestBody 
     * @param {module:api/CollectionsApi~reloadCollectionCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/SubResponseAccumulatingJerseyResponse}
     */
  }, {
    key: "reloadCollection",
    value: function reloadCollection(collectionName, opts, callback) {
      opts = opts || {};
      var postBody = opts['reloadCollectionRequestBody'];
      // verify the required parameter 'collectionName' is set
      if (collectionName === undefined || collectionName === null) {
        throw new Error("Missing the required parameter 'collectionName' when calling reloadCollection");
      }
      var pathParams = {
        'collectionName': collectionName
      };
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['*/*'];
      var returnType = _SubResponseAccumulatingJerseyResponse["default"];
      return this.apiClient.callApi('/collections/{collectionName}/reload', 'POST', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }

    /**
     * Callback function to receive the result of the renameCollection operation.
     * @callback module:api/CollectionsApi~renameCollectionCallback
     * @param {String} error Error message, if any.
     * @param {module:model/SubResponseAccumulatingJerseyResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Rename a SolrCloud collection
     * @param {String} collectionName 
     * @param {Object} opts Optional parameters
     * @param {module:model/RenameCollectionRequestBody} opts.renameCollectionRequestBody 
     * @param {module:api/CollectionsApi~renameCollectionCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/SubResponseAccumulatingJerseyResponse}
     */
  }, {
    key: "renameCollection",
    value: function renameCollection(collectionName, opts, callback) {
      opts = opts || {};
      var postBody = opts['renameCollectionRequestBody'];
      // verify the required parameter 'collectionName' is set
      if (collectionName === undefined || collectionName === null) {
        throw new Error("Missing the required parameter 'collectionName' when calling renameCollection");
      }
      var pathParams = {
        'collectionName': collectionName
      };
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['*/*'];
      var returnType = _SubResponseAccumulatingJerseyResponse["default"];
      return this.apiClient.callApi('/collections/{collectionName}/rename', 'POST', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }
  }]);
}();
},{"../ApiClient":8,"../model/BalanceShardUniqueRequestBody":31,"../model/CreateCollectionRequestBody":34,"../model/ListCollectionsResponse":57,"../model/ReloadCollectionRequestBody":66,"../model/RenameCollectionRequestBody":68,"../model/SubResponseAccumulatingJerseyResponse":82}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
var _ListConfigsetsResponse = _interopRequireDefault(require("../model/ListConfigsetsResponse"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
* Configsets service.
* @module api/ConfigsetsApi
* @version 9.6.0
*/
var ConfigsetsApi = exports["default"] = /*#__PURE__*/function () {
  /**
  * Constructs a new ConfigsetsApi. 
  * @alias module:api/ConfigsetsApi
  * @class
  * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
  * default to {@link module:ApiClient#instance} if unspecified.
  */
  function ConfigsetsApi(apiClient) {
    _classCallCheck(this, ConfigsetsApi);
    this.apiClient = apiClient || _ApiClient["default"].instance;
  }

  /**
   * Callback function to receive the result of the listConfigSet operation.
   * @callback module:api/ConfigsetsApi~listConfigSetCallback
   * @param {String} error Error message, if any.
   * @param {module:model/ListConfigsetsResponse} data The data returned by the service call.
   * @param {String} response The complete HTTP response.
   */

  /**
   * List the configsets available to Solr.
   * @param {module:api/ConfigsetsApi~listConfigSetCallback} callback The callback function, accepting three arguments: error, data, response
   * data is of type: {@link module:model/ListConfigsetsResponse}
   */
  return _createClass(ConfigsetsApi, [{
    key: "listConfigSet",
    value: function listConfigSet(callback) {
      var postBody = null;
      var pathParams = {};
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['*/*'];
      var returnType = _ListConfigsetsResponse["default"];
      return this.apiClient.callApi('/cluster/configs', 'GET', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }
  }]);
}();
},{"../ApiClient":8,"../model/ListConfigsetsResponse":58}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
var _CreateCoreBackupRequestBody = _interopRequireDefault(require("../model/CreateCoreBackupRequestBody"));
var _SolrJerseyResponse = _interopRequireDefault(require("../model/SolrJerseyResponse"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
* CoreBackups service.
* @module api/CoreBackupsApi
* @version 9.6.0
*/
var CoreBackupsApi = exports["default"] = /*#__PURE__*/function () {
  /**
  * Constructs a new CoreBackupsApi. 
  * @alias module:api/CoreBackupsApi
  * @class
  * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
  * default to {@link module:ApiClient#instance} if unspecified.
  */
  function CoreBackupsApi(apiClient) {
    _classCallCheck(this, CoreBackupsApi);
    this.apiClient = apiClient || _ApiClient["default"].instance;
  }

  /**
   * Callback function to receive the result of the createBackup operation.
   * @callback module:api/CoreBackupsApi~createBackupCallback
   * @param {String} error Error message, if any.
   * @param {module:model/SolrJerseyResponse} data The data returned by the service call.
   * @param {String} response The complete HTTP response.
   */

  /**
   * Creates a core-level backup
   * @param {String} coreName The name of the core.
   * @param {Object} opts Optional parameters
   * @param {module:model/CreateCoreBackupRequestBody} opts.createCoreBackupRequestBody 
   * @param {module:api/CoreBackupsApi~createBackupCallback} callback The callback function, accepting three arguments: error, data, response
   * data is of type: {@link module:model/SolrJerseyResponse}
   */
  return _createClass(CoreBackupsApi, [{
    key: "createBackup",
    value: function createBackup(coreName, opts, callback) {
      opts = opts || {};
      var postBody = opts['createCoreBackupRequestBody'];
      // verify the required parameter 'coreName' is set
      if (coreName === undefined || coreName === null) {
        throw new Error("Missing the required parameter 'coreName' when calling createBackup");
      }
      var pathParams = {
        'coreName': coreName
      };
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['*/*'];
      var returnType = _SolrJerseyResponse["default"];
      return this.apiClient.callApi('/cores/{coreName}/backups', 'POST', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }
  }]);
}();
},{"../ApiClient":8,"../model/CreateCoreBackupRequestBody":38,"../model/SolrJerseyResponse":81}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
var _CreateCoreSnapshotResponse = _interopRequireDefault(require("../model/CreateCoreSnapshotResponse"));
var _DeleteSnapshotResponse = _interopRequireDefault(require("../model/DeleteSnapshotResponse"));
var _ListCoreSnapshotsResponse = _interopRequireDefault(require("../model/ListCoreSnapshotsResponse"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
* CoreSnapshots service.
* @module api/CoreSnapshotsApi
* @version 9.6.0
*/
var CoreSnapshotsApi = exports["default"] = /*#__PURE__*/function () {
  /**
  * Constructs a new CoreSnapshotsApi. 
  * @alias module:api/CoreSnapshotsApi
  * @class
  * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
  * default to {@link module:ApiClient#instance} if unspecified.
  */
  function CoreSnapshotsApi(apiClient) {
    _classCallCheck(this, CoreSnapshotsApi);
    this.apiClient = apiClient || _ApiClient["default"].instance;
  }

  /**
   * Callback function to receive the result of the createSnapshot operation.
   * @callback module:api/CoreSnapshotsApi~createSnapshotCallback
   * @param {String} error Error message, if any.
   * @param {module:model/CreateCoreSnapshotResponse} data The data returned by the service call.
   * @param {String} response The complete HTTP response.
   */

  /**
   * Create a new snapshot of the specified core.
   * @param {String} coreName The name of the core to snapshot.
   * @param {String} snapshotName The name to associate with the core snapshot.
   * @param {Object} opts Optional parameters
   * @param {String} opts.async The id to associate with the async task.
   * @param {module:api/CoreSnapshotsApi~createSnapshotCallback} callback The callback function, accepting three arguments: error, data, response
   * data is of type: {@link module:model/CreateCoreSnapshotResponse}
   */
  return _createClass(CoreSnapshotsApi, [{
    key: "createSnapshot",
    value: function createSnapshot(coreName, snapshotName, opts, callback) {
      opts = opts || {};
      var postBody = null;
      // verify the required parameter 'coreName' is set
      if (coreName === undefined || coreName === null) {
        throw new Error("Missing the required parameter 'coreName' when calling createSnapshot");
      }
      // verify the required parameter 'snapshotName' is set
      if (snapshotName === undefined || snapshotName === null) {
        throw new Error("Missing the required parameter 'snapshotName' when calling createSnapshot");
      }
      var pathParams = {
        'coreName': coreName,
        'snapshotName': snapshotName
      };
      var queryParams = {
        'async': opts['async']
      };
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['*/*'];
      var returnType = _CreateCoreSnapshotResponse["default"];
      return this.apiClient.callApi('/cores/{coreName}/snapshots/{snapshotName}', 'POST', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }

    /**
     * Callback function to receive the result of the deleteSnapshot operation.
     * @callback module:api/CoreSnapshotsApi~deleteSnapshotCallback
     * @param {String} error Error message, if any.
     * @param {module:model/DeleteSnapshotResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Delete a single snapshot from the specified core.
     * @param {String} coreName The name of the core for which to delete a snapshot.
     * @param {String} snapshotName The name of the core snapshot to delete.
     * @param {Object} opts Optional parameters
     * @param {String} opts.async The id to associate with the async task.
     * @param {module:api/CoreSnapshotsApi~deleteSnapshotCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/DeleteSnapshotResponse}
     */
  }, {
    key: "deleteSnapshot",
    value: function deleteSnapshot(coreName, snapshotName, opts, callback) {
      opts = opts || {};
      var postBody = null;
      // verify the required parameter 'coreName' is set
      if (coreName === undefined || coreName === null) {
        throw new Error("Missing the required parameter 'coreName' when calling deleteSnapshot");
      }
      // verify the required parameter 'snapshotName' is set
      if (snapshotName === undefined || snapshotName === null) {
        throw new Error("Missing the required parameter 'snapshotName' when calling deleteSnapshot");
      }
      var pathParams = {
        'coreName': coreName,
        'snapshotName': snapshotName
      };
      var queryParams = {
        'async': opts['async']
      };
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['*/*'];
      var returnType = _DeleteSnapshotResponse["default"];
      return this.apiClient.callApi('/cores/{coreName}/snapshots/{snapshotName}', 'DELETE', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }

    /**
     * Callback function to receive the result of the listSnapshots operation.
     * @callback module:api/CoreSnapshotsApi~listSnapshotsCallback
     * @param {String} error Error message, if any.
     * @param {module:model/ListCoreSnapshotsResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * List existing snapshots for the specified core.
     * @param {String} coreName The name of the core for which to retrieve snapshots.
     * @param {module:api/CoreSnapshotsApi~listSnapshotsCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/ListCoreSnapshotsResponse}
     */
  }, {
    key: "listSnapshots",
    value: function listSnapshots(coreName, callback) {
      var postBody = null;
      // verify the required parameter 'coreName' is set
      if (coreName === undefined || coreName === null) {
        throw new Error("Missing the required parameter 'coreName' when calling listSnapshots");
      }
      var pathParams = {
        'coreName': coreName
      };
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['*/*'];
      var returnType = _ListCoreSnapshotsResponse["default"];
      return this.apiClient.callApi('/cores/{coreName}/snapshots', 'GET', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }
  }]);
}();
},{"../ApiClient":8,"../model/CreateCoreSnapshotResponse":39,"../model/DeleteSnapshotResponse":44,"../model/ListCoreSnapshotsResponse":59}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
var _InstallCoreDataRequestBody = _interopRequireDefault(require("../model/InstallCoreDataRequestBody"));
var _MergeIndexesRequestBody = _interopRequireDefault(require("../model/MergeIndexesRequestBody"));
var _RenameCoreRequestBody = _interopRequireDefault(require("../model/RenameCoreRequestBody"));
var _RestoreCoreRequestBody = _interopRequireDefault(require("../model/RestoreCoreRequestBody"));
var _SolrJerseyResponse = _interopRequireDefault(require("../model/SolrJerseyResponse"));
var _SwapCoresRequestBody = _interopRequireDefault(require("../model/SwapCoresRequestBody"));
var _UnloadCoreRequestBody = _interopRequireDefault(require("../model/UnloadCoreRequestBody"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
* Cores service.
* @module api/CoresApi
* @version 9.6.0
*/
var CoresApi = exports["default"] = /*#__PURE__*/function () {
  /**
  * Constructs a new CoresApi. 
  * @alias module:api/CoresApi
  * @class
  * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
  * default to {@link module:ApiClient#instance} if unspecified.
  */
  function CoresApi(apiClient) {
    _classCallCheck(this, CoresApi);
    this.apiClient = apiClient || _ApiClient["default"].instance;
  }

  /**
   * Callback function to receive the result of the installCoreData operation.
   * @callback module:api/CoresApi~installCoreDataCallback
   * @param {String} error Error message, if any.
   * @param {module:model/SolrJerseyResponse} data The data returned by the service call.
   * @param {String} response The complete HTTP response.
   */

  /**
   * Install an offline index to a specified core
   * @param {String} coreName 
   * @param {Object} opts Optional parameters
   * @param {module:model/InstallCoreDataRequestBody} opts.installCoreDataRequestBody 
   * @param {module:api/CoresApi~installCoreDataCallback} callback The callback function, accepting three arguments: error, data, response
   * data is of type: {@link module:model/SolrJerseyResponse}
   */
  return _createClass(CoresApi, [{
    key: "installCoreData",
    value: function installCoreData(coreName, opts, callback) {
      opts = opts || {};
      var postBody = opts['installCoreDataRequestBody'];
      // verify the required parameter 'coreName' is set
      if (coreName === undefined || coreName === null) {
        throw new Error("Missing the required parameter 'coreName' when calling installCoreData");
      }
      var pathParams = {
        'coreName': coreName
      };
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['*/*'];
      var returnType = _SolrJerseyResponse["default"];
      return this.apiClient.callApi('/cores/{coreName}/install', 'POST', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }

    /**
     * Callback function to receive the result of the mergeIndexes operation.
     * @callback module:api/CoresApi~mergeIndexesCallback
     * @param {String} error Error message, if any.
     * @param {module:model/SolrJerseyResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * The MERGEINDEXES action merges one or more indexes to another index.
     * @param {String} coreName The core that the specified indices are merged into.
     * @param {Object} opts Optional parameters
     * @param {module:model/MergeIndexesRequestBody} opts.mergeIndexesRequestBody Additional properties for merge indexes.
     * @param {module:api/CoresApi~mergeIndexesCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/SolrJerseyResponse}
     */
  }, {
    key: "mergeIndexes",
    value: function mergeIndexes(coreName, opts, callback) {
      opts = opts || {};
      var postBody = opts['mergeIndexesRequestBody'];
      // verify the required parameter 'coreName' is set
      if (coreName === undefined || coreName === null) {
        throw new Error("Missing the required parameter 'coreName' when calling mergeIndexes");
      }
      var pathParams = {
        'coreName': coreName
      };
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['*/*'];
      var returnType = _SolrJerseyResponse["default"];
      return this.apiClient.callApi('/cores/{coreName}/merge-indices', 'POST', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }

    /**
     * Callback function to receive the result of the reloadCore operation.
     * @callback module:api/CoresApi~reloadCoreCallback
     * @param {String} error Error message, if any.
     * @param {module:model/SolrJerseyResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Reload the specified core.
     * @param {String} coreName The name of the core to reload.
     * @param {module:api/CoresApi~reloadCoreCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/SolrJerseyResponse}
     */
  }, {
    key: "reloadCore",
    value: function reloadCore(coreName, callback) {
      var postBody = null;
      // verify the required parameter 'coreName' is set
      if (coreName === undefined || coreName === null) {
        throw new Error("Missing the required parameter 'coreName' when calling reloadCore");
      }
      var pathParams = {
        'coreName': coreName
      };
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['*/*'];
      var returnType = _SolrJerseyResponse["default"];
      return this.apiClient.callApi('/cores/{coreName}/reload', 'POST', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }

    /**
     * Callback function to receive the result of the renameCore operation.
     * @callback module:api/CoresApi~renameCoreCallback
     * @param {String} error Error message, if any.
     * @param {module:model/SolrJerseyResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * The RENAME action changes the name of a Solr core
     * @param {String} coreName 
     * @param {Object} opts Optional parameters
     * @param {module:model/RenameCoreRequestBody} opts.renameCoreRequestBody Additional properties related to the core renaming
     * @param {module:api/CoresApi~renameCoreCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/SolrJerseyResponse}
     */
  }, {
    key: "renameCore",
    value: function renameCore(coreName, opts, callback) {
      opts = opts || {};
      var postBody = opts['renameCoreRequestBody'];
      // verify the required parameter 'coreName' is set
      if (coreName === undefined || coreName === null) {
        throw new Error("Missing the required parameter 'coreName' when calling renameCore");
      }
      var pathParams = {
        'coreName': coreName
      };
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['*/*'];
      var returnType = _SolrJerseyResponse["default"];
      return this.apiClient.callApi('/cores/{coreName}/rename', 'POST', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }

    /**
     * Callback function to receive the result of the restoreCore operation.
     * @callback module:api/CoresApi~restoreCoreCallback
     * @param {String} error Error message, if any.
     * @param {module:model/SolrJerseyResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Restore a previously-taken backup to the specified core
     * @param {String} coreName The name of the core to be restored
     * @param {Object} opts Optional parameters
     * @param {module:model/RestoreCoreRequestBody} opts.restoreCoreRequestBody 
     * @param {module:api/CoresApi~restoreCoreCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/SolrJerseyResponse}
     */
  }, {
    key: "restoreCore",
    value: function restoreCore(coreName, opts, callback) {
      opts = opts || {};
      var postBody = opts['restoreCoreRequestBody'];
      // verify the required parameter 'coreName' is set
      if (coreName === undefined || coreName === null) {
        throw new Error("Missing the required parameter 'coreName' when calling restoreCore");
      }
      var pathParams = {
        'coreName': coreName
      };
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['*/*'];
      var returnType = _SolrJerseyResponse["default"];
      return this.apiClient.callApi('/cores/{coreName}/restore', 'POST', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }

    /**
     * Callback function to receive the result of the swapCores operation.
     * @callback module:api/CoresApi~swapCoresCallback
     * @param {String} error Error message, if any.
     * @param {module:model/SolrJerseyResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * SWAP atomically swaps the names used to access two existing Solr cores.
     * @param {String} coreName 
     * @param {Object} opts Optional parameters
     * @param {module:model/SwapCoresRequestBody} opts.swapCoresRequestBody Additional properties related to core swapping.
     * @param {module:api/CoresApi~swapCoresCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/SolrJerseyResponse}
     */
  }, {
    key: "swapCores",
    value: function swapCores(coreName, opts, callback) {
      opts = opts || {};
      var postBody = opts['swapCoresRequestBody'];
      // verify the required parameter 'coreName' is set
      if (coreName === undefined || coreName === null) {
        throw new Error("Missing the required parameter 'coreName' when calling swapCores");
      }
      var pathParams = {
        'coreName': coreName
      };
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['*/*'];
      var returnType = _SolrJerseyResponse["default"];
      return this.apiClient.callApi('/cores/{coreName}/swap', 'POST', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }

    /**
     * Callback function to receive the result of the unloadCore operation.
     * @callback module:api/CoresApi~unloadCoreCallback
     * @param {String} error Error message, if any.
     * @param {module:model/SolrJerseyResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Unloads a single core specified by name
     * @param {String} coreName 
     * @param {Object} opts Optional parameters
     * @param {module:model/UnloadCoreRequestBody} opts.unloadCoreRequestBody Additional properties related to the core unloading
     * @param {module:api/CoresApi~unloadCoreCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/SolrJerseyResponse}
     */
  }, {
    key: "unloadCore",
    value: function unloadCore(coreName, opts, callback) {
      opts = opts || {};
      var postBody = opts['unloadCoreRequestBody'];
      // verify the required parameter 'coreName' is set
      if (coreName === undefined || coreName === null) {
        throw new Error("Missing the required parameter 'coreName' when calling unloadCore");
      }
      var pathParams = {
        'coreName': coreName
      };
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['*/*'];
      var returnType = _SolrJerseyResponse["default"];
      return this.apiClient.callApi('/cores/{coreName}/unload', 'POST', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }
  }]);
}();
},{"../ApiClient":8,"../model/InstallCoreDataRequestBody":53,"../model/MergeIndexesRequestBody":60,"../model/RenameCoreRequestBody":69,"../model/RestoreCoreRequestBody":72,"../model/SolrJerseyResponse":81,"../model/SwapCoresRequestBody":83,"../model/UnloadCoreRequestBody":84}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
var _DeleteNodeRequestBody = _interopRequireDefault(require("../model/DeleteNodeRequestBody"));
var _GetNodeCommandStatusResponse = _interopRequireDefault(require("../model/GetNodeCommandStatusResponse"));
var _PublicKeyResponse = _interopRequireDefault(require("../model/PublicKeyResponse"));
var _ReplaceNodeRequestBody = _interopRequireDefault(require("../model/ReplaceNodeRequestBody"));
var _SolrJerseyResponse = _interopRequireDefault(require("../model/SolrJerseyResponse"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
* Node service.
* @module api/NodeApi
* @version 9.6.0
*/
var NodeApi = exports["default"] = /*#__PURE__*/function () {
  /**
  * Constructs a new NodeApi. 
  * @alias module:api/NodeApi
  * @class
  * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
  * default to {@link module:ApiClient#instance} if unspecified.
  */
  function NodeApi(apiClient) {
    _classCallCheck(this, NodeApi);
    this.apiClient = apiClient || _ApiClient["default"].instance;
  }

  /**
   * Callback function to receive the result of the deleteNode operation.
   * @callback module:api/NodeApi~deleteNodeCallback
   * @param {String} error Error message, if any.
   * @param {module:model/SolrJerseyResponse} data The data returned by the service call.
   * @param {String} response The complete HTTP response.
   */

  /**
   * Delete all replicas off of the specified SolrCloud node
   * @param {String} nodeName The name of the node to be cleared.  Usually of the form 'host:1234_solr'.
   * @param {module:model/DeleteNodeRequestBody} deleteNodeRequestBody Contains user provided parameters
   * @param {module:api/NodeApi~deleteNodeCallback} callback The callback function, accepting three arguments: error, data, response
   * data is of type: {@link module:model/SolrJerseyResponse}
   */
  return _createClass(NodeApi, [{
    key: "deleteNode",
    value: function deleteNode(nodeName, deleteNodeRequestBody, callback) {
      var postBody = deleteNodeRequestBody;
      // verify the required parameter 'nodeName' is set
      if (nodeName === undefined || nodeName === null) {
        throw new Error("Missing the required parameter 'nodeName' when calling deleteNode");
      }
      // verify the required parameter 'deleteNodeRequestBody' is set
      if (deleteNodeRequestBody === undefined || deleteNodeRequestBody === null) {
        throw new Error("Missing the required parameter 'deleteNodeRequestBody' when calling deleteNode");
      }
      var pathParams = {
        'nodeName': nodeName
      };
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['*/*'];
      var returnType = _SolrJerseyResponse["default"];
      return this.apiClient.callApi('/cluster/nodes/{nodeName}/clear', 'POST', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }

    /**
     * Callback function to receive the result of the getCommandStatus operation.
     * @callback module:api/NodeApi~getCommandStatusCallback
     * @param {String} error Error message, if any.
     * @param {module:model/GetNodeCommandStatusResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Request the status of an already submitted asynchronous CoreAdmin API call.
     * @param {String} requestId The user defined request-id for the asynchronous request.
     * @param {module:api/NodeApi~getCommandStatusCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/GetNodeCommandStatusResponse}
     */
  }, {
    key: "getCommandStatus",
    value: function getCommandStatus(requestId, callback) {
      var postBody = null;
      // verify the required parameter 'requestId' is set
      if (requestId === undefined || requestId === null) {
        throw new Error("Missing the required parameter 'requestId' when calling getCommandStatus");
      }
      var pathParams = {
        'requestId': requestId
      };
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['*/*'];
      var returnType = _GetNodeCommandStatusResponse["default"];
      return this.apiClient.callApi('/node/commands/{requestId}', 'GET', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }

    /**
     * Callback function to receive the result of the getPublicKey operation.
     * @callback module:api/NodeApi~getPublicKeyCallback
     * @param {String} error Error message, if any.
     * @param {module:model/PublicKeyResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Retrieve the public key of the receiving Solr node.
     * @param {module:api/NodeApi~getPublicKeyCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/PublicKeyResponse}
     */
  }, {
    key: "getPublicKey",
    value: function getPublicKey(callback) {
      var postBody = null;
      var pathParams = {};
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['*/*'];
      var returnType = _PublicKeyResponse["default"];
      return this.apiClient.callApi('/node/key', 'GET', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }

    /**
     * Callback function to receive the result of the replaceNode operation.
     * @callback module:api/NodeApi~replaceNodeCallback
     * @param {String} error Error message, if any.
     * @param {module:model/SolrJerseyResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * 'Replace' a specified node by moving all replicas elsewhere
     * @param {String} sourceNodeName The name of the node to be replaced.
     * @param {module:model/ReplaceNodeRequestBody} replaceNodeRequestBody Contains user provided parameters
     * @param {module:api/NodeApi~replaceNodeCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/SolrJerseyResponse}
     */
  }, {
    key: "replaceNode",
    value: function replaceNode(sourceNodeName, replaceNodeRequestBody, callback) {
      var postBody = replaceNodeRequestBody;
      // verify the required parameter 'sourceNodeName' is set
      if (sourceNodeName === undefined || sourceNodeName === null) {
        throw new Error("Missing the required parameter 'sourceNodeName' when calling replaceNode");
      }
      // verify the required parameter 'replaceNodeRequestBody' is set
      if (replaceNodeRequestBody === undefined || replaceNodeRequestBody === null) {
        throw new Error("Missing the required parameter 'replaceNodeRequestBody' when calling replaceNode");
      }
      var pathParams = {
        'sourceNodeName': sourceNodeName
      };
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['*/*'];
      var returnType = _SolrJerseyResponse["default"];
      return this.apiClient.callApi('/cluster/nodes/{sourceNodeName}/replace', 'POST', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }
  }]);
}();
},{"../ApiClient":8,"../model/DeleteNodeRequestBody":43,"../model/GetNodeCommandStatusResponse":51,"../model/PublicKeyResponse":62,"../model/ReplaceNodeRequestBody":70,"../model/SolrJerseyResponse":81}],21:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
var _FlexibleSolrJerseyResponse = _interopRequireDefault(require("../model/FlexibleSolrJerseyResponse"));
var _IndexType = _interopRequireDefault(require("../model/IndexType"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
* Querying service.
* @module api/QueryingApi
* @version 9.6.0
*/
var QueryingApi = exports["default"] = /*#__PURE__*/function () {
  /**
  * Constructs a new QueryingApi. 
  * @alias module:api/QueryingApi
  * @class
  * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
  * default to {@link module:ApiClient#instance} if unspecified.
  */
  function QueryingApi(apiClient) {
    _classCallCheck(this, QueryingApi);
    this.apiClient = apiClient || _ApiClient["default"].instance;
  }

  /**
   * Callback function to receive the result of the jsonQuery operation.
   * @callback module:api/QueryingApi~jsonQueryCallback
   * @param {String} error Error message, if any.
   * @param {module:model/FlexibleSolrJerseyResponse} data The data returned by the service call.
   * @param {String} response The complete HTTP response.
   */

  /**
   * Query a Solr core or collection using the structured request DSL
   * @param {module:model/IndexType} indexType 
   * @param {String} indexName 
   * @param {Object.<String, Object>} body 
   * @param {module:api/QueryingApi~jsonQueryCallback} callback The callback function, accepting three arguments: error, data, response
   * data is of type: {@link module:model/FlexibleSolrJerseyResponse}
   */
  return _createClass(QueryingApi, [{
    key: "jsonQuery",
    value: function jsonQuery(indexType, indexName, body, callback) {
      var postBody = body;
      // verify the required parameter 'indexType' is set
      if (indexType === undefined || indexType === null) {
        throw new Error("Missing the required parameter 'indexType' when calling jsonQuery");
      }
      // verify the required parameter 'indexName' is set
      if (indexName === undefined || indexName === null) {
        throw new Error("Missing the required parameter 'indexName' when calling jsonQuery");
      }
      // verify the required parameter 'body' is set
      if (body === undefined || body === null) {
        throw new Error("Missing the required parameter 'body' when calling jsonQuery");
      }
      var pathParams = {
        'indexType': indexType,
        'indexName': indexName
      };
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['*/*'];
      var returnType = _FlexibleSolrJerseyResponse["default"];
      return this.apiClient.callApi('/{indexType}/{indexName}/select', 'POST', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }

    /**
     * Callback function to receive the result of the query operation.
     * @callback module:api/QueryingApi~queryCallback
     * @param {String} error Error message, if any.
     * @param {module:model/FlexibleSolrJerseyResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Query a Solr core or collection using individual query parameters
     * @param {module:model/IndexType} indexType 
     * @param {String} indexName 
     * @param {Object} opts Optional parameters
     * @param {String} opts.q 
     * @param {Array.<String>} opts.fq 
     * @param {String} opts.fl 
     * @param {Number} opts.rows 
     * @param {module:api/QueryingApi~queryCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/FlexibleSolrJerseyResponse}
     */
  }, {
    key: "query",
    value: function query(indexType, indexName, opts, callback) {
      opts = opts || {};
      var postBody = null;
      // verify the required parameter 'indexType' is set
      if (indexType === undefined || indexType === null) {
        throw new Error("Missing the required parameter 'indexType' when calling query");
      }
      // verify the required parameter 'indexName' is set
      if (indexName === undefined || indexName === null) {
        throw new Error("Missing the required parameter 'indexName' when calling query");
      }
      var pathParams = {
        'indexType': indexType,
        'indexName': indexName
      };
      var queryParams = {
        'q': opts['q'],
        'fq': this.apiClient.buildCollectionParam(opts['fq'], 'multi'),
        'fl': opts['fl'],
        'rows': opts['rows']
      };
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['*/*'];
      var returnType = _FlexibleSolrJerseyResponse["default"];
      return this.apiClient.callApi('/{indexType}/{indexName}/select', 'GET', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }
  }]);
}();
},{"../ApiClient":8,"../model/FlexibleSolrJerseyResponse":47,"../model/IndexType":52}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
var _AddReplicaPropertyRequestBody = _interopRequireDefault(require("../model/AddReplicaPropertyRequestBody"));
var _SolrJerseyResponse = _interopRequireDefault(require("../model/SolrJerseyResponse"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
* ReplicaProperties service.
* @module api/ReplicaPropertiesApi
* @version 9.6.0
*/
var ReplicaPropertiesApi = exports["default"] = /*#__PURE__*/function () {
  /**
  * Constructs a new ReplicaPropertiesApi. 
  * @alias module:api/ReplicaPropertiesApi
  * @class
  * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
  * default to {@link module:ApiClient#instance} if unspecified.
  */
  function ReplicaPropertiesApi(apiClient) {
    _classCallCheck(this, ReplicaPropertiesApi);
    this.apiClient = apiClient || _ApiClient["default"].instance;
  }

  /**
   * Callback function to receive the result of the addReplicaProperty operation.
   * @callback module:api/ReplicaPropertiesApi~addReplicaPropertyCallback
   * @param {String} error Error message, if any.
   * @param {module:model/SolrJerseyResponse} data The data returned by the service call.
   * @param {String} response The complete HTTP response.
   */

  /**
   * Adds a property to the specified replica
   * @param {String} collName The name of the collection the replica belongs to.
   * @param {String} shardName The name of the shard the replica belongs to.
   * @param {String} replicaName The replica, e.g., `core_node1`.
   * @param {String} propName The name of the property to add.
   * @param {module:model/AddReplicaPropertyRequestBody} addReplicaPropertyRequestBody The value of the replica property to create or update
   * @param {module:api/ReplicaPropertiesApi~addReplicaPropertyCallback} callback The callback function, accepting three arguments: error, data, response
   * data is of type: {@link module:model/SolrJerseyResponse}
   */
  return _createClass(ReplicaPropertiesApi, [{
    key: "addReplicaProperty",
    value: function addReplicaProperty(collName, shardName, replicaName, propName, addReplicaPropertyRequestBody, callback) {
      var postBody = addReplicaPropertyRequestBody;
      // verify the required parameter 'collName' is set
      if (collName === undefined || collName === null) {
        throw new Error("Missing the required parameter 'collName' when calling addReplicaProperty");
      }
      // verify the required parameter 'shardName' is set
      if (shardName === undefined || shardName === null) {
        throw new Error("Missing the required parameter 'shardName' when calling addReplicaProperty");
      }
      // verify the required parameter 'replicaName' is set
      if (replicaName === undefined || replicaName === null) {
        throw new Error("Missing the required parameter 'replicaName' when calling addReplicaProperty");
      }
      // verify the required parameter 'propName' is set
      if (propName === undefined || propName === null) {
        throw new Error("Missing the required parameter 'propName' when calling addReplicaProperty");
      }
      // verify the required parameter 'addReplicaPropertyRequestBody' is set
      if (addReplicaPropertyRequestBody === undefined || addReplicaPropertyRequestBody === null) {
        throw new Error("Missing the required parameter 'addReplicaPropertyRequestBody' when calling addReplicaProperty");
      }
      var pathParams = {
        'collName': collName,
        'shardName': shardName,
        'replicaName': replicaName,
        'propName': propName
      };
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['*/*'];
      var returnType = _SolrJerseyResponse["default"];
      return this.apiClient.callApi('/collections/{collName}/shards/{shardName}/replicas/{replicaName}/properties/{propName}', 'PUT', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }

    /**
     * Callback function to receive the result of the deleteReplicaProperty operation.
     * @callback module:api/ReplicaPropertiesApi~deleteReplicaPropertyCallback
     * @param {String} error Error message, if any.
     * @param {module:model/SolrJerseyResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Delete an existing replica property
     * @param {String} collName The name of the collection the replica belongs to.
     * @param {String} shardName The name of the shard the replica belongs to.
     * @param {String} replicaName The replica, e.g., `core_node1`.
     * @param {String} propName The name of the property to delete.
     * @param {module:api/ReplicaPropertiesApi~deleteReplicaPropertyCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/SolrJerseyResponse}
     */
  }, {
    key: "deleteReplicaProperty",
    value: function deleteReplicaProperty(collName, shardName, replicaName, propName, callback) {
      var postBody = null;
      // verify the required parameter 'collName' is set
      if (collName === undefined || collName === null) {
        throw new Error("Missing the required parameter 'collName' when calling deleteReplicaProperty");
      }
      // verify the required parameter 'shardName' is set
      if (shardName === undefined || shardName === null) {
        throw new Error("Missing the required parameter 'shardName' when calling deleteReplicaProperty");
      }
      // verify the required parameter 'replicaName' is set
      if (replicaName === undefined || replicaName === null) {
        throw new Error("Missing the required parameter 'replicaName' when calling deleteReplicaProperty");
      }
      // verify the required parameter 'propName' is set
      if (propName === undefined || propName === null) {
        throw new Error("Missing the required parameter 'propName' when calling deleteReplicaProperty");
      }
      var pathParams = {
        'collName': collName,
        'shardName': shardName,
        'replicaName': replicaName,
        'propName': propName
      };
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['*/*'];
      var returnType = _SolrJerseyResponse["default"];
      return this.apiClient.callApi('/collections/{collName}/shards/{shardName}/replicas/{replicaName}/properties/{propName}', 'DELETE', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }
  }]);
}();
},{"../ApiClient":8,"../model/AddReplicaPropertyRequestBody":27,"../model/SolrJerseyResponse":81}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
var _CreateReplicaRequestBody = _interopRequireDefault(require("../model/CreateReplicaRequestBody"));
var _ScaleCollectionRequestBody = _interopRequireDefault(require("../model/ScaleCollectionRequestBody"));
var _SubResponseAccumulatingJerseyResponse = _interopRequireDefault(require("../model/SubResponseAccumulatingJerseyResponse"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
* Replicas service.
* @module api/ReplicasApi
* @version 9.6.0
*/
var ReplicasApi = exports["default"] = /*#__PURE__*/function () {
  /**
  * Constructs a new ReplicasApi. 
  * @alias module:api/ReplicasApi
  * @class
  * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
  * default to {@link module:ApiClient#instance} if unspecified.
  */
  function ReplicasApi(apiClient) {
    _classCallCheck(this, ReplicasApi);
    this.apiClient = apiClient || _ApiClient["default"].instance;
  }

  /**
   * Callback function to receive the result of the createReplica operation.
   * @callback module:api/ReplicasApi~createReplicaCallback
   * @param {String} error Error message, if any.
   * @param {module:model/SubResponseAccumulatingJerseyResponse} data The data returned by the service call.
   * @param {String} response The complete HTTP response.
   */

  /**
   * Creates a new replica of an existing shard.
   * @param {String} collectionName 
   * @param {String} shardName 
   * @param {Object} opts Optional parameters
   * @param {module:model/CreateReplicaRequestBody} opts.createReplicaRequestBody 
   * @param {module:api/ReplicasApi~createReplicaCallback} callback The callback function, accepting three arguments: error, data, response
   * data is of type: {@link module:model/SubResponseAccumulatingJerseyResponse}
   */
  return _createClass(ReplicasApi, [{
    key: "createReplica",
    value: function createReplica(collectionName, shardName, opts, callback) {
      opts = opts || {};
      var postBody = opts['createReplicaRequestBody'];
      // verify the required parameter 'collectionName' is set
      if (collectionName === undefined || collectionName === null) {
        throw new Error("Missing the required parameter 'collectionName' when calling createReplica");
      }
      // verify the required parameter 'shardName' is set
      if (shardName === undefined || shardName === null) {
        throw new Error("Missing the required parameter 'shardName' when calling createReplica");
      }
      var pathParams = {
        'collectionName': collectionName,
        'shardName': shardName
      };
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['*/*'];
      var returnType = _SubResponseAccumulatingJerseyResponse["default"];
      return this.apiClient.callApi('/collections/{collectionName}/shards/{shardName}/replicas', 'POST', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }

    /**
     * Callback function to receive the result of the deleteReplicaByName operation.
     * @callback module:api/ReplicasApi~deleteReplicaByNameCallback
     * @param {String} error Error message, if any.
     * @param {module:model/SubResponseAccumulatingJerseyResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Delete an single replica by name
     * @param {String} collectionName 
     * @param {String} shardName 
     * @param {String} replicaName 
     * @param {Object} opts Optional parameters
     * @param {Boolean} opts.followAliases 
     * @param {Boolean} opts.deleteInstanceDir 
     * @param {Boolean} opts.deleteDataDir 
     * @param {Boolean} opts.deleteIndex 
     * @param {Boolean} opts.onlyIfDown 
     * @param {String} opts.async 
     * @param {module:api/ReplicasApi~deleteReplicaByNameCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/SubResponseAccumulatingJerseyResponse}
     */
  }, {
    key: "deleteReplicaByName",
    value: function deleteReplicaByName(collectionName, shardName, replicaName, opts, callback) {
      opts = opts || {};
      var postBody = null;
      // verify the required parameter 'collectionName' is set
      if (collectionName === undefined || collectionName === null) {
        throw new Error("Missing the required parameter 'collectionName' when calling deleteReplicaByName");
      }
      // verify the required parameter 'shardName' is set
      if (shardName === undefined || shardName === null) {
        throw new Error("Missing the required parameter 'shardName' when calling deleteReplicaByName");
      }
      // verify the required parameter 'replicaName' is set
      if (replicaName === undefined || replicaName === null) {
        throw new Error("Missing the required parameter 'replicaName' when calling deleteReplicaByName");
      }
      var pathParams = {
        'collectionName': collectionName,
        'shardName': shardName,
        'replicaName': replicaName
      };
      var queryParams = {
        'followAliases': opts['followAliases'],
        'deleteInstanceDir': opts['deleteInstanceDir'],
        'deleteDataDir': opts['deleteDataDir'],
        'deleteIndex': opts['deleteIndex'],
        'onlyIfDown': opts['onlyIfDown'],
        'async': opts['async']
      };
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['*/*'];
      var returnType = _SubResponseAccumulatingJerseyResponse["default"];
      return this.apiClient.callApi('/collections/{collectionName}/shards/{shardName}/replicas/{replicaName}', 'DELETE', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }

    /**
     * Callback function to receive the result of the deleteReplicasByCount operation.
     * @callback module:api/ReplicasApi~deleteReplicasByCountCallback
     * @param {String} error Error message, if any.
     * @param {module:model/SubResponseAccumulatingJerseyResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Delete one or more replicas from the specified collection and shard
     * @param {String} collectionName 
     * @param {String} shardName 
     * @param {Object} opts Optional parameters
     * @param {Number} opts.count 
     * @param {Boolean} opts.followAliases 
     * @param {Boolean} opts.deleteInstanceDir 
     * @param {Boolean} opts.deleteDataDir 
     * @param {Boolean} opts.deleteIndex 
     * @param {Boolean} opts.onlyIfDown 
     * @param {String} opts.async 
     * @param {module:api/ReplicasApi~deleteReplicasByCountCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/SubResponseAccumulatingJerseyResponse}
     */
  }, {
    key: "deleteReplicasByCount",
    value: function deleteReplicasByCount(collectionName, shardName, opts, callback) {
      opts = opts || {};
      var postBody = null;
      // verify the required parameter 'collectionName' is set
      if (collectionName === undefined || collectionName === null) {
        throw new Error("Missing the required parameter 'collectionName' when calling deleteReplicasByCount");
      }
      // verify the required parameter 'shardName' is set
      if (shardName === undefined || shardName === null) {
        throw new Error("Missing the required parameter 'shardName' when calling deleteReplicasByCount");
      }
      var pathParams = {
        'collectionName': collectionName,
        'shardName': shardName
      };
      var queryParams = {
        'count': opts['count'],
        'followAliases': opts['followAliases'],
        'deleteInstanceDir': opts['deleteInstanceDir'],
        'deleteDataDir': opts['deleteDataDir'],
        'deleteIndex': opts['deleteIndex'],
        'onlyIfDown': opts['onlyIfDown'],
        'async': opts['async']
      };
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['*/*'];
      var returnType = _SubResponseAccumulatingJerseyResponse["default"];
      return this.apiClient.callApi('/collections/{collectionName}/shards/{shardName}/replicas', 'DELETE', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }

    /**
     * Callback function to receive the result of the deleteReplicasByCountAllShards operation.
     * @callback module:api/ReplicasApi~deleteReplicasByCountAllShardsCallback
     * @param {String} error Error message, if any.
     * @param {module:model/SubResponseAccumulatingJerseyResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Scale the replica count for all shards in the specified collection
     * @param {String} collectionName 
     * @param {Object} opts Optional parameters
     * @param {module:model/ScaleCollectionRequestBody} opts.scaleCollectionRequestBody 
     * @param {module:api/ReplicasApi~deleteReplicasByCountAllShardsCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/SubResponseAccumulatingJerseyResponse}
     */
  }, {
    key: "deleteReplicasByCountAllShards",
    value: function deleteReplicasByCountAllShards(collectionName, opts, callback) {
      opts = opts || {};
      var postBody = opts['scaleCollectionRequestBody'];
      // verify the required parameter 'collectionName' is set
      if (collectionName === undefined || collectionName === null) {
        throw new Error("Missing the required parameter 'collectionName' when calling deleteReplicasByCountAllShards");
      }
      var pathParams = {
        'collectionName': collectionName
      };
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['*/*'];
      var returnType = _SubResponseAccumulatingJerseyResponse["default"];
      return this.apiClient.callApi('/collections/{collectionName}/scale', 'PUT', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }
  }]);
}();
},{"../ApiClient":8,"../model/CreateReplicaRequestBody":40,"../model/ScaleCollectionRequestBody":73,"../model/SubResponseAccumulatingJerseyResponse":82}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
var _IndexType = _interopRequireDefault(require("../model/IndexType"));
var _SchemaInfoResponse = _interopRequireDefault(require("../model/SchemaInfoResponse"));
var _SchemaNameResponse = _interopRequireDefault(require("../model/SchemaNameResponse"));
var _SchemaSimilarityResponse = _interopRequireDefault(require("../model/SchemaSimilarityResponse"));
var _SchemaUniqueKeyResponse = _interopRequireDefault(require("../model/SchemaUniqueKeyResponse"));
var _SchemaVersionResponse = _interopRequireDefault(require("../model/SchemaVersionResponse"));
var _SchemaZkVersionResponse = _interopRequireDefault(require("../model/SchemaZkVersionResponse"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
* Schema service.
* @module api/SchemaApi
* @version 9.6.0
*/
var SchemaApi = exports["default"] = /*#__PURE__*/function () {
  /**
  * Constructs a new SchemaApi. 
  * @alias module:api/SchemaApi
  * @class
  * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
  * default to {@link module:ApiClient#instance} if unspecified.
  */
  function SchemaApi(apiClient) {
    _classCallCheck(this, SchemaApi);
    this.apiClient = apiClient || _ApiClient["default"].instance;
  }

  /**
   * Callback function to receive the result of the getSchemaInfo operation.
   * @callback module:api/SchemaApi~getSchemaInfoCallback
   * @param {String} error Error message, if any.
   * @param {module:model/SchemaInfoResponse} data The data returned by the service call.
   * @param {String} response The complete HTTP response.
   */

  /**
   * Fetch the entire schema of the specified core or collection
   * @param {module:model/IndexType} indexType 
   * @param {String} indexName 
   * @param {module:api/SchemaApi~getSchemaInfoCallback} callback The callback function, accepting three arguments: error, data, response
   * data is of type: {@link module:model/SchemaInfoResponse}
   */
  return _createClass(SchemaApi, [{
    key: "getSchemaInfo",
    value: function getSchemaInfo(indexType, indexName, callback) {
      var postBody = null;
      // verify the required parameter 'indexType' is set
      if (indexType === undefined || indexType === null) {
        throw new Error("Missing the required parameter 'indexType' when calling getSchemaInfo");
      }
      // verify the required parameter 'indexName' is set
      if (indexName === undefined || indexName === null) {
        throw new Error("Missing the required parameter 'indexName' when calling getSchemaInfo");
      }
      var pathParams = {
        'indexType': indexType,
        'indexName': indexName
      };
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['*/*'];
      var returnType = _SchemaInfoResponse["default"];
      return this.apiClient.callApi('/{indexType}/{indexName}/schema', 'GET', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }

    /**
     * Callback function to receive the result of the getSchemaName operation.
     * @callback module:api/SchemaApi~getSchemaNameCallback
     * @param {String} error Error message, if any.
     * @param {module:model/SchemaNameResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get the name of the schema used by the specified core or collection
     * @param {module:model/IndexType} indexType 
     * @param {String} indexName 
     * @param {module:api/SchemaApi~getSchemaNameCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/SchemaNameResponse}
     */
  }, {
    key: "getSchemaName",
    value: function getSchemaName(indexType, indexName, callback) {
      var postBody = null;
      // verify the required parameter 'indexType' is set
      if (indexType === undefined || indexType === null) {
        throw new Error("Missing the required parameter 'indexType' when calling getSchemaName");
      }
      // verify the required parameter 'indexName' is set
      if (indexName === undefined || indexName === null) {
        throw new Error("Missing the required parameter 'indexName' when calling getSchemaName");
      }
      var pathParams = {
        'indexType': indexType,
        'indexName': indexName
      };
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['*/*'];
      var returnType = _SchemaNameResponse["default"];
      return this.apiClient.callApi('/{indexType}/{indexName}/schema/name', 'GET', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }

    /**
     * Callback function to receive the result of the getSchemaSimilarity operation.
     * @callback module:api/SchemaApi~getSchemaSimilarityCallback
     * @param {String} error Error message, if any.
     * @param {module:model/SchemaSimilarityResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get the default similarity configuration used by the specified core or collection
     * @param {module:model/IndexType} indexType 
     * @param {String} indexName 
     * @param {module:api/SchemaApi~getSchemaSimilarityCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/SchemaSimilarityResponse}
     */
  }, {
    key: "getSchemaSimilarity",
    value: function getSchemaSimilarity(indexType, indexName, callback) {
      var postBody = null;
      // verify the required parameter 'indexType' is set
      if (indexType === undefined || indexType === null) {
        throw new Error("Missing the required parameter 'indexType' when calling getSchemaSimilarity");
      }
      // verify the required parameter 'indexName' is set
      if (indexName === undefined || indexName === null) {
        throw new Error("Missing the required parameter 'indexName' when calling getSchemaSimilarity");
      }
      var pathParams = {
        'indexType': indexType,
        'indexName': indexName
      };
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['*/*'];
      var returnType = _SchemaSimilarityResponse["default"];
      return this.apiClient.callApi('/{indexType}/{indexName}/schema/similarity', 'GET', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }

    /**
     * Callback function to receive the result of the getSchemaUniqueKey operation.
     * @callback module:api/SchemaApi~getSchemaUniqueKeyCallback
     * @param {String} error Error message, if any.
     * @param {module:model/SchemaUniqueKeyResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Fetch the uniquekey of the specified core or collection
     * @param {module:model/IndexType} indexType 
     * @param {String} indexName 
     * @param {module:api/SchemaApi~getSchemaUniqueKeyCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/SchemaUniqueKeyResponse}
     */
  }, {
    key: "getSchemaUniqueKey",
    value: function getSchemaUniqueKey(indexType, indexName, callback) {
      var postBody = null;
      // verify the required parameter 'indexType' is set
      if (indexType === undefined || indexType === null) {
        throw new Error("Missing the required parameter 'indexType' when calling getSchemaUniqueKey");
      }
      // verify the required parameter 'indexName' is set
      if (indexName === undefined || indexName === null) {
        throw new Error("Missing the required parameter 'indexName' when calling getSchemaUniqueKey");
      }
      var pathParams = {
        'indexType': indexType,
        'indexName': indexName
      };
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['*/*'];
      var returnType = _SchemaUniqueKeyResponse["default"];
      return this.apiClient.callApi('/{indexType}/{indexName}/schema/uniquekey', 'GET', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }

    /**
     * Callback function to receive the result of the getSchemaVersion operation.
     * @callback module:api/SchemaApi~getSchemaVersionCallback
     * @param {String} error Error message, if any.
     * @param {module:model/SchemaVersionResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Fetch the schema version currently used by the specified core or collection
     * @param {module:model/IndexType} indexType 
     * @param {String} indexName 
     * @param {module:api/SchemaApi~getSchemaVersionCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/SchemaVersionResponse}
     */
  }, {
    key: "getSchemaVersion",
    value: function getSchemaVersion(indexType, indexName, callback) {
      var postBody = null;
      // verify the required parameter 'indexType' is set
      if (indexType === undefined || indexType === null) {
        throw new Error("Missing the required parameter 'indexType' when calling getSchemaVersion");
      }
      // verify the required parameter 'indexName' is set
      if (indexName === undefined || indexName === null) {
        throw new Error("Missing the required parameter 'indexName' when calling getSchemaVersion");
      }
      var pathParams = {
        'indexType': indexType,
        'indexName': indexName
      };
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['*/*'];
      var returnType = _SchemaVersionResponse["default"];
      return this.apiClient.callApi('/{indexType}/{indexName}/schema/version', 'GET', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }

    /**
     * Callback function to receive the result of the getSchemaZkVersion operation.
     * @callback module:api/SchemaApi~getSchemaZkVersionCallback
     * @param {String} error Error message, if any.
     * @param {module:model/SchemaZkVersionResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Fetch the schema version currently used by the specified core or collection
     * @param {module:model/IndexType} indexType 
     * @param {String} indexName 
     * @param {Object} opts Optional parameters
     * @param {Number} opts.refreshIfBelowVersion  (default to -1)
     * @param {module:api/SchemaApi~getSchemaZkVersionCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/SchemaZkVersionResponse}
     */
  }, {
    key: "getSchemaZkVersion",
    value: function getSchemaZkVersion(indexType, indexName, opts, callback) {
      opts = opts || {};
      var postBody = null;
      // verify the required parameter 'indexType' is set
      if (indexType === undefined || indexType === null) {
        throw new Error("Missing the required parameter 'indexType' when calling getSchemaZkVersion");
      }
      // verify the required parameter 'indexName' is set
      if (indexName === undefined || indexName === null) {
        throw new Error("Missing the required parameter 'indexName' when calling getSchemaZkVersion");
      }
      var pathParams = {
        'indexType': indexType,
        'indexName': indexName
      };
      var queryParams = {
        'refreshIfBelowVersion': opts['refreshIfBelowVersion']
      };
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['*/*'];
      var returnType = _SchemaZkVersionResponse["default"];
      return this.apiClient.callApi('/{indexType}/{indexName}/schema/zkversion', 'GET', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }
  }]);
}();
},{"../ApiClient":8,"../model/IndexType":52,"../model/SchemaInfoResponse":74,"../model/SchemaNameResponse":75,"../model/SchemaSimilarityResponse":76,"../model/SchemaUniqueKeyResponse":77,"../model/SchemaVersionResponse":78,"../model/SchemaZkVersionResponse":79}],25:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
var _CreateShardRequestBody = _interopRequireDefault(require("../model/CreateShardRequestBody"));
var _InstallShardDataRequestBody = _interopRequireDefault(require("../model/InstallShardDataRequestBody"));
var _SolrJerseyResponse = _interopRequireDefault(require("../model/SolrJerseyResponse"));
var _SubResponseAccumulatingJerseyResponse = _interopRequireDefault(require("../model/SubResponseAccumulatingJerseyResponse"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
* Shards service.
* @module api/ShardsApi
* @version 9.6.0
*/
var ShardsApi = exports["default"] = /*#__PURE__*/function () {
  /**
  * Constructs a new ShardsApi. 
  * @alias module:api/ShardsApi
  * @class
  * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
  * default to {@link module:ApiClient#instance} if unspecified.
  */
  function ShardsApi(apiClient) {
    _classCallCheck(this, ShardsApi);
    this.apiClient = apiClient || _ApiClient["default"].instance;
  }

  /**
   * Callback function to receive the result of the createShard operation.
   * @callback module:api/ShardsApi~createShardCallback
   * @param {String} error Error message, if any.
   * @param {module:model/SubResponseAccumulatingJerseyResponse} data The data returned by the service call.
   * @param {String} response The complete HTTP response.
   */

  /**
   * Create a new shard in an existing collection
   * @param {String} collectionName 
   * @param {Object} opts Optional parameters
   * @param {module:model/CreateShardRequestBody} opts.createShardRequestBody 
   * @param {module:api/ShardsApi~createShardCallback} callback The callback function, accepting three arguments: error, data, response
   * data is of type: {@link module:model/SubResponseAccumulatingJerseyResponse}
   */
  return _createClass(ShardsApi, [{
    key: "createShard",
    value: function createShard(collectionName, opts, callback) {
      opts = opts || {};
      var postBody = opts['createShardRequestBody'];
      // verify the required parameter 'collectionName' is set
      if (collectionName === undefined || collectionName === null) {
        throw new Error("Missing the required parameter 'collectionName' when calling createShard");
      }
      var pathParams = {
        'collectionName': collectionName
      };
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['*/*'];
      var returnType = _SubResponseAccumulatingJerseyResponse["default"];
      return this.apiClient.callApi('/collections/{collectionName}/shards', 'POST', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }

    /**
     * Callback function to receive the result of the deleteShard operation.
     * @callback module:api/ShardsApi~deleteShardCallback
     * @param {String} error Error message, if any.
     * @param {module:model/SubResponseAccumulatingJerseyResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Delete an existing shard
     * @param {String} collectionName 
     * @param {String} shardName 
     * @param {Object} opts Optional parameters
     * @param {Boolean} opts.deleteInstanceDir 
     * @param {Boolean} opts.deleteDataDir 
     * @param {Boolean} opts.deleteIndex 
     * @param {Boolean} opts.followAliases 
     * @param {String} opts.async 
     * @param {module:api/ShardsApi~deleteShardCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/SubResponseAccumulatingJerseyResponse}
     */
  }, {
    key: "deleteShard",
    value: function deleteShard(collectionName, shardName, opts, callback) {
      opts = opts || {};
      var postBody = null;
      // verify the required parameter 'collectionName' is set
      if (collectionName === undefined || collectionName === null) {
        throw new Error("Missing the required parameter 'collectionName' when calling deleteShard");
      }
      // verify the required parameter 'shardName' is set
      if (shardName === undefined || shardName === null) {
        throw new Error("Missing the required parameter 'shardName' when calling deleteShard");
      }
      var pathParams = {
        'collectionName': collectionName,
        'shardName': shardName
      };
      var queryParams = {
        'deleteInstanceDir': opts['deleteInstanceDir'],
        'deleteDataDir': opts['deleteDataDir'],
        'deleteIndex': opts['deleteIndex'],
        'followAliases': opts['followAliases'],
        'async': opts['async']
      };
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['*/*'];
      var returnType = _SubResponseAccumulatingJerseyResponse["default"];
      return this.apiClient.callApi('/collections/{collectionName}/shards/{shardName}', 'DELETE', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }

    /**
     * Callback function to receive the result of the forceShardLeader operation.
     * @callback module:api/ShardsApi~forceShardLeaderCallback
     * @param {String} error Error message, if any.
     * @param {module:model/SolrJerseyResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Force leader election to occur on the specified collection and shard
     * @param {String} collectionName 
     * @param {String} shardName 
     * @param {module:api/ShardsApi~forceShardLeaderCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/SolrJerseyResponse}
     */
  }, {
    key: "forceShardLeader",
    value: function forceShardLeader(collectionName, shardName, callback) {
      var postBody = null;
      // verify the required parameter 'collectionName' is set
      if (collectionName === undefined || collectionName === null) {
        throw new Error("Missing the required parameter 'collectionName' when calling forceShardLeader");
      }
      // verify the required parameter 'shardName' is set
      if (shardName === undefined || shardName === null) {
        throw new Error("Missing the required parameter 'shardName' when calling forceShardLeader");
      }
      var pathParams = {
        'collectionName': collectionName,
        'shardName': shardName
      };
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['*/*'];
      var returnType = _SolrJerseyResponse["default"];
      return this.apiClient.callApi('/collections/{collectionName}/shards/{shardName}/force-leader', 'POST', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }

    /**
     * Callback function to receive the result of the installShardData operation.
     * @callback module:api/ShardsApi~installShardDataCallback
     * @param {String} error Error message, if any.
     * @param {module:model/SolrJerseyResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Install offline index into an existing shard
     * @param {String} collName 
     * @param {String} shardName 
     * @param {Object} opts Optional parameters
     * @param {module:model/InstallShardDataRequestBody} opts.installShardDataRequestBody 
     * @param {module:api/ShardsApi~installShardDataCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/SolrJerseyResponse}
     */
  }, {
    key: "installShardData",
    value: function installShardData(collName, shardName, opts, callback) {
      opts = opts || {};
      var postBody = opts['installShardDataRequestBody'];
      // verify the required parameter 'collName' is set
      if (collName === undefined || collName === null) {
        throw new Error("Missing the required parameter 'collName' when calling installShardData");
      }
      // verify the required parameter 'shardName' is set
      if (shardName === undefined || shardName === null) {
        throw new Error("Missing the required parameter 'shardName' when calling installShardData");
      }
      var pathParams = {
        'collName': collName,
        'shardName': shardName
      };
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['*/*'];
      var returnType = _SolrJerseyResponse["default"];
      return this.apiClient.callApi('/collections/{collName}/shards/{shardName}/install', 'POST', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }

    /**
     * Callback function to receive the result of the syncShard operation.
     * @callback module:api/ShardsApi~syncShardCallback
     * @param {String} error Error message, if any.
     * @param {module:model/SolrJerseyResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Trigger a 'sync' operation for the specified shard
     * @param {String} collectionName 
     * @param {String} shardName 
     * @param {module:api/ShardsApi~syncShardCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/SolrJerseyResponse}
     */
  }, {
    key: "syncShard",
    value: function syncShard(collectionName, shardName, callback) {
      var postBody = null;
      // verify the required parameter 'collectionName' is set
      if (collectionName === undefined || collectionName === null) {
        throw new Error("Missing the required parameter 'collectionName' when calling syncShard");
      }
      // verify the required parameter 'shardName' is set
      if (shardName === undefined || shardName === null) {
        throw new Error("Missing the required parameter 'shardName' when calling syncShard");
      }
      var pathParams = {
        'collectionName': collectionName,
        'shardName': shardName
      };
      var queryParams = {};
      var headerParams = {};
      var formParams = {};
      var authNames = [];
      var contentTypes = [];
      var accepts = ['*/*'];
      var returnType = _SolrJerseyResponse["default"];
      return this.apiClient.callApi('/collections/{collectionName}/shards/{shardName}/sync', 'POST', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType, null, callback);
    }
  }]);
}();
},{"../ApiClient":8,"../model/CreateShardRequestBody":41,"../model/InstallShardDataRequestBody":54,"../model/SolrJerseyResponse":81,"../model/SubResponseAccumulatingJerseyResponse":82}],26:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "AddReplicaPropertyRequestBody", {
  enumerable: true,
  get: function get() {
    return _AddReplicaPropertyRequestBody["default"];
  }
});
Object.defineProperty(exports, "AliasPropertiesApi", {
  enumerable: true,
  get: function get() {
    return _AliasPropertiesApi["default"];
  }
});
Object.defineProperty(exports, "AliasesApi", {
  enumerable: true,
  get: function get() {
    return _AliasesApi["default"];
  }
});
Object.defineProperty(exports, "ApiClient", {
  enumerable: true,
  get: function get() {
    return _ApiClient["default"];
  }
});
Object.defineProperty(exports, "BackupDeletionData", {
  enumerable: true,
  get: function get() {
    return _BackupDeletionData["default"];
  }
});
Object.defineProperty(exports, "BackupDeletionResponseBody", {
  enumerable: true,
  get: function get() {
    return _BackupDeletionResponseBody["default"];
  }
});
Object.defineProperty(exports, "BalanceReplicasRequestBody", {
  enumerable: true,
  get: function get() {
    return _BalanceReplicasRequestBody["default"];
  }
});
Object.defineProperty(exports, "BalanceShardUniqueRequestBody", {
  enumerable: true,
  get: function get() {
    return _BalanceShardUniqueRequestBody["default"];
  }
});
Object.defineProperty(exports, "ClusterApi", {
  enumerable: true,
  get: function get() {
    return _ClusterApi["default"];
  }
});
Object.defineProperty(exports, "CollectionBackupDetails", {
  enumerable: true,
  get: function get() {
    return _CollectionBackupDetails["default"];
  }
});
Object.defineProperty(exports, "CollectionBackupsApi", {
  enumerable: true,
  get: function get() {
    return _CollectionBackupsApi["default"];
  }
});
Object.defineProperty(exports, "CollectionPropertiesApi", {
  enumerable: true,
  get: function get() {
    return _CollectionPropertiesApi["default"];
  }
});
Object.defineProperty(exports, "CollectionSnapshotsApi", {
  enumerable: true,
  get: function get() {
    return _CollectionSnapshotsApi["default"];
  }
});
Object.defineProperty(exports, "CollectionsApi", {
  enumerable: true,
  get: function get() {
    return _CollectionsApi["default"];
  }
});
Object.defineProperty(exports, "ConfigsetsApi", {
  enumerable: true,
  get: function get() {
    return _ConfigsetsApi["default"];
  }
});
Object.defineProperty(exports, "CoreBackupsApi", {
  enumerable: true,
  get: function get() {
    return _CoreBackupsApi["default"];
  }
});
Object.defineProperty(exports, "CoreSnapshotsApi", {
  enumerable: true,
  get: function get() {
    return _CoreSnapshotsApi["default"];
  }
});
Object.defineProperty(exports, "CoresApi", {
  enumerable: true,
  get: function get() {
    return _CoresApi["default"];
  }
});
Object.defineProperty(exports, "CreateCollectionBackupRequestBody", {
  enumerable: true,
  get: function get() {
    return _CreateCollectionBackupRequestBody["default"];
  }
});
Object.defineProperty(exports, "CreateCollectionRequestBody", {
  enumerable: true,
  get: function get() {
    return _CreateCollectionRequestBody["default"];
  }
});
Object.defineProperty(exports, "CreateCollectionRouterProperties", {
  enumerable: true,
  get: function get() {
    return _CreateCollectionRouterProperties["default"];
  }
});
Object.defineProperty(exports, "CreateCollectionSnapshotRequestBody", {
  enumerable: true,
  get: function get() {
    return _CreateCollectionSnapshotRequestBody["default"];
  }
});
Object.defineProperty(exports, "CreateCollectionSnapshotResponse", {
  enumerable: true,
  get: function get() {
    return _CreateCollectionSnapshotResponse["default"];
  }
});
Object.defineProperty(exports, "CreateCoreBackupRequestBody", {
  enumerable: true,
  get: function get() {
    return _CreateCoreBackupRequestBody["default"];
  }
});
Object.defineProperty(exports, "CreateCoreSnapshotResponse", {
  enumerable: true,
  get: function get() {
    return _CreateCoreSnapshotResponse["default"];
  }
});
Object.defineProperty(exports, "CreateReplicaRequestBody", {
  enumerable: true,
  get: function get() {
    return _CreateReplicaRequestBody["default"];
  }
});
Object.defineProperty(exports, "CreateShardRequestBody", {
  enumerable: true,
  get: function get() {
    return _CreateShardRequestBody["default"];
  }
});
Object.defineProperty(exports, "DeleteCollectionSnapshotResponse", {
  enumerable: true,
  get: function get() {
    return _DeleteCollectionSnapshotResponse["default"];
  }
});
Object.defineProperty(exports, "DeleteNodeRequestBody", {
  enumerable: true,
  get: function get() {
    return _DeleteNodeRequestBody["default"];
  }
});
Object.defineProperty(exports, "DeleteSnapshotResponse", {
  enumerable: true,
  get: function get() {
    return _DeleteSnapshotResponse["default"];
  }
});
Object.defineProperty(exports, "ErrorInfo", {
  enumerable: true,
  get: function get() {
    return _ErrorInfo["default"];
  }
});
Object.defineProperty(exports, "ErrorMetadata", {
  enumerable: true,
  get: function get() {
    return _ErrorMetadata["default"];
  }
});
Object.defineProperty(exports, "FlexibleSolrJerseyResponse", {
  enumerable: true,
  get: function get() {
    return _FlexibleSolrJerseyResponse["default"];
  }
});
Object.defineProperty(exports, "GetAliasByNameResponse", {
  enumerable: true,
  get: function get() {
    return _GetAliasByNameResponse["default"];
  }
});
Object.defineProperty(exports, "GetAliasPropertyResponse", {
  enumerable: true,
  get: function get() {
    return _GetAliasPropertyResponse["default"];
  }
});
Object.defineProperty(exports, "GetAllAliasPropertiesResponse", {
  enumerable: true,
  get: function get() {
    return _GetAllAliasPropertiesResponse["default"];
  }
});
Object.defineProperty(exports, "GetNodeCommandStatusResponse", {
  enumerable: true,
  get: function get() {
    return _GetNodeCommandStatusResponse["default"];
  }
});
Object.defineProperty(exports, "IndexType", {
  enumerable: true,
  get: function get() {
    return _IndexType["default"];
  }
});
Object.defineProperty(exports, "InstallCoreDataRequestBody", {
  enumerable: true,
  get: function get() {
    return _InstallCoreDataRequestBody["default"];
  }
});
Object.defineProperty(exports, "InstallShardDataRequestBody", {
  enumerable: true,
  get: function get() {
    return _InstallShardDataRequestBody["default"];
  }
});
Object.defineProperty(exports, "ListAliasesResponse", {
  enumerable: true,
  get: function get() {
    return _ListAliasesResponse["default"];
  }
});
Object.defineProperty(exports, "ListCollectionBackupsResponse", {
  enumerable: true,
  get: function get() {
    return _ListCollectionBackupsResponse["default"];
  }
});
Object.defineProperty(exports, "ListCollectionsResponse", {
  enumerable: true,
  get: function get() {
    return _ListCollectionsResponse["default"];
  }
});
Object.defineProperty(exports, "ListConfigsetsResponse", {
  enumerable: true,
  get: function get() {
    return _ListConfigsetsResponse["default"];
  }
});
Object.defineProperty(exports, "ListCoreSnapshotsResponse", {
  enumerable: true,
  get: function get() {
    return _ListCoreSnapshotsResponse["default"];
  }
});
Object.defineProperty(exports, "MergeIndexesRequestBody", {
  enumerable: true,
  get: function get() {
    return _MergeIndexesRequestBody["default"];
  }
});
Object.defineProperty(exports, "MigrateReplicasRequestBody", {
  enumerable: true,
  get: function get() {
    return _MigrateReplicasRequestBody["default"];
  }
});
Object.defineProperty(exports, "NodeApi", {
  enumerable: true,
  get: function get() {
    return _NodeApi["default"];
  }
});
Object.defineProperty(exports, "PublicKeyResponse", {
  enumerable: true,
  get: function get() {
    return _PublicKeyResponse["default"];
  }
});
Object.defineProperty(exports, "PurgeUnusedFilesRequestBody", {
  enumerable: true,
  get: function get() {
    return _PurgeUnusedFilesRequestBody["default"];
  }
});
Object.defineProperty(exports, "PurgeUnusedResponse", {
  enumerable: true,
  get: function get() {
    return _PurgeUnusedResponse["default"];
  }
});
Object.defineProperty(exports, "PurgeUnusedStats", {
  enumerable: true,
  get: function get() {
    return _PurgeUnusedStats["default"];
  }
});
Object.defineProperty(exports, "QueryingApi", {
  enumerable: true,
  get: function get() {
    return _QueryingApi["default"];
  }
});
Object.defineProperty(exports, "ReloadCollectionRequestBody", {
  enumerable: true,
  get: function get() {
    return _ReloadCollectionRequestBody["default"];
  }
});
Object.defineProperty(exports, "ReloadCoreRequestBody", {
  enumerable: true,
  get: function get() {
    return _ReloadCoreRequestBody["default"];
  }
});
Object.defineProperty(exports, "RenameCollectionRequestBody", {
  enumerable: true,
  get: function get() {
    return _RenameCollectionRequestBody["default"];
  }
});
Object.defineProperty(exports, "RenameCoreRequestBody", {
  enumerable: true,
  get: function get() {
    return _RenameCoreRequestBody["default"];
  }
});
Object.defineProperty(exports, "ReplaceNodeRequestBody", {
  enumerable: true,
  get: function get() {
    return _ReplaceNodeRequestBody["default"];
  }
});
Object.defineProperty(exports, "ReplicaPropertiesApi", {
  enumerable: true,
  get: function get() {
    return _ReplicaPropertiesApi["default"];
  }
});
Object.defineProperty(exports, "ReplicasApi", {
  enumerable: true,
  get: function get() {
    return _ReplicasApi["default"];
  }
});
Object.defineProperty(exports, "ResponseHeader", {
  enumerable: true,
  get: function get() {
    return _ResponseHeader["default"];
  }
});
Object.defineProperty(exports, "RestoreCoreRequestBody", {
  enumerable: true,
  get: function get() {
    return _RestoreCoreRequestBody["default"];
  }
});
Object.defineProperty(exports, "ScaleCollectionRequestBody", {
  enumerable: true,
  get: function get() {
    return _ScaleCollectionRequestBody["default"];
  }
});
Object.defineProperty(exports, "SchemaApi", {
  enumerable: true,
  get: function get() {
    return _SchemaApi["default"];
  }
});
Object.defineProperty(exports, "SchemaInfoResponse", {
  enumerable: true,
  get: function get() {
    return _SchemaInfoResponse["default"];
  }
});
Object.defineProperty(exports, "SchemaNameResponse", {
  enumerable: true,
  get: function get() {
    return _SchemaNameResponse["default"];
  }
});
Object.defineProperty(exports, "SchemaSimilarityResponse", {
  enumerable: true,
  get: function get() {
    return _SchemaSimilarityResponse["default"];
  }
});
Object.defineProperty(exports, "SchemaUniqueKeyResponse", {
  enumerable: true,
  get: function get() {
    return _SchemaUniqueKeyResponse["default"];
  }
});
Object.defineProperty(exports, "SchemaVersionResponse", {
  enumerable: true,
  get: function get() {
    return _SchemaVersionResponse["default"];
  }
});
Object.defineProperty(exports, "SchemaZkVersionResponse", {
  enumerable: true,
  get: function get() {
    return _SchemaZkVersionResponse["default"];
  }
});
Object.defineProperty(exports, "ShardsApi", {
  enumerable: true,
  get: function get() {
    return _ShardsApi["default"];
  }
});
Object.defineProperty(exports, "SnapshotInformation", {
  enumerable: true,
  get: function get() {
    return _SnapshotInformation["default"];
  }
});
Object.defineProperty(exports, "SolrJerseyResponse", {
  enumerable: true,
  get: function get() {
    return _SolrJerseyResponse["default"];
  }
});
Object.defineProperty(exports, "SubResponseAccumulatingJerseyResponse", {
  enumerable: true,
  get: function get() {
    return _SubResponseAccumulatingJerseyResponse["default"];
  }
});
Object.defineProperty(exports, "SwapCoresRequestBody", {
  enumerable: true,
  get: function get() {
    return _SwapCoresRequestBody["default"];
  }
});
Object.defineProperty(exports, "UnloadCoreRequestBody", {
  enumerable: true,
  get: function get() {
    return _UnloadCoreRequestBody["default"];
  }
});
Object.defineProperty(exports, "UpdateAliasPropertiesRequestBody", {
  enumerable: true,
  get: function get() {
    return _UpdateAliasPropertiesRequestBody["default"];
  }
});
Object.defineProperty(exports, "UpdateAliasPropertyRequestBody", {
  enumerable: true,
  get: function get() {
    return _UpdateAliasPropertyRequestBody["default"];
  }
});
Object.defineProperty(exports, "UpdateCollectionPropertyRequestBody", {
  enumerable: true,
  get: function get() {
    return _UpdateCollectionPropertyRequestBody["default"];
  }
});
var _ApiClient = _interopRequireDefault(require("./ApiClient"));
var _AddReplicaPropertyRequestBody = _interopRequireDefault(require("./model/AddReplicaPropertyRequestBody"));
var _BackupDeletionData = _interopRequireDefault(require("./model/BackupDeletionData"));
var _BackupDeletionResponseBody = _interopRequireDefault(require("./model/BackupDeletionResponseBody"));
var _BalanceReplicasRequestBody = _interopRequireDefault(require("./model/BalanceReplicasRequestBody"));
var _BalanceShardUniqueRequestBody = _interopRequireDefault(require("./model/BalanceShardUniqueRequestBody"));
var _CollectionBackupDetails = _interopRequireDefault(require("./model/CollectionBackupDetails"));
var _CreateCollectionBackupRequestBody = _interopRequireDefault(require("./model/CreateCollectionBackupRequestBody"));
var _CreateCollectionRequestBody = _interopRequireDefault(require("./model/CreateCollectionRequestBody"));
var _CreateCollectionRouterProperties = _interopRequireDefault(require("./model/CreateCollectionRouterProperties"));
var _CreateCollectionSnapshotRequestBody = _interopRequireDefault(require("./model/CreateCollectionSnapshotRequestBody"));
var _CreateCollectionSnapshotResponse = _interopRequireDefault(require("./model/CreateCollectionSnapshotResponse"));
var _CreateCoreBackupRequestBody = _interopRequireDefault(require("./model/CreateCoreBackupRequestBody"));
var _CreateCoreSnapshotResponse = _interopRequireDefault(require("./model/CreateCoreSnapshotResponse"));
var _CreateReplicaRequestBody = _interopRequireDefault(require("./model/CreateReplicaRequestBody"));
var _CreateShardRequestBody = _interopRequireDefault(require("./model/CreateShardRequestBody"));
var _DeleteCollectionSnapshotResponse = _interopRequireDefault(require("./model/DeleteCollectionSnapshotResponse"));
var _DeleteNodeRequestBody = _interopRequireDefault(require("./model/DeleteNodeRequestBody"));
var _DeleteSnapshotResponse = _interopRequireDefault(require("./model/DeleteSnapshotResponse"));
var _ErrorInfo = _interopRequireDefault(require("./model/ErrorInfo"));
var _ErrorMetadata = _interopRequireDefault(require("./model/ErrorMetadata"));
var _FlexibleSolrJerseyResponse = _interopRequireDefault(require("./model/FlexibleSolrJerseyResponse"));
var _GetAliasByNameResponse = _interopRequireDefault(require("./model/GetAliasByNameResponse"));
var _GetAliasPropertyResponse = _interopRequireDefault(require("./model/GetAliasPropertyResponse"));
var _GetAllAliasPropertiesResponse = _interopRequireDefault(require("./model/GetAllAliasPropertiesResponse"));
var _GetNodeCommandStatusResponse = _interopRequireDefault(require("./model/GetNodeCommandStatusResponse"));
var _IndexType = _interopRequireDefault(require("./model/IndexType"));
var _InstallCoreDataRequestBody = _interopRequireDefault(require("./model/InstallCoreDataRequestBody"));
var _InstallShardDataRequestBody = _interopRequireDefault(require("./model/InstallShardDataRequestBody"));
var _ListAliasesResponse = _interopRequireDefault(require("./model/ListAliasesResponse"));
var _ListCollectionBackupsResponse = _interopRequireDefault(require("./model/ListCollectionBackupsResponse"));
var _ListCollectionsResponse = _interopRequireDefault(require("./model/ListCollectionsResponse"));
var _ListConfigsetsResponse = _interopRequireDefault(require("./model/ListConfigsetsResponse"));
var _ListCoreSnapshotsResponse = _interopRequireDefault(require("./model/ListCoreSnapshotsResponse"));
var _MergeIndexesRequestBody = _interopRequireDefault(require("./model/MergeIndexesRequestBody"));
var _MigrateReplicasRequestBody = _interopRequireDefault(require("./model/MigrateReplicasRequestBody"));
var _PublicKeyResponse = _interopRequireDefault(require("./model/PublicKeyResponse"));
var _PurgeUnusedFilesRequestBody = _interopRequireDefault(require("./model/PurgeUnusedFilesRequestBody"));
var _PurgeUnusedResponse = _interopRequireDefault(require("./model/PurgeUnusedResponse"));
var _PurgeUnusedStats = _interopRequireDefault(require("./model/PurgeUnusedStats"));
var _ReloadCollectionRequestBody = _interopRequireDefault(require("./model/ReloadCollectionRequestBody"));
var _ReloadCoreRequestBody = _interopRequireDefault(require("./model/ReloadCoreRequestBody"));
var _RenameCollectionRequestBody = _interopRequireDefault(require("./model/RenameCollectionRequestBody"));
var _RenameCoreRequestBody = _interopRequireDefault(require("./model/RenameCoreRequestBody"));
var _ReplaceNodeRequestBody = _interopRequireDefault(require("./model/ReplaceNodeRequestBody"));
var _ResponseHeader = _interopRequireDefault(require("./model/ResponseHeader"));
var _RestoreCoreRequestBody = _interopRequireDefault(require("./model/RestoreCoreRequestBody"));
var _ScaleCollectionRequestBody = _interopRequireDefault(require("./model/ScaleCollectionRequestBody"));
var _SchemaInfoResponse = _interopRequireDefault(require("./model/SchemaInfoResponse"));
var _SchemaNameResponse = _interopRequireDefault(require("./model/SchemaNameResponse"));
var _SchemaSimilarityResponse = _interopRequireDefault(require("./model/SchemaSimilarityResponse"));
var _SchemaUniqueKeyResponse = _interopRequireDefault(require("./model/SchemaUniqueKeyResponse"));
var _SchemaVersionResponse = _interopRequireDefault(require("./model/SchemaVersionResponse"));
var _SchemaZkVersionResponse = _interopRequireDefault(require("./model/SchemaZkVersionResponse"));
var _SnapshotInformation = _interopRequireDefault(require("./model/SnapshotInformation"));
var _SolrJerseyResponse = _interopRequireDefault(require("./model/SolrJerseyResponse"));
var _SubResponseAccumulatingJerseyResponse = _interopRequireDefault(require("./model/SubResponseAccumulatingJerseyResponse"));
var _SwapCoresRequestBody = _interopRequireDefault(require("./model/SwapCoresRequestBody"));
var _UnloadCoreRequestBody = _interopRequireDefault(require("./model/UnloadCoreRequestBody"));
var _UpdateAliasPropertiesRequestBody = _interopRequireDefault(require("./model/UpdateAliasPropertiesRequestBody"));
var _UpdateAliasPropertyRequestBody = _interopRequireDefault(require("./model/UpdateAliasPropertyRequestBody"));
var _UpdateCollectionPropertyRequestBody = _interopRequireDefault(require("./model/UpdateCollectionPropertyRequestBody"));
var _AliasPropertiesApi = _interopRequireDefault(require("./api/AliasPropertiesApi"));
var _AliasesApi = _interopRequireDefault(require("./api/AliasesApi"));
var _ClusterApi = _interopRequireDefault(require("./api/ClusterApi"));
var _CollectionBackupsApi = _interopRequireDefault(require("./api/CollectionBackupsApi"));
var _CollectionPropertiesApi = _interopRequireDefault(require("./api/CollectionPropertiesApi"));
var _CollectionSnapshotsApi = _interopRequireDefault(require("./api/CollectionSnapshotsApi"));
var _CollectionsApi = _interopRequireDefault(require("./api/CollectionsApi"));
var _ConfigsetsApi = _interopRequireDefault(require("./api/ConfigsetsApi"));
var _CoreBackupsApi = _interopRequireDefault(require("./api/CoreBackupsApi"));
var _CoreSnapshotsApi = _interopRequireDefault(require("./api/CoreSnapshotsApi"));
var _CoresApi = _interopRequireDefault(require("./api/CoresApi"));
var _NodeApi = _interopRequireDefault(require("./api/NodeApi"));
var _QueryingApi = _interopRequireDefault(require("./api/QueryingApi"));
var _ReplicaPropertiesApi = _interopRequireDefault(require("./api/ReplicaPropertiesApi"));
var _ReplicasApi = _interopRequireDefault(require("./api/ReplicasApi"));
var _SchemaApi = _interopRequireDefault(require("./api/SchemaApi"));
var _ShardsApi = _interopRequireDefault(require("./api/ShardsApi"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
},{"./ApiClient":8,"./api/AliasPropertiesApi":9,"./api/AliasesApi":10,"./api/ClusterApi":11,"./api/CollectionBackupsApi":12,"./api/CollectionPropertiesApi":13,"./api/CollectionSnapshotsApi":14,"./api/CollectionsApi":15,"./api/ConfigsetsApi":16,"./api/CoreBackupsApi":17,"./api/CoreSnapshotsApi":18,"./api/CoresApi":19,"./api/NodeApi":20,"./api/QueryingApi":21,"./api/ReplicaPropertiesApi":22,"./api/ReplicasApi":23,"./api/SchemaApi":24,"./api/ShardsApi":25,"./model/AddReplicaPropertyRequestBody":27,"./model/BackupDeletionData":28,"./model/BackupDeletionResponseBody":29,"./model/BalanceReplicasRequestBody":30,"./model/BalanceShardUniqueRequestBody":31,"./model/CollectionBackupDetails":32,"./model/CreateCollectionBackupRequestBody":33,"./model/CreateCollectionRequestBody":34,"./model/CreateCollectionRouterProperties":35,"./model/CreateCollectionSnapshotRequestBody":36,"./model/CreateCollectionSnapshotResponse":37,"./model/CreateCoreBackupRequestBody":38,"./model/CreateCoreSnapshotResponse":39,"./model/CreateReplicaRequestBody":40,"./model/CreateShardRequestBody":41,"./model/DeleteCollectionSnapshotResponse":42,"./model/DeleteNodeRequestBody":43,"./model/DeleteSnapshotResponse":44,"./model/ErrorInfo":45,"./model/ErrorMetadata":46,"./model/FlexibleSolrJerseyResponse":47,"./model/GetAliasByNameResponse":48,"./model/GetAliasPropertyResponse":49,"./model/GetAllAliasPropertiesResponse":50,"./model/GetNodeCommandStatusResponse":51,"./model/IndexType":52,"./model/InstallCoreDataRequestBody":53,"./model/InstallShardDataRequestBody":54,"./model/ListAliasesResponse":55,"./model/ListCollectionBackupsResponse":56,"./model/ListCollectionsResponse":57,"./model/ListConfigsetsResponse":58,"./model/ListCoreSnapshotsResponse":59,"./model/MergeIndexesRequestBody":60,"./model/MigrateReplicasRequestBody":61,"./model/PublicKeyResponse":62,"./model/PurgeUnusedFilesRequestBody":63,"./model/PurgeUnusedResponse":64,"./model/PurgeUnusedStats":65,"./model/ReloadCollectionRequestBody":66,"./model/ReloadCoreRequestBody":67,"./model/RenameCollectionRequestBody":68,"./model/RenameCoreRequestBody":69,"./model/ReplaceNodeRequestBody":70,"./model/ResponseHeader":71,"./model/RestoreCoreRequestBody":72,"./model/ScaleCollectionRequestBody":73,"./model/SchemaInfoResponse":74,"./model/SchemaNameResponse":75,"./model/SchemaSimilarityResponse":76,"./model/SchemaUniqueKeyResponse":77,"./model/SchemaVersionResponse":78,"./model/SchemaZkVersionResponse":79,"./model/SnapshotInformation":80,"./model/SolrJerseyResponse":81,"./model/SubResponseAccumulatingJerseyResponse":82,"./model/SwapCoresRequestBody":83,"./model/UnloadCoreRequestBody":84,"./model/UpdateAliasPropertiesRequestBody":85,"./model/UpdateAliasPropertyRequestBody":86,"./model/UpdateCollectionPropertyRequestBody":87}],27:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
 * The AddReplicaPropertyRequestBody model module.
 * @module model/AddReplicaPropertyRequestBody
 * @version 9.6.0
 */
var AddReplicaPropertyRequestBody = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>AddReplicaPropertyRequestBody</code>.
   * @alias module:model/AddReplicaPropertyRequestBody
   * @param value {String} The value to assign to the property.
   */
  function AddReplicaPropertyRequestBody(value) {
    _classCallCheck(this, AddReplicaPropertyRequestBody);
    AddReplicaPropertyRequestBody.initialize(this, value);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  return _createClass(AddReplicaPropertyRequestBody, null, [{
    key: "initialize",
    value: function initialize(obj, value) {
      obj['value'] = value;
    }

    /**
     * Constructs a <code>AddReplicaPropertyRequestBody</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/AddReplicaPropertyRequestBody} obj Optional instance to populate.
     * @return {module:model/AddReplicaPropertyRequestBody} The populated <code>AddReplicaPropertyRequestBody</code> instance.
     */
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new AddReplicaPropertyRequestBody();
        if (data.hasOwnProperty('value')) {
          obj['value'] = _ApiClient["default"].convertToType(data['value'], 'String');
        }
        if (data.hasOwnProperty('shardUnique')) {
          obj['shardUnique'] = _ApiClient["default"].convertToType(data['shardUnique'], 'Boolean');
        }
      }
      return obj;
    }
  }]);
}();
/**
 * The value to assign to the property.
 * @member {String} value
 */
AddReplicaPropertyRequestBody.prototype['value'] = undefined;

/**
 * If `true`, then setting this property in one replica will remove the property from all other replicas in that shard. The default is `false`.\\nThere is one pre-defined property `preferredLeader` for which `shardUnique` is forced to `true` and an error returned if `shardUnique` is explicitly set to `false`.
 * @member {Boolean} shardUnique
 * @default false
 */
AddReplicaPropertyRequestBody.prototype['shardUnique'] = false;
var _default = exports["default"] = AddReplicaPropertyRequestBody;
},{"../ApiClient":8}],28:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
 * The BackupDeletionData model module.
 * @module model/BackupDeletionData
 * @version 9.6.0
 */
var BackupDeletionData = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>BackupDeletionData</code>.
   * @alias module:model/BackupDeletionData
   */
  function BackupDeletionData() {
    _classCallCheck(this, BackupDeletionData);
    BackupDeletionData.initialize(this);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  return _createClass(BackupDeletionData, null, [{
    key: "initialize",
    value: function initialize(obj) {}

    /**
     * Constructs a <code>BackupDeletionData</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/BackupDeletionData} obj Optional instance to populate.
     * @return {module:model/BackupDeletionData} The populated <code>BackupDeletionData</code> instance.
     */
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new BackupDeletionData();
        if (data.hasOwnProperty('startTime')) {
          obj['startTime'] = _ApiClient["default"].convertToType(data['startTime'], 'String');
        }
        if (data.hasOwnProperty('backupId')) {
          obj['backupId'] = _ApiClient["default"].convertToType(data['backupId'], 'Number');
        }
        if (data.hasOwnProperty('size')) {
          obj['size'] = _ApiClient["default"].convertToType(data['size'], 'Number');
        }
        if (data.hasOwnProperty('numFiles')) {
          obj['numFiles'] = _ApiClient["default"].convertToType(data['numFiles'], 'Number');
        }
      }
      return obj;
    }
  }]);
}();
/**
 * @member {String} startTime
 */
BackupDeletionData.prototype['startTime'] = undefined;

/**
 * @member {Number} backupId
 */
BackupDeletionData.prototype['backupId'] = undefined;

/**
 * @member {Number} size
 */
BackupDeletionData.prototype['size'] = undefined;

/**
 * @member {Number} numFiles
 */
BackupDeletionData.prototype['numFiles'] = undefined;
var _default = exports["default"] = BackupDeletionData;
},{"../ApiClient":8}],29:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
var _BackupDeletionData = _interopRequireDefault(require("./BackupDeletionData"));
var _ErrorInfo = _interopRequireDefault(require("./ErrorInfo"));
var _ResponseHeader = _interopRequireDefault(require("./ResponseHeader"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
 * The BackupDeletionResponseBody model module.
 * @module model/BackupDeletionResponseBody
 * @version 9.6.0
 */
var BackupDeletionResponseBody = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>BackupDeletionResponseBody</code>.
   * @alias module:model/BackupDeletionResponseBody
   */
  function BackupDeletionResponseBody() {
    _classCallCheck(this, BackupDeletionResponseBody);
    BackupDeletionResponseBody.initialize(this);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  return _createClass(BackupDeletionResponseBody, null, [{
    key: "initialize",
    value: function initialize(obj) {}

    /**
     * Constructs a <code>BackupDeletionResponseBody</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/BackupDeletionResponseBody} obj Optional instance to populate.
     * @return {module:model/BackupDeletionResponseBody} The populated <code>BackupDeletionResponseBody</code> instance.
     */
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new BackupDeletionResponseBody();
        if (data.hasOwnProperty('collection')) {
          obj['collection'] = _ApiClient["default"].convertToType(data['collection'], 'String');
        }
        if (data.hasOwnProperty('deleted')) {
          obj['deleted'] = _ApiClient["default"].convertToType(data['deleted'], [_BackupDeletionData["default"]]);
        }
        if (data.hasOwnProperty('responseHeader')) {
          obj['responseHeader'] = _ResponseHeader["default"].constructFromObject(data['responseHeader']);
        }
        if (data.hasOwnProperty('error')) {
          obj['error'] = _ErrorInfo["default"].constructFromObject(data['error']);
        }
        if (data.hasOwnProperty('requestid')) {
          obj['requestid'] = _ApiClient["default"].convertToType(data['requestid'], 'String');
        }
        if (data.hasOwnProperty('success')) {
          obj['success'] = _ApiClient["default"].convertToType(data['success'], Object);
        }
        if (data.hasOwnProperty('failure')) {
          obj['failure'] = _ApiClient["default"].convertToType(data['failure'], Object);
        }
        if (data.hasOwnProperty('warning')) {
          obj['warning'] = _ApiClient["default"].convertToType(data['warning'], 'String');
        }
      }
      return obj;
    }
  }]);
}();
/**
 * @member {String} collection
 */
BackupDeletionResponseBody.prototype['collection'] = undefined;

/**
 * @member {Array.<module:model/BackupDeletionData>} deleted
 */
BackupDeletionResponseBody.prototype['deleted'] = undefined;

/**
 * @member {module:model/ResponseHeader} responseHeader
 */
BackupDeletionResponseBody.prototype['responseHeader'] = undefined;

/**
 * @member {module:model/ErrorInfo} error
 */
BackupDeletionResponseBody.prototype['error'] = undefined;

/**
 * @member {String} requestid
 */
BackupDeletionResponseBody.prototype['requestid'] = undefined;

/**
 * @member {Object} success
 */
BackupDeletionResponseBody.prototype['success'] = undefined;

/**
 * @member {Object} failure
 */
BackupDeletionResponseBody.prototype['failure'] = undefined;

/**
 * @member {String} warning
 */
BackupDeletionResponseBody.prototype['warning'] = undefined;
var _default = exports["default"] = BackupDeletionResponseBody;
},{"../ApiClient":8,"./BackupDeletionData":28,"./ErrorInfo":45,"./ResponseHeader":71}],30:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
 * The BalanceReplicasRequestBody model module.
 * @module model/BalanceReplicasRequestBody
 * @version 9.6.0
 */
var BalanceReplicasRequestBody = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>BalanceReplicasRequestBody</code>.
   * @alias module:model/BalanceReplicasRequestBody
   */
  function BalanceReplicasRequestBody() {
    _classCallCheck(this, BalanceReplicasRequestBody);
    BalanceReplicasRequestBody.initialize(this);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  return _createClass(BalanceReplicasRequestBody, null, [{
    key: "initialize",
    value: function initialize(obj) {}

    /**
     * Constructs a <code>BalanceReplicasRequestBody</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/BalanceReplicasRequestBody} obj Optional instance to populate.
     * @return {module:model/BalanceReplicasRequestBody} The populated <code>BalanceReplicasRequestBody</code> instance.
     */
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new BalanceReplicasRequestBody();
        if (data.hasOwnProperty('nodes')) {
          obj['nodes'] = _ApiClient["default"].convertToType(data['nodes'], ['String']);
        }
        if (data.hasOwnProperty('waitForFinalState')) {
          obj['waitForFinalState'] = _ApiClient["default"].convertToType(data['waitForFinalState'], 'Boolean');
        }
        if (data.hasOwnProperty('async')) {
          obj['async'] = _ApiClient["default"].convertToType(data['async'], 'String');
        }
      }
      return obj;
    }
  }]);
}();
/**
 * The set of nodes across which replicas will be balanced. Defaults to all live data nodes.
 * @member {Array.<String>} nodes
 */
BalanceReplicasRequestBody.prototype['nodes'] = undefined;

/**
 * If true, the request will complete only when all affected replicas become active. If false, the API will return the status of the single action, which may be before the new replica is online and active.
 * @member {Boolean} waitForFinalState
 */
BalanceReplicasRequestBody.prototype['waitForFinalState'] = undefined;

/**
 * Request ID to track this action which will be processed asynchronously.
 * @member {String} async
 */
BalanceReplicasRequestBody.prototype['async'] = undefined;
var _default = exports["default"] = BalanceReplicasRequestBody;
},{"../ApiClient":8}],31:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
 * The BalanceShardUniqueRequestBody model module.
 * @module model/BalanceShardUniqueRequestBody
 * @version 9.6.0
 */
var BalanceShardUniqueRequestBody = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>BalanceShardUniqueRequestBody</code>.
   * @alias module:model/BalanceShardUniqueRequestBody
   * @param property {String} 
   */
  function BalanceShardUniqueRequestBody(property) {
    _classCallCheck(this, BalanceShardUniqueRequestBody);
    BalanceShardUniqueRequestBody.initialize(this, property);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  return _createClass(BalanceShardUniqueRequestBody, null, [{
    key: "initialize",
    value: function initialize(obj, property) {
      obj['property'] = property;
    }

    /**
     * Constructs a <code>BalanceShardUniqueRequestBody</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/BalanceShardUniqueRequestBody} obj Optional instance to populate.
     * @return {module:model/BalanceShardUniqueRequestBody} The populated <code>BalanceShardUniqueRequestBody</code> instance.
     */
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new BalanceShardUniqueRequestBody();
        if (data.hasOwnProperty('property')) {
          obj['property'] = _ApiClient["default"].convertToType(data['property'], 'String');
        }
        if (data.hasOwnProperty('onlyActiveNodes')) {
          obj['onlyActiveNodes'] = _ApiClient["default"].convertToType(data['onlyActiveNodes'], 'Boolean');
        }
        if (data.hasOwnProperty('shardUnique')) {
          obj['shardUnique'] = _ApiClient["default"].convertToType(data['shardUnique'], 'Boolean');
        }
        if (data.hasOwnProperty('async')) {
          obj['async'] = _ApiClient["default"].convertToType(data['async'], 'String');
        }
      }
      return obj;
    }
  }]);
}();
/**
 * @member {String} property
 */
BalanceShardUniqueRequestBody.prototype['property'] = undefined;

/**
 * @member {Boolean} onlyActiveNodes
 */
BalanceShardUniqueRequestBody.prototype['onlyActiveNodes'] = undefined;

/**
 * @member {Boolean} shardUnique
 */
BalanceShardUniqueRequestBody.prototype['shardUnique'] = undefined;

/**
 * @member {String} async
 */
BalanceShardUniqueRequestBody.prototype['async'] = undefined;
var _default = exports["default"] = BalanceShardUniqueRequestBody;
},{"../ApiClient":8}],32:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
 * The CollectionBackupDetails model module.
 * @module model/CollectionBackupDetails
 * @version 9.6.0
 */
var CollectionBackupDetails = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>CollectionBackupDetails</code>.
   * @alias module:model/CollectionBackupDetails
   */
  function CollectionBackupDetails() {
    _classCallCheck(this, CollectionBackupDetails);
    CollectionBackupDetails.initialize(this);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  return _createClass(CollectionBackupDetails, null, [{
    key: "initialize",
    value: function initialize(obj) {}

    /**
     * Constructs a <code>CollectionBackupDetails</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/CollectionBackupDetails} obj Optional instance to populate.
     * @return {module:model/CollectionBackupDetails} The populated <code>CollectionBackupDetails</code> instance.
     */
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new CollectionBackupDetails();
        if (data.hasOwnProperty('backupId')) {
          obj['backupId'] = _ApiClient["default"].convertToType(data['backupId'], 'Number');
        }
        if (data.hasOwnProperty('indexVersion')) {
          obj['indexVersion'] = _ApiClient["default"].convertToType(data['indexVersion'], 'String');
        }
        if (data.hasOwnProperty('startTime')) {
          obj['startTime'] = _ApiClient["default"].convertToType(data['startTime'], 'String');
        }
        if (data.hasOwnProperty('endTime')) {
          obj['endTime'] = _ApiClient["default"].convertToType(data['endTime'], 'String');
        }
        if (data.hasOwnProperty('indexFileCount')) {
          obj['indexFileCount'] = _ApiClient["default"].convertToType(data['indexFileCount'], 'Number');
        }
        if (data.hasOwnProperty('indexSizeMB')) {
          obj['indexSizeMB'] = _ApiClient["default"].convertToType(data['indexSizeMB'], 'Number');
        }
        if (data.hasOwnProperty('shardBackupIds')) {
          obj['shardBackupIds'] = _ApiClient["default"].convertToType(data['shardBackupIds'], {
            'String': 'String'
          });
        }
        if (data.hasOwnProperty('collectionAlias')) {
          obj['collectionAlias'] = _ApiClient["default"].convertToType(data['collectionAlias'], 'String');
        }
        if (data.hasOwnProperty('extraProperties')) {
          obj['extraProperties'] = _ApiClient["default"].convertToType(data['extraProperties'], {
            'String': 'String'
          });
        }
        if (data.hasOwnProperty('collection.configName')) {
          obj['collection.configName'] = _ApiClient["default"].convertToType(data['collection.configName'], 'String');
        }
      }
      return obj;
    }
  }]);
}();
/**
 * @member {Number} backupId
 */
CollectionBackupDetails.prototype['backupId'] = undefined;

/**
 * @member {String} indexVersion
 */
CollectionBackupDetails.prototype['indexVersion'] = undefined;

/**
 * @member {String} startTime
 */
CollectionBackupDetails.prototype['startTime'] = undefined;

/**
 * @member {String} endTime
 */
CollectionBackupDetails.prototype['endTime'] = undefined;

/**
 * @member {Number} indexFileCount
 */
CollectionBackupDetails.prototype['indexFileCount'] = undefined;

/**
 * @member {Number} indexSizeMB
 */
CollectionBackupDetails.prototype['indexSizeMB'] = undefined;

/**
 * @member {Object.<String, String>} shardBackupIds
 */
CollectionBackupDetails.prototype['shardBackupIds'] = undefined;

/**
 * @member {String} collectionAlias
 */
CollectionBackupDetails.prototype['collectionAlias'] = undefined;

/**
 * @member {Object.<String, String>} extraProperties
 */
CollectionBackupDetails.prototype['extraProperties'] = undefined;

/**
 * @member {String} collection.configName
 */
CollectionBackupDetails.prototype['collection.configName'] = undefined;
var _default = exports["default"] = CollectionBackupDetails;
},{"../ApiClient":8}],33:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
 * The CreateCollectionBackupRequestBody model module.
 * @module model/CreateCollectionBackupRequestBody
 * @version 9.6.0
 */
var CreateCollectionBackupRequestBody = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>CreateCollectionBackupRequestBody</code>.
   * @alias module:model/CreateCollectionBackupRequestBody
   */
  function CreateCollectionBackupRequestBody() {
    _classCallCheck(this, CreateCollectionBackupRequestBody);
    CreateCollectionBackupRequestBody.initialize(this);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  return _createClass(CreateCollectionBackupRequestBody, null, [{
    key: "initialize",
    value: function initialize(obj) {}

    /**
     * Constructs a <code>CreateCollectionBackupRequestBody</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/CreateCollectionBackupRequestBody} obj Optional instance to populate.
     * @return {module:model/CreateCollectionBackupRequestBody} The populated <code>CreateCollectionBackupRequestBody</code> instance.
     */
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new CreateCollectionBackupRequestBody();
        if (data.hasOwnProperty('location')) {
          obj['location'] = _ApiClient["default"].convertToType(data['location'], 'String');
        }
        if (data.hasOwnProperty('repository')) {
          obj['repository'] = _ApiClient["default"].convertToType(data['repository'], 'String');
        }
        if (data.hasOwnProperty('followAliases')) {
          obj['followAliases'] = _ApiClient["default"].convertToType(data['followAliases'], 'Boolean');
        }
        if (data.hasOwnProperty('backupStrategy')) {
          obj['backupStrategy'] = _ApiClient["default"].convertToType(data['backupStrategy'], 'String');
        }
        if (data.hasOwnProperty('snapshotName')) {
          obj['snapshotName'] = _ApiClient["default"].convertToType(data['snapshotName'], 'String');
        }
        if (data.hasOwnProperty('incremental')) {
          obj['incremental'] = _ApiClient["default"].convertToType(data['incremental'], 'Boolean');
        }
        if (data.hasOwnProperty('backupConfigset')) {
          obj['backupConfigset'] = _ApiClient["default"].convertToType(data['backupConfigset'], 'Boolean');
        }
        if (data.hasOwnProperty('maxNumBackupPoints')) {
          obj['maxNumBackupPoints'] = _ApiClient["default"].convertToType(data['maxNumBackupPoints'], 'Number');
        }
        if (data.hasOwnProperty('async')) {
          obj['async'] = _ApiClient["default"].convertToType(data['async'], 'String');
        }
        if (data.hasOwnProperty('extraProperties')) {
          obj['extraProperties'] = _ApiClient["default"].convertToType(data['extraProperties'], {
            'String': 'String'
          });
        }
      }
      return obj;
    }
  }]);
}();
/**
 * @member {String} location
 */
CreateCollectionBackupRequestBody.prototype['location'] = undefined;

/**
 * @member {String} repository
 */
CreateCollectionBackupRequestBody.prototype['repository'] = undefined;

/**
 * @member {Boolean} followAliases
 */
CreateCollectionBackupRequestBody.prototype['followAliases'] = undefined;

/**
 * @member {String} backupStrategy
 */
CreateCollectionBackupRequestBody.prototype['backupStrategy'] = undefined;

/**
 * @member {String} snapshotName
 */
CreateCollectionBackupRequestBody.prototype['snapshotName'] = undefined;

/**
 * @member {Boolean} incremental
 */
CreateCollectionBackupRequestBody.prototype['incremental'] = undefined;

/**
 * @member {Boolean} backupConfigset
 */
CreateCollectionBackupRequestBody.prototype['backupConfigset'] = undefined;

/**
 * @member {Number} maxNumBackupPoints
 */
CreateCollectionBackupRequestBody.prototype['maxNumBackupPoints'] = undefined;

/**
 * @member {String} async
 */
CreateCollectionBackupRequestBody.prototype['async'] = undefined;

/**
 * @member {Object.<String, String>} extraProperties
 */
CreateCollectionBackupRequestBody.prototype['extraProperties'] = undefined;
var _default = exports["default"] = CreateCollectionBackupRequestBody;
},{"../ApiClient":8}],34:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
var _CreateCollectionRouterProperties = _interopRequireDefault(require("./CreateCollectionRouterProperties"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
 * The CreateCollectionRequestBody model module.
 * @module model/CreateCollectionRequestBody
 * @version 9.6.0
 */
var CreateCollectionRequestBody = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>CreateCollectionRequestBody</code>.
   * @alias module:model/CreateCollectionRequestBody
   */
  function CreateCollectionRequestBody() {
    _classCallCheck(this, CreateCollectionRequestBody);
    CreateCollectionRequestBody.initialize(this);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  return _createClass(CreateCollectionRequestBody, null, [{
    key: "initialize",
    value: function initialize(obj) {}

    /**
     * Constructs a <code>CreateCollectionRequestBody</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/CreateCollectionRequestBody} obj Optional instance to populate.
     * @return {module:model/CreateCollectionRequestBody} The populated <code>CreateCollectionRequestBody</code> instance.
     */
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new CreateCollectionRequestBody();
        if (data.hasOwnProperty('name')) {
          obj['name'] = _ApiClient["default"].convertToType(data['name'], 'String');
        }
        if (data.hasOwnProperty('replicationFactor')) {
          obj['replicationFactor'] = _ApiClient["default"].convertToType(data['replicationFactor'], 'Number');
        }
        if (data.hasOwnProperty('config')) {
          obj['config'] = _ApiClient["default"].convertToType(data['config'], 'String');
        }
        if (data.hasOwnProperty('numShards')) {
          obj['numShards'] = _ApiClient["default"].convertToType(data['numShards'], 'Number');
        }
        if (data.hasOwnProperty('shardNames')) {
          obj['shardNames'] = _ApiClient["default"].convertToType(data['shardNames'], ['String']);
        }
        if (data.hasOwnProperty('pullReplicas')) {
          obj['pullReplicas'] = _ApiClient["default"].convertToType(data['pullReplicas'], 'Number');
        }
        if (data.hasOwnProperty('tlogReplicas')) {
          obj['tlogReplicas'] = _ApiClient["default"].convertToType(data['tlogReplicas'], 'Number');
        }
        if (data.hasOwnProperty('nrtReplicas')) {
          obj['nrtReplicas'] = _ApiClient["default"].convertToType(data['nrtReplicas'], 'Number');
        }
        if (data.hasOwnProperty('waitForFinalState')) {
          obj['waitForFinalState'] = _ApiClient["default"].convertToType(data['waitForFinalState'], 'Boolean');
        }
        if (data.hasOwnProperty('perReplicaState')) {
          obj['perReplicaState'] = _ApiClient["default"].convertToType(data['perReplicaState'], 'Boolean');
        }
        if (data.hasOwnProperty('alias')) {
          obj['alias'] = _ApiClient["default"].convertToType(data['alias'], 'String');
        }
        if (data.hasOwnProperty('properties')) {
          obj['properties'] = _ApiClient["default"].convertToType(data['properties'], {
            'String': 'String'
          });
        }
        if (data.hasOwnProperty('async')) {
          obj['async'] = _ApiClient["default"].convertToType(data['async'], 'String');
        }
        if (data.hasOwnProperty('router')) {
          obj['router'] = _CreateCollectionRouterProperties["default"].constructFromObject(data['router']);
        }
        if (data.hasOwnProperty('nodeSet')) {
          obj['nodeSet'] = _ApiClient["default"].convertToType(data['nodeSet'], ['String']);
        }
        if (data.hasOwnProperty('createReplicas')) {
          obj['createReplicas'] = _ApiClient["default"].convertToType(data['createReplicas'], 'Boolean');
        }
        if (data.hasOwnProperty('shuffleNodes')) {
          obj['shuffleNodes'] = _ApiClient["default"].convertToType(data['shuffleNodes'], 'Boolean');
        }
      }
      return obj;
    }
  }]);
}();
/**
 * @member {String} name
 */
CreateCollectionRequestBody.prototype['name'] = undefined;

/**
 * @member {Number} replicationFactor
 */
CreateCollectionRequestBody.prototype['replicationFactor'] = undefined;

/**
 * @member {String} config
 */
CreateCollectionRequestBody.prototype['config'] = undefined;

/**
 * @member {Number} numShards
 */
CreateCollectionRequestBody.prototype['numShards'] = undefined;

/**
 * @member {Array.<String>} shardNames
 */
CreateCollectionRequestBody.prototype['shardNames'] = undefined;

/**
 * @member {Number} pullReplicas
 */
CreateCollectionRequestBody.prototype['pullReplicas'] = undefined;

/**
 * @member {Number} tlogReplicas
 */
CreateCollectionRequestBody.prototype['tlogReplicas'] = undefined;

/**
 * @member {Number} nrtReplicas
 */
CreateCollectionRequestBody.prototype['nrtReplicas'] = undefined;

/**
 * @member {Boolean} waitForFinalState
 */
CreateCollectionRequestBody.prototype['waitForFinalState'] = undefined;

/**
 * @member {Boolean} perReplicaState
 */
CreateCollectionRequestBody.prototype['perReplicaState'] = undefined;

/**
 * @member {String} alias
 */
CreateCollectionRequestBody.prototype['alias'] = undefined;

/**
 * @member {Object.<String, String>} properties
 */
CreateCollectionRequestBody.prototype['properties'] = undefined;

/**
 * @member {String} async
 */
CreateCollectionRequestBody.prototype['async'] = undefined;

/**
 * @member {module:model/CreateCollectionRouterProperties} router
 */
CreateCollectionRequestBody.prototype['router'] = undefined;

/**
 * @member {Array.<String>} nodeSet
 */
CreateCollectionRequestBody.prototype['nodeSet'] = undefined;

/**
 * @member {Boolean} createReplicas
 */
CreateCollectionRequestBody.prototype['createReplicas'] = undefined;

/**
 * @member {Boolean} shuffleNodes
 */
CreateCollectionRequestBody.prototype['shuffleNodes'] = undefined;
var _default = exports["default"] = CreateCollectionRequestBody;
},{"../ApiClient":8,"./CreateCollectionRouterProperties":35}],35:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
 * The CreateCollectionRouterProperties model module.
 * @module model/CreateCollectionRouterProperties
 * @version 9.6.0
 */
var CreateCollectionRouterProperties = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>CreateCollectionRouterProperties</code>.
   * @alias module:model/CreateCollectionRouterProperties
   */
  function CreateCollectionRouterProperties() {
    _classCallCheck(this, CreateCollectionRouterProperties);
    CreateCollectionRouterProperties.initialize(this);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  return _createClass(CreateCollectionRouterProperties, null, [{
    key: "initialize",
    value: function initialize(obj) {}

    /**
     * Constructs a <code>CreateCollectionRouterProperties</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/CreateCollectionRouterProperties} obj Optional instance to populate.
     * @return {module:model/CreateCollectionRouterProperties} The populated <code>CreateCollectionRouterProperties</code> instance.
     */
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new CreateCollectionRouterProperties();
        if (data.hasOwnProperty('name')) {
          obj['name'] = _ApiClient["default"].convertToType(data['name'], 'String');
        }
        if (data.hasOwnProperty('field')) {
          obj['field'] = _ApiClient["default"].convertToType(data['field'], 'String');
        }
      }
      return obj;
    }
  }]);
}();
/**
 * @member {String} name
 */
CreateCollectionRouterProperties.prototype['name'] = undefined;

/**
 * @member {String} field
 */
CreateCollectionRouterProperties.prototype['field'] = undefined;
var _default = exports["default"] = CreateCollectionRouterProperties;
},{"../ApiClient":8}],36:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
 * The CreateCollectionSnapshotRequestBody model module.
 * @module model/CreateCollectionSnapshotRequestBody
 * @version 9.6.0
 */
var CreateCollectionSnapshotRequestBody = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>CreateCollectionSnapshotRequestBody</code>.
   * @alias module:model/CreateCollectionSnapshotRequestBody
   */
  function CreateCollectionSnapshotRequestBody() {
    _classCallCheck(this, CreateCollectionSnapshotRequestBody);
    CreateCollectionSnapshotRequestBody.initialize(this);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  return _createClass(CreateCollectionSnapshotRequestBody, null, [{
    key: "initialize",
    value: function initialize(obj) {}

    /**
     * Constructs a <code>CreateCollectionSnapshotRequestBody</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/CreateCollectionSnapshotRequestBody} obj Optional instance to populate.
     * @return {module:model/CreateCollectionSnapshotRequestBody} The populated <code>CreateCollectionSnapshotRequestBody</code> instance.
     */
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new CreateCollectionSnapshotRequestBody();
        if (data.hasOwnProperty('async')) {
          obj['async'] = _ApiClient["default"].convertToType(data['async'], 'String');
        }
        if (data.hasOwnProperty('followAliases')) {
          obj['followAliases'] = _ApiClient["default"].convertToType(data['followAliases'], 'Boolean');
        }
      }
      return obj;
    }
  }]);
}();
/**
 * @member {String} async
 */
CreateCollectionSnapshotRequestBody.prototype['async'] = undefined;

/**
 * @member {Boolean} followAliases
 */
CreateCollectionSnapshotRequestBody.prototype['followAliases'] = undefined;
var _default = exports["default"] = CreateCollectionSnapshotRequestBody;
},{"../ApiClient":8}],37:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
var _ErrorInfo = _interopRequireDefault(require("./ErrorInfo"));
var _ResponseHeader = _interopRequireDefault(require("./ResponseHeader"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
 * The CreateCollectionSnapshotResponse model module.
 * @module model/CreateCollectionSnapshotResponse
 * @version 9.6.0
 */
var CreateCollectionSnapshotResponse = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>CreateCollectionSnapshotResponse</code>.
   * @alias module:model/CreateCollectionSnapshotResponse
   */
  function CreateCollectionSnapshotResponse() {
    _classCallCheck(this, CreateCollectionSnapshotResponse);
    CreateCollectionSnapshotResponse.initialize(this);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  return _createClass(CreateCollectionSnapshotResponse, null, [{
    key: "initialize",
    value: function initialize(obj) {}

    /**
     * Constructs a <code>CreateCollectionSnapshotResponse</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/CreateCollectionSnapshotResponse} obj Optional instance to populate.
     * @return {module:model/CreateCollectionSnapshotResponse} The populated <code>CreateCollectionSnapshotResponse</code> instance.
     */
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new CreateCollectionSnapshotResponse();
        if (data.hasOwnProperty('collection')) {
          obj['collection'] = _ApiClient["default"].convertToType(data['collection'], 'String');
        }
        if (data.hasOwnProperty('followAliases')) {
          obj['followAliases'] = _ApiClient["default"].convertToType(data['followAliases'], 'Boolean');
        }
        if (data.hasOwnProperty('responseHeader')) {
          obj['responseHeader'] = _ResponseHeader["default"].constructFromObject(data['responseHeader']);
        }
        if (data.hasOwnProperty('error')) {
          obj['error'] = _ErrorInfo["default"].constructFromObject(data['error']);
        }
        if (data.hasOwnProperty('requestid')) {
          obj['requestid'] = _ApiClient["default"].convertToType(data['requestid'], 'String');
        }
        if (data.hasOwnProperty('snapshot')) {
          obj['snapshot'] = _ApiClient["default"].convertToType(data['snapshot'], 'String');
        }
      }
      return obj;
    }
  }]);
}();
/**
 * The name of the collection.
 * @member {String} collection
 */
CreateCollectionSnapshotResponse.prototype['collection'] = undefined;

/**
 * A flag that treats the collName parameter as a collection alias.
 * @member {Boolean} followAliases
 */
CreateCollectionSnapshotResponse.prototype['followAliases'] = undefined;

/**
 * @member {module:model/ResponseHeader} responseHeader
 */
CreateCollectionSnapshotResponse.prototype['responseHeader'] = undefined;

/**
 * @member {module:model/ErrorInfo} error
 */
CreateCollectionSnapshotResponse.prototype['error'] = undefined;

/**
 * @member {String} requestid
 */
CreateCollectionSnapshotResponse.prototype['requestid'] = undefined;

/**
 * The name of the snapshot to be created.
 * @member {String} snapshot
 */
CreateCollectionSnapshotResponse.prototype['snapshot'] = undefined;
var _default = exports["default"] = CreateCollectionSnapshotResponse;
},{"../ApiClient":8,"./ErrorInfo":45,"./ResponseHeader":71}],38:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
 * The CreateCoreBackupRequestBody model module.
 * @module model/CreateCoreBackupRequestBody
 * @version 9.6.0
 */
var CreateCoreBackupRequestBody = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>CreateCoreBackupRequestBody</code>.
   * Additional backup params
   * @alias module:model/CreateCoreBackupRequestBody
   */
  function CreateCoreBackupRequestBody() {
    _classCallCheck(this, CreateCoreBackupRequestBody);
    CreateCoreBackupRequestBody.initialize(this);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  return _createClass(CreateCoreBackupRequestBody, null, [{
    key: "initialize",
    value: function initialize(obj) {}

    /**
     * Constructs a <code>CreateCoreBackupRequestBody</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/CreateCoreBackupRequestBody} obj Optional instance to populate.
     * @return {module:model/CreateCoreBackupRequestBody} The populated <code>CreateCoreBackupRequestBody</code> instance.
     */
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new CreateCoreBackupRequestBody();
        if (data.hasOwnProperty('repository')) {
          obj['repository'] = _ApiClient["default"].convertToType(data['repository'], 'String');
        }
        if (data.hasOwnProperty('location')) {
          obj['location'] = _ApiClient["default"].convertToType(data['location'], 'String');
        }
        if (data.hasOwnProperty('shardBackupId')) {
          obj['shardBackupId'] = _ApiClient["default"].convertToType(data['shardBackupId'], 'String');
        }
        if (data.hasOwnProperty('prevShardBackupId')) {
          obj['prevShardBackupId'] = _ApiClient["default"].convertToType(data['prevShardBackupId'], 'String');
        }
        if (data.hasOwnProperty('commitName')) {
          obj['commitName'] = _ApiClient["default"].convertToType(data['commitName'], 'String');
        }
        if (data.hasOwnProperty('incremental')) {
          obj['incremental'] = _ApiClient["default"].convertToType(data['incremental'], 'Boolean');
        }
        if (data.hasOwnProperty('async')) {
          obj['async'] = _ApiClient["default"].convertToType(data['async'], 'String');
        }
        if (data.hasOwnProperty('backupName')) {
          obj['backupName'] = _ApiClient["default"].convertToType(data['backupName'], 'String');
        }
      }
      return obj;
    }
  }]);
}();
/**
 * The name of the repository to be used for backup.
 * @member {String} repository
 */
CreateCoreBackupRequestBody.prototype['repository'] = undefined;

/**
 * The path where the backup will be created
 * @member {String} location
 */
CreateCoreBackupRequestBody.prototype['location'] = undefined;

/**
 * @member {String} shardBackupId
 */
CreateCoreBackupRequestBody.prototype['shardBackupId'] = undefined;

/**
 * @member {String} prevShardBackupId
 */
CreateCoreBackupRequestBody.prototype['prevShardBackupId'] = undefined;

/**
 * The name of the commit which was used while taking a snapshot using the CREATESNAPSHOT command.
 * @member {String} commitName
 */
CreateCoreBackupRequestBody.prototype['commitName'] = undefined;

/**
 * To turn on incremental backup feature
 * @member {Boolean} incremental
 */
CreateCoreBackupRequestBody.prototype['incremental'] = undefined;

/**
 * Request ID to track this action which will be processed asynchronously.
 * @member {String} async
 */
CreateCoreBackupRequestBody.prototype['async'] = undefined;

/**
 * A descriptive name for the backup.  Only used by non-incremental backups.
 * @member {String} backupName
 */
CreateCoreBackupRequestBody.prototype['backupName'] = undefined;
var _default = exports["default"] = CreateCoreBackupRequestBody;
},{"../ApiClient":8}],39:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
var _ErrorInfo = _interopRequireDefault(require("./ErrorInfo"));
var _ResponseHeader = _interopRequireDefault(require("./ResponseHeader"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
 * The CreateCoreSnapshotResponse model module.
 * @module model/CreateCoreSnapshotResponse
 * @version 9.6.0
 */
var CreateCoreSnapshotResponse = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>CreateCoreSnapshotResponse</code>.
   * @alias module:model/CreateCoreSnapshotResponse
   */
  function CreateCoreSnapshotResponse() {
    _classCallCheck(this, CreateCoreSnapshotResponse);
    CreateCoreSnapshotResponse.initialize(this);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  return _createClass(CreateCoreSnapshotResponse, null, [{
    key: "initialize",
    value: function initialize(obj) {}

    /**
     * Constructs a <code>CreateCoreSnapshotResponse</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/CreateCoreSnapshotResponse} obj Optional instance to populate.
     * @return {module:model/CreateCoreSnapshotResponse} The populated <code>CreateCoreSnapshotResponse</code> instance.
     */
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new CreateCoreSnapshotResponse();
        if (data.hasOwnProperty('core')) {
          obj['core'] = _ApiClient["default"].convertToType(data['core'], 'String');
        }
        if (data.hasOwnProperty('indexDirPath')) {
          obj['indexDirPath'] = _ApiClient["default"].convertToType(data['indexDirPath'], 'String');
        }
        if (data.hasOwnProperty('generation')) {
          obj['generation'] = _ApiClient["default"].convertToType(data['generation'], 'Number');
        }
        if (data.hasOwnProperty('files')) {
          obj['files'] = _ApiClient["default"].convertToType(data['files'], ['String']);
        }
        if (data.hasOwnProperty('responseHeader')) {
          obj['responseHeader'] = _ResponseHeader["default"].constructFromObject(data['responseHeader']);
        }
        if (data.hasOwnProperty('error')) {
          obj['error'] = _ErrorInfo["default"].constructFromObject(data['error']);
        }
        if (data.hasOwnProperty('commitName')) {
          obj['commitName'] = _ApiClient["default"].convertToType(data['commitName'], 'String');
        }
      }
      return obj;
    }
  }]);
}();
/**
 * The name of the core.
 * @member {String} core
 */
CreateCoreSnapshotResponse.prototype['core'] = undefined;

/**
 * The path to the directory containing the index files.
 * @member {String} indexDirPath
 */
CreateCoreSnapshotResponse.prototype['indexDirPath'] = undefined;

/**
 * The generation value for the created snapshot.
 * @member {Number} generation
 */
CreateCoreSnapshotResponse.prototype['generation'] = undefined;

/**
 * The list of index filenames contained within the created snapshot.
 * @member {Array.<String>} files
 */
CreateCoreSnapshotResponse.prototype['files'] = undefined;

/**
 * @member {module:model/ResponseHeader} responseHeader
 */
CreateCoreSnapshotResponse.prototype['responseHeader'] = undefined;

/**
 * @member {module:model/ErrorInfo} error
 */
CreateCoreSnapshotResponse.prototype['error'] = undefined;

/**
 * The name of the created snapshot.
 * @member {String} commitName
 */
CreateCoreSnapshotResponse.prototype['commitName'] = undefined;
var _default = exports["default"] = CreateCoreSnapshotResponse;
},{"../ApiClient":8,"./ErrorInfo":45,"./ResponseHeader":71}],40:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
 * The CreateReplicaRequestBody model module.
 * @module model/CreateReplicaRequestBody
 * @version 9.6.0
 */
var CreateReplicaRequestBody = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>CreateReplicaRequestBody</code>.
   * @alias module:model/CreateReplicaRequestBody
   */
  function CreateReplicaRequestBody() {
    _classCallCheck(this, CreateReplicaRequestBody);
    CreateReplicaRequestBody.initialize(this);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  return _createClass(CreateReplicaRequestBody, null, [{
    key: "initialize",
    value: function initialize(obj) {}

    /**
     * Constructs a <code>CreateReplicaRequestBody</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/CreateReplicaRequestBody} obj Optional instance to populate.
     * @return {module:model/CreateReplicaRequestBody} The populated <code>CreateReplicaRequestBody</code> instance.
     */
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new CreateReplicaRequestBody();
        if (data.hasOwnProperty('name')) {
          obj['name'] = _ApiClient["default"].convertToType(data['name'], 'String');
        }
        if (data.hasOwnProperty('type')) {
          obj['type'] = _ApiClient["default"].convertToType(data['type'], 'String');
        }
        if (data.hasOwnProperty('instanceDir')) {
          obj['instanceDir'] = _ApiClient["default"].convertToType(data['instanceDir'], 'String');
        }
        if (data.hasOwnProperty('dataDir')) {
          obj['dataDir'] = _ApiClient["default"].convertToType(data['dataDir'], 'String');
        }
        if (data.hasOwnProperty('ulogDir')) {
          obj['ulogDir'] = _ApiClient["default"].convertToType(data['ulogDir'], 'String');
        }
        if (data.hasOwnProperty('route')) {
          obj['route'] = _ApiClient["default"].convertToType(data['route'], 'String');
        }
        if (data.hasOwnProperty('nrtReplicas')) {
          obj['nrtReplicas'] = _ApiClient["default"].convertToType(data['nrtReplicas'], 'Number');
        }
        if (data.hasOwnProperty('tlogReplicas')) {
          obj['tlogReplicas'] = _ApiClient["default"].convertToType(data['tlogReplicas'], 'Number');
        }
        if (data.hasOwnProperty('pullReplicas')) {
          obj['pullReplicas'] = _ApiClient["default"].convertToType(data['pullReplicas'], 'Number');
        }
        if (data.hasOwnProperty('waitForFinalState')) {
          obj['waitForFinalState'] = _ApiClient["default"].convertToType(data['waitForFinalState'], 'Boolean');
        }
        if (data.hasOwnProperty('followAliases')) {
          obj['followAliases'] = _ApiClient["default"].convertToType(data['followAliases'], 'Boolean');
        }
        if (data.hasOwnProperty('async')) {
          obj['async'] = _ApiClient["default"].convertToType(data['async'], 'String');
        }
        if (data.hasOwnProperty('node')) {
          obj['node'] = _ApiClient["default"].convertToType(data['node'], 'String');
        }
        if (data.hasOwnProperty('skipNodeAssignment')) {
          obj['skipNodeAssignment'] = _ApiClient["default"].convertToType(data['skipNodeAssignment'], 'Boolean');
        }
        if (data.hasOwnProperty('properties')) {
          obj['properties'] = _ApiClient["default"].convertToType(data['properties'], {
            'String': 'String'
          });
        }
        if (data.hasOwnProperty('nodeSet')) {
          obj['nodeSet'] = _ApiClient["default"].convertToType(data['nodeSet'], ['String']);
        }
      }
      return obj;
    }
  }]);
}();
/**
 * @member {String} name
 */
CreateReplicaRequestBody.prototype['name'] = undefined;

/**
 * @member {String} type
 */
CreateReplicaRequestBody.prototype['type'] = undefined;

/**
 * @member {String} instanceDir
 */
CreateReplicaRequestBody.prototype['instanceDir'] = undefined;

/**
 * @member {String} dataDir
 */
CreateReplicaRequestBody.prototype['dataDir'] = undefined;

/**
 * @member {String} ulogDir
 */
CreateReplicaRequestBody.prototype['ulogDir'] = undefined;

/**
 * @member {String} route
 */
CreateReplicaRequestBody.prototype['route'] = undefined;

/**
 * @member {Number} nrtReplicas
 */
CreateReplicaRequestBody.prototype['nrtReplicas'] = undefined;

/**
 * @member {Number} tlogReplicas
 */
CreateReplicaRequestBody.prototype['tlogReplicas'] = undefined;

/**
 * @member {Number} pullReplicas
 */
CreateReplicaRequestBody.prototype['pullReplicas'] = undefined;

/**
 * @member {Boolean} waitForFinalState
 */
CreateReplicaRequestBody.prototype['waitForFinalState'] = undefined;

/**
 * @member {Boolean} followAliases
 */
CreateReplicaRequestBody.prototype['followAliases'] = undefined;

/**
 * @member {String} async
 */
CreateReplicaRequestBody.prototype['async'] = undefined;

/**
 * @member {String} node
 */
CreateReplicaRequestBody.prototype['node'] = undefined;

/**
 * @member {Boolean} skipNodeAssignment
 */
CreateReplicaRequestBody.prototype['skipNodeAssignment'] = undefined;

/**
 * @member {Object.<String, String>} properties
 */
CreateReplicaRequestBody.prototype['properties'] = undefined;

/**
 * @member {Array.<String>} nodeSet
 */
CreateReplicaRequestBody.prototype['nodeSet'] = undefined;
var _default = exports["default"] = CreateReplicaRequestBody;
},{"../ApiClient":8}],41:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
 * The CreateShardRequestBody model module.
 * @module model/CreateShardRequestBody
 * @version 9.6.0
 */
var CreateShardRequestBody = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>CreateShardRequestBody</code>.
   * @alias module:model/CreateShardRequestBody
   */
  function CreateShardRequestBody() {
    _classCallCheck(this, CreateShardRequestBody);
    CreateShardRequestBody.initialize(this);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  return _createClass(CreateShardRequestBody, null, [{
    key: "initialize",
    value: function initialize(obj) {}

    /**
     * Constructs a <code>CreateShardRequestBody</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/CreateShardRequestBody} obj Optional instance to populate.
     * @return {module:model/CreateShardRequestBody} The populated <code>CreateShardRequestBody</code> instance.
     */
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new CreateShardRequestBody();
        if (data.hasOwnProperty('replicationFactor')) {
          obj['replicationFactor'] = _ApiClient["default"].convertToType(data['replicationFactor'], 'Number');
        }
        if (data.hasOwnProperty('nrtReplicas')) {
          obj['nrtReplicas'] = _ApiClient["default"].convertToType(data['nrtReplicas'], 'Number');
        }
        if (data.hasOwnProperty('tlogReplicas')) {
          obj['tlogReplicas'] = _ApiClient["default"].convertToType(data['tlogReplicas'], 'Number');
        }
        if (data.hasOwnProperty('pullReplicas')) {
          obj['pullReplicas'] = _ApiClient["default"].convertToType(data['pullReplicas'], 'Number');
        }
        if (data.hasOwnProperty('waitForFinalState')) {
          obj['waitForFinalState'] = _ApiClient["default"].convertToType(data['waitForFinalState'], 'Boolean');
        }
        if (data.hasOwnProperty('followAliases')) {
          obj['followAliases'] = _ApiClient["default"].convertToType(data['followAliases'], 'Boolean');
        }
        if (data.hasOwnProperty('async')) {
          obj['async'] = _ApiClient["default"].convertToType(data['async'], 'String');
        }
        if (data.hasOwnProperty('properties')) {
          obj['properties'] = _ApiClient["default"].convertToType(data['properties'], {
            'String': 'String'
          });
        }
        if (data.hasOwnProperty('shardName')) {
          obj['shardName'] = _ApiClient["default"].convertToType(data['shardName'], 'String');
        }
        if (data.hasOwnProperty('createReplicas')) {
          obj['createReplicas'] = _ApiClient["default"].convertToType(data['createReplicas'], 'Boolean');
        }
        if (data.hasOwnProperty('nodeSet')) {
          obj['nodeSet'] = _ApiClient["default"].convertToType(data['nodeSet'], ['String']);
        }
      }
      return obj;
    }
  }]);
}();
/**
 * @member {Number} replicationFactor
 */
CreateShardRequestBody.prototype['replicationFactor'] = undefined;

/**
 * @member {Number} nrtReplicas
 */
CreateShardRequestBody.prototype['nrtReplicas'] = undefined;

/**
 * @member {Number} tlogReplicas
 */
CreateShardRequestBody.prototype['tlogReplicas'] = undefined;

/**
 * @member {Number} pullReplicas
 */
CreateShardRequestBody.prototype['pullReplicas'] = undefined;

/**
 * @member {Boolean} waitForFinalState
 */
CreateShardRequestBody.prototype['waitForFinalState'] = undefined;

/**
 * @member {Boolean} followAliases
 */
CreateShardRequestBody.prototype['followAliases'] = undefined;

/**
 * @member {String} async
 */
CreateShardRequestBody.prototype['async'] = undefined;

/**
 * @member {Object.<String, String>} properties
 */
CreateShardRequestBody.prototype['properties'] = undefined;

/**
 * @member {String} shardName
 */
CreateShardRequestBody.prototype['shardName'] = undefined;

/**
 * @member {Boolean} createReplicas
 */
CreateShardRequestBody.prototype['createReplicas'] = undefined;

/**
 * @member {Array.<String>} nodeSet
 */
CreateShardRequestBody.prototype['nodeSet'] = undefined;
var _default = exports["default"] = CreateShardRequestBody;
},{"../ApiClient":8}],42:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
var _ErrorInfo = _interopRequireDefault(require("./ErrorInfo"));
var _ResponseHeader = _interopRequireDefault(require("./ResponseHeader"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
 * The DeleteCollectionSnapshotResponse model module.
 * @module model/DeleteCollectionSnapshotResponse
 * @version 9.6.0
 */
var DeleteCollectionSnapshotResponse = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>DeleteCollectionSnapshotResponse</code>.
   * @alias module:model/DeleteCollectionSnapshotResponse
   */
  function DeleteCollectionSnapshotResponse() {
    _classCallCheck(this, DeleteCollectionSnapshotResponse);
    DeleteCollectionSnapshotResponse.initialize(this);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  return _createClass(DeleteCollectionSnapshotResponse, null, [{
    key: "initialize",
    value: function initialize(obj) {}

    /**
     * Constructs a <code>DeleteCollectionSnapshotResponse</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/DeleteCollectionSnapshotResponse} obj Optional instance to populate.
     * @return {module:model/DeleteCollectionSnapshotResponse} The populated <code>DeleteCollectionSnapshotResponse</code> instance.
     */
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new DeleteCollectionSnapshotResponse();
        if (data.hasOwnProperty('responseHeader')) {
          obj['responseHeader'] = _ResponseHeader["default"].constructFromObject(data['responseHeader']);
        }
        if (data.hasOwnProperty('error')) {
          obj['error'] = _ErrorInfo["default"].constructFromObject(data['error']);
        }
        if (data.hasOwnProperty('requestid')) {
          obj['requestid'] = _ApiClient["default"].convertToType(data['requestid'], 'String');
        }
        if (data.hasOwnProperty('collection')) {
          obj['collection'] = _ApiClient["default"].convertToType(data['collection'], 'String');
        }
        if (data.hasOwnProperty('snapshot')) {
          obj['snapshot'] = _ApiClient["default"].convertToType(data['snapshot'], 'String');
        }
        if (data.hasOwnProperty('followAliases')) {
          obj['followAliases'] = _ApiClient["default"].convertToType(data['followAliases'], 'Boolean');
        }
      }
      return obj;
    }
  }]);
}();
/**
 * @member {module:model/ResponseHeader} responseHeader
 */
DeleteCollectionSnapshotResponse.prototype['responseHeader'] = undefined;

/**
 * @member {module:model/ErrorInfo} error
 */
DeleteCollectionSnapshotResponse.prototype['error'] = undefined;

/**
 * @member {String} requestid
 */
DeleteCollectionSnapshotResponse.prototype['requestid'] = undefined;

/**
 * The name of the collection.
 * @member {String} collection
 */
DeleteCollectionSnapshotResponse.prototype['collection'] = undefined;

/**
 * The name of the snapshot to be deleted.
 * @member {String} snapshot
 */
DeleteCollectionSnapshotResponse.prototype['snapshot'] = undefined;

/**
 * A flag that treats the collName parameter as a collection alias.
 * @member {Boolean} followAliases
 */
DeleteCollectionSnapshotResponse.prototype['followAliases'] = undefined;
var _default = exports["default"] = DeleteCollectionSnapshotResponse;
},{"../ApiClient":8,"./ErrorInfo":45,"./ResponseHeader":71}],43:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
 * The DeleteNodeRequestBody model module.
 * @module model/DeleteNodeRequestBody
 * @version 9.6.0
 */
var DeleteNodeRequestBody = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>DeleteNodeRequestBody</code>.
   * @alias module:model/DeleteNodeRequestBody
   */
  function DeleteNodeRequestBody() {
    _classCallCheck(this, DeleteNodeRequestBody);
    DeleteNodeRequestBody.initialize(this);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  return _createClass(DeleteNodeRequestBody, null, [{
    key: "initialize",
    value: function initialize(obj) {}

    /**
     * Constructs a <code>DeleteNodeRequestBody</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/DeleteNodeRequestBody} obj Optional instance to populate.
     * @return {module:model/DeleteNodeRequestBody} The populated <code>DeleteNodeRequestBody</code> instance.
     */
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new DeleteNodeRequestBody();
        if (data.hasOwnProperty('async')) {
          obj['async'] = _ApiClient["default"].convertToType(data['async'], 'String');
        }
      }
      return obj;
    }
  }]);
}();
/**
 * Request ID to track this action which will be processed asynchronously.
 * @member {String} async
 */
DeleteNodeRequestBody.prototype['async'] = undefined;
var _default = exports["default"] = DeleteNodeRequestBody;
},{"../ApiClient":8}],44:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
var _ErrorInfo = _interopRequireDefault(require("./ErrorInfo"));
var _ResponseHeader = _interopRequireDefault(require("./ResponseHeader"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
 * The DeleteSnapshotResponse model module.
 * @module model/DeleteSnapshotResponse
 * @version 9.6.0
 */
var DeleteSnapshotResponse = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>DeleteSnapshotResponse</code>.
   * @alias module:model/DeleteSnapshotResponse
   */
  function DeleteSnapshotResponse() {
    _classCallCheck(this, DeleteSnapshotResponse);
    DeleteSnapshotResponse.initialize(this);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  return _createClass(DeleteSnapshotResponse, null, [{
    key: "initialize",
    value: function initialize(obj) {}

    /**
     * Constructs a <code>DeleteSnapshotResponse</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/DeleteSnapshotResponse} obj Optional instance to populate.
     * @return {module:model/DeleteSnapshotResponse} The populated <code>DeleteSnapshotResponse</code> instance.
     */
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new DeleteSnapshotResponse();
        if (data.hasOwnProperty('responseHeader')) {
          obj['responseHeader'] = _ResponseHeader["default"].constructFromObject(data['responseHeader']);
        }
        if (data.hasOwnProperty('error')) {
          obj['error'] = _ErrorInfo["default"].constructFromObject(data['error']);
        }
        if (data.hasOwnProperty('coreName')) {
          obj['coreName'] = _ApiClient["default"].convertToType(data['coreName'], 'String');
        }
        if (data.hasOwnProperty('commitName')) {
          obj['commitName'] = _ApiClient["default"].convertToType(data['commitName'], 'String');
        }
      }
      return obj;
    }
  }]);
}();
/**
 * @member {module:model/ResponseHeader} responseHeader
 */
DeleteSnapshotResponse.prototype['responseHeader'] = undefined;

/**
 * @member {module:model/ErrorInfo} error
 */
DeleteSnapshotResponse.prototype['error'] = undefined;

/**
 * The name of the core.
 * @member {String} coreName
 */
DeleteSnapshotResponse.prototype['coreName'] = undefined;

/**
 * The name of the deleted snapshot.
 * @member {String} commitName
 */
DeleteSnapshotResponse.prototype['commitName'] = undefined;
var _default = exports["default"] = DeleteSnapshotResponse;
},{"../ApiClient":8,"./ErrorInfo":45,"./ResponseHeader":71}],45:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
var _ErrorMetadata = _interopRequireDefault(require("./ErrorMetadata"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
 * The ErrorInfo model module.
 * @module model/ErrorInfo
 * @version 9.6.0
 */
var ErrorInfo = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>ErrorInfo</code>.
   * @alias module:model/ErrorInfo
   */
  function ErrorInfo() {
    _classCallCheck(this, ErrorInfo);
    ErrorInfo.initialize(this);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  return _createClass(ErrorInfo, null, [{
    key: "initialize",
    value: function initialize(obj) {}

    /**
     * Constructs a <code>ErrorInfo</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/ErrorInfo} obj Optional instance to populate.
     * @return {module:model/ErrorInfo} The populated <code>ErrorInfo</code> instance.
     */
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new ErrorInfo();
        if (data.hasOwnProperty('metadata')) {
          obj['metadata'] = _ErrorMetadata["default"].constructFromObject(data['metadata']);
        }
        if (data.hasOwnProperty('details')) {
          obj['details'] = _ApiClient["default"].convertToType(data['details'], [{
            'String': Object
          }]);
        }
        if (data.hasOwnProperty('msg')) {
          obj['msg'] = _ApiClient["default"].convertToType(data['msg'], 'String');
        }
        if (data.hasOwnProperty('trace')) {
          obj['trace'] = _ApiClient["default"].convertToType(data['trace'], 'String');
        }
        if (data.hasOwnProperty('code')) {
          obj['code'] = _ApiClient["default"].convertToType(data['code'], 'Number');
        }
      }
      return obj;
    }
  }]);
}();
/**
 * @member {module:model/ErrorMetadata} metadata
 */
ErrorInfo.prototype['metadata'] = undefined;

/**
 * @member {Array.<Object.<String, Object>>} details
 */
ErrorInfo.prototype['details'] = undefined;

/**
 * @member {String} msg
 */
ErrorInfo.prototype['msg'] = undefined;

/**
 * @member {String} trace
 */
ErrorInfo.prototype['trace'] = undefined;

/**
 * @member {Number} code
 */
ErrorInfo.prototype['code'] = undefined;
var _default = exports["default"] = ErrorInfo;
},{"../ApiClient":8,"./ErrorMetadata":46}],46:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
 * The ErrorMetadata model module.
 * @module model/ErrorMetadata
 * @version 9.6.0
 */
var ErrorMetadata = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>ErrorMetadata</code>.
   * @alias module:model/ErrorMetadata
   */
  function ErrorMetadata() {
    _classCallCheck(this, ErrorMetadata);
    ErrorMetadata.initialize(this);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  return _createClass(ErrorMetadata, null, [{
    key: "initialize",
    value: function initialize(obj) {}

    /**
     * Constructs a <code>ErrorMetadata</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/ErrorMetadata} obj Optional instance to populate.
     * @return {module:model/ErrorMetadata} The populated <code>ErrorMetadata</code> instance.
     */
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new ErrorMetadata();
        if (data.hasOwnProperty('error-class')) {
          obj['error-class'] = _ApiClient["default"].convertToType(data['error-class'], 'String');
        }
        if (data.hasOwnProperty('root-error-class')) {
          obj['root-error-class'] = _ApiClient["default"].convertToType(data['root-error-class'], 'String');
        }
      }
      return obj;
    }
  }]);
}();
/**
 * @member {String} error-class
 */
ErrorMetadata.prototype['error-class'] = undefined;

/**
 * @member {String} root-error-class
 */
ErrorMetadata.prototype['root-error-class'] = undefined;
var _default = exports["default"] = ErrorMetadata;
},{"../ApiClient":8}],47:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
var _ErrorInfo = _interopRequireDefault(require("./ErrorInfo"));
var _ResponseHeader = _interopRequireDefault(require("./ResponseHeader"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
 * The FlexibleSolrJerseyResponse model module.
 * @module model/FlexibleSolrJerseyResponse
 * @version 9.6.0
 */
var FlexibleSolrJerseyResponse = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>FlexibleSolrJerseyResponse</code>.
   * @alias module:model/FlexibleSolrJerseyResponse
   */
  function FlexibleSolrJerseyResponse() {
    _classCallCheck(this, FlexibleSolrJerseyResponse);
    FlexibleSolrJerseyResponse.initialize(this);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  return _createClass(FlexibleSolrJerseyResponse, null, [{
    key: "initialize",
    value: function initialize(obj) {}

    /**
     * Constructs a <code>FlexibleSolrJerseyResponse</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/FlexibleSolrJerseyResponse} obj Optional instance to populate.
     * @return {module:model/FlexibleSolrJerseyResponse} The populated <code>FlexibleSolrJerseyResponse</code> instance.
     */
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new FlexibleSolrJerseyResponse();
        if (data.hasOwnProperty('responseHeader')) {
          obj['responseHeader'] = _ResponseHeader["default"].constructFromObject(data['responseHeader']);
        }
        if (data.hasOwnProperty('error')) {
          obj['error'] = _ErrorInfo["default"].constructFromObject(data['error']);
        }
      }
      return obj;
    }
  }]);
}();
/**
 * @member {module:model/ResponseHeader} responseHeader
 */
FlexibleSolrJerseyResponse.prototype['responseHeader'] = undefined;

/**
 * @member {module:model/ErrorInfo} error
 */
FlexibleSolrJerseyResponse.prototype['error'] = undefined;
var _default = exports["default"] = FlexibleSolrJerseyResponse;
},{"../ApiClient":8,"./ErrorInfo":45,"./ResponseHeader":71}],48:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
var _ErrorInfo = _interopRequireDefault(require("./ErrorInfo"));
var _ResponseHeader = _interopRequireDefault(require("./ResponseHeader"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
 * The GetAliasByNameResponse model module.
 * @module model/GetAliasByNameResponse
 * @version 9.6.0
 */
var GetAliasByNameResponse = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>GetAliasByNameResponse</code>.
   * @alias module:model/GetAliasByNameResponse
   */
  function GetAliasByNameResponse() {
    _classCallCheck(this, GetAliasByNameResponse);
    GetAliasByNameResponse.initialize(this);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  return _createClass(GetAliasByNameResponse, null, [{
    key: "initialize",
    value: function initialize(obj) {}

    /**
     * Constructs a <code>GetAliasByNameResponse</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/GetAliasByNameResponse} obj Optional instance to populate.
     * @return {module:model/GetAliasByNameResponse} The populated <code>GetAliasByNameResponse</code> instance.
     */
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new GetAliasByNameResponse();
        if (data.hasOwnProperty('responseHeader')) {
          obj['responseHeader'] = _ResponseHeader["default"].constructFromObject(data['responseHeader']);
        }
        if (data.hasOwnProperty('error')) {
          obj['error'] = _ErrorInfo["default"].constructFromObject(data['error']);
        }
        if (data.hasOwnProperty('name')) {
          obj['name'] = _ApiClient["default"].convertToType(data['name'], 'String');
        }
        if (data.hasOwnProperty('collections')) {
          obj['collections'] = _ApiClient["default"].convertToType(data['collections'], ['String']);
        }
        if (data.hasOwnProperty('properties')) {
          obj['properties'] = _ApiClient["default"].convertToType(data['properties'], {
            'String': 'String'
          });
        }
      }
      return obj;
    }
  }]);
}();
/**
 * @member {module:model/ResponseHeader} responseHeader
 */
GetAliasByNameResponse.prototype['responseHeader'] = undefined;

/**
 * @member {module:model/ErrorInfo} error
 */
GetAliasByNameResponse.prototype['error'] = undefined;

/**
 * @member {String} name
 */
GetAliasByNameResponse.prototype['name'] = undefined;

/**
 * @member {Array.<String>} collections
 */
GetAliasByNameResponse.prototype['collections'] = undefined;

/**
 * @member {Object.<String, String>} properties
 */
GetAliasByNameResponse.prototype['properties'] = undefined;
var _default = exports["default"] = GetAliasByNameResponse;
},{"../ApiClient":8,"./ErrorInfo":45,"./ResponseHeader":71}],49:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
var _ErrorInfo = _interopRequireDefault(require("./ErrorInfo"));
var _ResponseHeader = _interopRequireDefault(require("./ResponseHeader"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
 * The GetAliasPropertyResponse model module.
 * @module model/GetAliasPropertyResponse
 * @version 9.6.0
 */
var GetAliasPropertyResponse = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>GetAliasPropertyResponse</code>.
   * @alias module:model/GetAliasPropertyResponse
   */
  function GetAliasPropertyResponse() {
    _classCallCheck(this, GetAliasPropertyResponse);
    GetAliasPropertyResponse.initialize(this);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  return _createClass(GetAliasPropertyResponse, null, [{
    key: "initialize",
    value: function initialize(obj) {}

    /**
     * Constructs a <code>GetAliasPropertyResponse</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/GetAliasPropertyResponse} obj Optional instance to populate.
     * @return {module:model/GetAliasPropertyResponse} The populated <code>GetAliasPropertyResponse</code> instance.
     */
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new GetAliasPropertyResponse();
        if (data.hasOwnProperty('responseHeader')) {
          obj['responseHeader'] = _ResponseHeader["default"].constructFromObject(data['responseHeader']);
        }
        if (data.hasOwnProperty('error')) {
          obj['error'] = _ErrorInfo["default"].constructFromObject(data['error']);
        }
        if (data.hasOwnProperty('value')) {
          obj['value'] = _ApiClient["default"].convertToType(data['value'], 'String');
        }
      }
      return obj;
    }
  }]);
}();
/**
 * @member {module:model/ResponseHeader} responseHeader
 */
GetAliasPropertyResponse.prototype['responseHeader'] = undefined;

/**
 * @member {module:model/ErrorInfo} error
 */
GetAliasPropertyResponse.prototype['error'] = undefined;

/**
 * Property value.
 * @member {String} value
 */
GetAliasPropertyResponse.prototype['value'] = undefined;
var _default = exports["default"] = GetAliasPropertyResponse;
},{"../ApiClient":8,"./ErrorInfo":45,"./ResponseHeader":71}],50:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
var _ErrorInfo = _interopRequireDefault(require("./ErrorInfo"));
var _ResponseHeader = _interopRequireDefault(require("./ResponseHeader"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
 * The GetAllAliasPropertiesResponse model module.
 * @module model/GetAllAliasPropertiesResponse
 * @version 9.6.0
 */
var GetAllAliasPropertiesResponse = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>GetAllAliasPropertiesResponse</code>.
   * @alias module:model/GetAllAliasPropertiesResponse
   */
  function GetAllAliasPropertiesResponse() {
    _classCallCheck(this, GetAllAliasPropertiesResponse);
    GetAllAliasPropertiesResponse.initialize(this);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  return _createClass(GetAllAliasPropertiesResponse, null, [{
    key: "initialize",
    value: function initialize(obj) {}

    /**
     * Constructs a <code>GetAllAliasPropertiesResponse</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/GetAllAliasPropertiesResponse} obj Optional instance to populate.
     * @return {module:model/GetAllAliasPropertiesResponse} The populated <code>GetAllAliasPropertiesResponse</code> instance.
     */
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new GetAllAliasPropertiesResponse();
        if (data.hasOwnProperty('responseHeader')) {
          obj['responseHeader'] = _ResponseHeader["default"].constructFromObject(data['responseHeader']);
        }
        if (data.hasOwnProperty('error')) {
          obj['error'] = _ErrorInfo["default"].constructFromObject(data['error']);
        }
        if (data.hasOwnProperty('properties')) {
          obj['properties'] = _ApiClient["default"].convertToType(data['properties'], {
            'String': 'String'
          });
        }
      }
      return obj;
    }
  }]);
}();
/**
 * @member {module:model/ResponseHeader} responseHeader
 */
GetAllAliasPropertiesResponse.prototype['responseHeader'] = undefined;

/**
 * @member {module:model/ErrorInfo} error
 */
GetAllAliasPropertiesResponse.prototype['error'] = undefined;

/**
 * Properties and values associated with alias.
 * @member {Object.<String, String>} properties
 */
GetAllAliasPropertiesResponse.prototype['properties'] = undefined;
var _default = exports["default"] = GetAllAliasPropertiesResponse;
},{"../ApiClient":8,"./ErrorInfo":45,"./ResponseHeader":71}],51:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
var _ErrorInfo = _interopRequireDefault(require("./ErrorInfo"));
var _ResponseHeader = _interopRequireDefault(require("./ResponseHeader"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
 * The GetNodeCommandStatusResponse model module.
 * @module model/GetNodeCommandStatusResponse
 * @version 9.6.0
 */
var GetNodeCommandStatusResponse = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>GetNodeCommandStatusResponse</code>.
   * @alias module:model/GetNodeCommandStatusResponse
   */
  function GetNodeCommandStatusResponse() {
    _classCallCheck(this, GetNodeCommandStatusResponse);
    GetNodeCommandStatusResponse.initialize(this);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  return _createClass(GetNodeCommandStatusResponse, null, [{
    key: "initialize",
    value: function initialize(obj) {}

    /**
     * Constructs a <code>GetNodeCommandStatusResponse</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/GetNodeCommandStatusResponse} obj Optional instance to populate.
     * @return {module:model/GetNodeCommandStatusResponse} The populated <code>GetNodeCommandStatusResponse</code> instance.
     */
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new GetNodeCommandStatusResponse();
        if (data.hasOwnProperty('msg')) {
          obj['msg'] = _ApiClient["default"].convertToType(data['msg'], 'String');
        }
        if (data.hasOwnProperty('response')) {
          obj['response'] = _ApiClient["default"].convertToType(data['response'], Object);
        }
        if (data.hasOwnProperty('responseHeader')) {
          obj['responseHeader'] = _ResponseHeader["default"].constructFromObject(data['responseHeader']);
        }
        if (data.hasOwnProperty('error')) {
          obj['error'] = _ErrorInfo["default"].constructFromObject(data['error']);
        }
        if (data.hasOwnProperty('STATUS')) {
          obj['STATUS'] = _ApiClient["default"].convertToType(data['STATUS'], 'String');
        }
      }
      return obj;
    }
  }]);
}();
/**
 * @member {String} msg
 */
GetNodeCommandStatusResponse.prototype['msg'] = undefined;

/**
 * @member {Object} response
 */
GetNodeCommandStatusResponse.prototype['response'] = undefined;

/**
 * @member {module:model/ResponseHeader} responseHeader
 */
GetNodeCommandStatusResponse.prototype['responseHeader'] = undefined;

/**
 * @member {module:model/ErrorInfo} error
 */
GetNodeCommandStatusResponse.prototype['error'] = undefined;

/**
 * @member {String} STATUS
 */
GetNodeCommandStatusResponse.prototype['STATUS'] = undefined;
var _default = exports["default"] = GetNodeCommandStatusResponse;
},{"../ApiClient":8,"./ErrorInfo":45,"./ResponseHeader":71}],52:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
* Enum class IndexType.
* @enum {}
* @readonly
*/
var IndexType = exports["default"] = /*#__PURE__*/function () {
  function IndexType() {
    _classCallCheck(this, IndexType);
    /**
     * value: "collections"
     * @const
     */
    _defineProperty(this, "collections", "collections");
    /**
     * value: "cores"
     * @const
     */
    _defineProperty(this, "cores", "cores");
  }
  return _createClass(IndexType, null, [{
    key: "constructFromObject",
    value:
    /**
    * Returns a <code>IndexType</code> enum value from a Javascript object name.
    * @param {Object} data The plain JavaScript object containing the name of the enum value.
    * @return {module:model/IndexType} The enum <code>IndexType</code> value.
    */
    function constructFromObject(object) {
      return object;
    }
  }]);
}();
},{"../ApiClient":8}],53:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
 * The InstallCoreDataRequestBody model module.
 * @module model/InstallCoreDataRequestBody
 * @version 9.6.0
 */
var InstallCoreDataRequestBody = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>InstallCoreDataRequestBody</code>.
   * @alias module:model/InstallCoreDataRequestBody
   */
  function InstallCoreDataRequestBody() {
    _classCallCheck(this, InstallCoreDataRequestBody);
    InstallCoreDataRequestBody.initialize(this);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  return _createClass(InstallCoreDataRequestBody, null, [{
    key: "initialize",
    value: function initialize(obj) {}

    /**
     * Constructs a <code>InstallCoreDataRequestBody</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/InstallCoreDataRequestBody} obj Optional instance to populate.
     * @return {module:model/InstallCoreDataRequestBody} The populated <code>InstallCoreDataRequestBody</code> instance.
     */
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new InstallCoreDataRequestBody();
        if (data.hasOwnProperty('location')) {
          obj['location'] = _ApiClient["default"].convertToType(data['location'], 'String');
        }
        if (data.hasOwnProperty('repository')) {
          obj['repository'] = _ApiClient["default"].convertToType(data['repository'], 'String');
        }
        if (data.hasOwnProperty('asyncId')) {
          obj['asyncId'] = _ApiClient["default"].convertToType(data['asyncId'], 'String');
        }
      }
      return obj;
    }
  }]);
}();
/**
 * @member {String} location
 */
InstallCoreDataRequestBody.prototype['location'] = undefined;

/**
 * @member {String} repository
 */
InstallCoreDataRequestBody.prototype['repository'] = undefined;

/**
 * @member {String} asyncId
 */
InstallCoreDataRequestBody.prototype['asyncId'] = undefined;
var _default = exports["default"] = InstallCoreDataRequestBody;
},{"../ApiClient":8}],54:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
 * The InstallShardDataRequestBody model module.
 * @module model/InstallShardDataRequestBody
 * @version 9.6.0
 */
var InstallShardDataRequestBody = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>InstallShardDataRequestBody</code>.
   * @alias module:model/InstallShardDataRequestBody
   * @param location {String} 
   */
  function InstallShardDataRequestBody(location) {
    _classCallCheck(this, InstallShardDataRequestBody);
    InstallShardDataRequestBody.initialize(this, location);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  return _createClass(InstallShardDataRequestBody, null, [{
    key: "initialize",
    value: function initialize(obj, location) {
      obj['location'] = location;
    }

    /**
     * Constructs a <code>InstallShardDataRequestBody</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/InstallShardDataRequestBody} obj Optional instance to populate.
     * @return {module:model/InstallShardDataRequestBody} The populated <code>InstallShardDataRequestBody</code> instance.
     */
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new InstallShardDataRequestBody();
        if (data.hasOwnProperty('repository')) {
          obj['repository'] = _ApiClient["default"].convertToType(data['repository'], 'String');
        }
        if (data.hasOwnProperty('async')) {
          obj['async'] = _ApiClient["default"].convertToType(data['async'], 'String');
        }
        if (data.hasOwnProperty('location')) {
          obj['location'] = _ApiClient["default"].convertToType(data['location'], 'String');
        }
      }
      return obj;
    }
  }]);
}();
/**
 * @member {String} repository
 */
InstallShardDataRequestBody.prototype['repository'] = undefined;

/**
 * @member {String} async
 */
InstallShardDataRequestBody.prototype['async'] = undefined;

/**
 * @member {String} location
 */
InstallShardDataRequestBody.prototype['location'] = undefined;
var _default = exports["default"] = InstallShardDataRequestBody;
},{"../ApiClient":8}],55:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
var _ErrorInfo = _interopRequireDefault(require("./ErrorInfo"));
var _ResponseHeader = _interopRequireDefault(require("./ResponseHeader"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
 * The ListAliasesResponse model module.
 * @module model/ListAliasesResponse
 * @version 9.6.0
 */
var ListAliasesResponse = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>ListAliasesResponse</code>.
   * @alias module:model/ListAliasesResponse
   */
  function ListAliasesResponse() {
    _classCallCheck(this, ListAliasesResponse);
    ListAliasesResponse.initialize(this);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  return _createClass(ListAliasesResponse, null, [{
    key: "initialize",
    value: function initialize(obj) {}

    /**
     * Constructs a <code>ListAliasesResponse</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/ListAliasesResponse} obj Optional instance to populate.
     * @return {module:model/ListAliasesResponse} The populated <code>ListAliasesResponse</code> instance.
     */
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new ListAliasesResponse();
        if (data.hasOwnProperty('responseHeader')) {
          obj['responseHeader'] = _ResponseHeader["default"].constructFromObject(data['responseHeader']);
        }
        if (data.hasOwnProperty('error')) {
          obj['error'] = _ErrorInfo["default"].constructFromObject(data['error']);
        }
        if (data.hasOwnProperty('aliases')) {
          obj['aliases'] = _ApiClient["default"].convertToType(data['aliases'], {
            'String': 'String'
          });
        }
        if (data.hasOwnProperty('properties')) {
          obj['properties'] = _ApiClient["default"].convertToType(data['properties'], {
            'String': {
              'String': 'String'
            }
          });
        }
      }
      return obj;
    }
  }]);
}();
/**
 * @member {module:model/ResponseHeader} responseHeader
 */
ListAliasesResponse.prototype['responseHeader'] = undefined;

/**
 * @member {module:model/ErrorInfo} error
 */
ListAliasesResponse.prototype['error'] = undefined;

/**
 * @member {Object.<String, String>} aliases
 */
ListAliasesResponse.prototype['aliases'] = undefined;

/**
 * @member {Object.<String, Object.<String, String>>} properties
 */
ListAliasesResponse.prototype['properties'] = undefined;
var _default = exports["default"] = ListAliasesResponse;
},{"../ApiClient":8,"./ErrorInfo":45,"./ResponseHeader":71}],56:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
var _CollectionBackupDetails = _interopRequireDefault(require("./CollectionBackupDetails"));
var _ErrorInfo = _interopRequireDefault(require("./ErrorInfo"));
var _ResponseHeader = _interopRequireDefault(require("./ResponseHeader"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
 * The ListCollectionBackupsResponse model module.
 * @module model/ListCollectionBackupsResponse
 * @version 9.6.0
 */
var ListCollectionBackupsResponse = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>ListCollectionBackupsResponse</code>.
   * @alias module:model/ListCollectionBackupsResponse
   */
  function ListCollectionBackupsResponse() {
    _classCallCheck(this, ListCollectionBackupsResponse);
    ListCollectionBackupsResponse.initialize(this);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  return _createClass(ListCollectionBackupsResponse, null, [{
    key: "initialize",
    value: function initialize(obj) {}

    /**
     * Constructs a <code>ListCollectionBackupsResponse</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/ListCollectionBackupsResponse} obj Optional instance to populate.
     * @return {module:model/ListCollectionBackupsResponse} The populated <code>ListCollectionBackupsResponse</code> instance.
     */
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new ListCollectionBackupsResponse();
        if (data.hasOwnProperty('collection')) {
          obj['collection'] = _ApiClient["default"].convertToType(data['collection'], 'String');
        }
        if (data.hasOwnProperty('backups')) {
          obj['backups'] = _ApiClient["default"].convertToType(data['backups'], [_CollectionBackupDetails["default"]]);
        }
        if (data.hasOwnProperty('responseHeader')) {
          obj['responseHeader'] = _ResponseHeader["default"].constructFromObject(data['responseHeader']);
        }
        if (data.hasOwnProperty('error')) {
          obj['error'] = _ErrorInfo["default"].constructFromObject(data['error']);
        }
      }
      return obj;
    }
  }]);
}();
/**
 * @member {String} collection
 */
ListCollectionBackupsResponse.prototype['collection'] = undefined;

/**
 * @member {Array.<module:model/CollectionBackupDetails>} backups
 */
ListCollectionBackupsResponse.prototype['backups'] = undefined;

/**
 * @member {module:model/ResponseHeader} responseHeader
 */
ListCollectionBackupsResponse.prototype['responseHeader'] = undefined;

/**
 * @member {module:model/ErrorInfo} error
 */
ListCollectionBackupsResponse.prototype['error'] = undefined;
var _default = exports["default"] = ListCollectionBackupsResponse;
},{"../ApiClient":8,"./CollectionBackupDetails":32,"./ErrorInfo":45,"./ResponseHeader":71}],57:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
var _ErrorInfo = _interopRequireDefault(require("./ErrorInfo"));
var _ResponseHeader = _interopRequireDefault(require("./ResponseHeader"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
 * The ListCollectionsResponse model module.
 * @module model/ListCollectionsResponse
 * @version 9.6.0
 */
var ListCollectionsResponse = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>ListCollectionsResponse</code>.
   * @alias module:model/ListCollectionsResponse
   */
  function ListCollectionsResponse() {
    _classCallCheck(this, ListCollectionsResponse);
    ListCollectionsResponse.initialize(this);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  return _createClass(ListCollectionsResponse, null, [{
    key: "initialize",
    value: function initialize(obj) {}

    /**
     * Constructs a <code>ListCollectionsResponse</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/ListCollectionsResponse} obj Optional instance to populate.
     * @return {module:model/ListCollectionsResponse} The populated <code>ListCollectionsResponse</code> instance.
     */
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new ListCollectionsResponse();
        if (data.hasOwnProperty('responseHeader')) {
          obj['responseHeader'] = _ResponseHeader["default"].constructFromObject(data['responseHeader']);
        }
        if (data.hasOwnProperty('error')) {
          obj['error'] = _ErrorInfo["default"].constructFromObject(data['error']);
        }
        if (data.hasOwnProperty('collections')) {
          obj['collections'] = _ApiClient["default"].convertToType(data['collections'], ['String']);
        }
      }
      return obj;
    }
  }]);
}();
/**
 * @member {module:model/ResponseHeader} responseHeader
 */
ListCollectionsResponse.prototype['responseHeader'] = undefined;

/**
 * @member {module:model/ErrorInfo} error
 */
ListCollectionsResponse.prototype['error'] = undefined;

/**
 * @member {Array.<String>} collections
 */
ListCollectionsResponse.prototype['collections'] = undefined;
var _default = exports["default"] = ListCollectionsResponse;
},{"../ApiClient":8,"./ErrorInfo":45,"./ResponseHeader":71}],58:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
var _ErrorInfo = _interopRequireDefault(require("./ErrorInfo"));
var _ResponseHeader = _interopRequireDefault(require("./ResponseHeader"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
 * The ListConfigsetsResponse model module.
 * @module model/ListConfigsetsResponse
 * @version 9.6.0
 */
var ListConfigsetsResponse = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>ListConfigsetsResponse</code>.
   * @alias module:model/ListConfigsetsResponse
   */
  function ListConfigsetsResponse() {
    _classCallCheck(this, ListConfigsetsResponse);
    ListConfigsetsResponse.initialize(this);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  return _createClass(ListConfigsetsResponse, null, [{
    key: "initialize",
    value: function initialize(obj) {}

    /**
     * Constructs a <code>ListConfigsetsResponse</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/ListConfigsetsResponse} obj Optional instance to populate.
     * @return {module:model/ListConfigsetsResponse} The populated <code>ListConfigsetsResponse</code> instance.
     */
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new ListConfigsetsResponse();
        if (data.hasOwnProperty('responseHeader')) {
          obj['responseHeader'] = _ResponseHeader["default"].constructFromObject(data['responseHeader']);
        }
        if (data.hasOwnProperty('error')) {
          obj['error'] = _ErrorInfo["default"].constructFromObject(data['error']);
        }
        if (data.hasOwnProperty('configSets')) {
          obj['configSets'] = _ApiClient["default"].convertToType(data['configSets'], ['String']);
        }
      }
      return obj;
    }
  }]);
}();
/**
 * @member {module:model/ResponseHeader} responseHeader
 */
ListConfigsetsResponse.prototype['responseHeader'] = undefined;

/**
 * @member {module:model/ErrorInfo} error
 */
ListConfigsetsResponse.prototype['error'] = undefined;

/**
 * @member {Array.<String>} configSets
 */
ListConfigsetsResponse.prototype['configSets'] = undefined;
var _default = exports["default"] = ListConfigsetsResponse;
},{"../ApiClient":8,"./ErrorInfo":45,"./ResponseHeader":71}],59:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
var _ErrorInfo = _interopRequireDefault(require("./ErrorInfo"));
var _ResponseHeader = _interopRequireDefault(require("./ResponseHeader"));
var _SnapshotInformation = _interopRequireDefault(require("./SnapshotInformation"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
 * The ListCoreSnapshotsResponse model module.
 * @module model/ListCoreSnapshotsResponse
 * @version 9.6.0
 */
var ListCoreSnapshotsResponse = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>ListCoreSnapshotsResponse</code>.
   * @alias module:model/ListCoreSnapshotsResponse
   */
  function ListCoreSnapshotsResponse() {
    _classCallCheck(this, ListCoreSnapshotsResponse);
    ListCoreSnapshotsResponse.initialize(this);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  return _createClass(ListCoreSnapshotsResponse, null, [{
    key: "initialize",
    value: function initialize(obj) {}

    /**
     * Constructs a <code>ListCoreSnapshotsResponse</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/ListCoreSnapshotsResponse} obj Optional instance to populate.
     * @return {module:model/ListCoreSnapshotsResponse} The populated <code>ListCoreSnapshotsResponse</code> instance.
     */
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new ListCoreSnapshotsResponse();
        if (data.hasOwnProperty('snapshots')) {
          obj['snapshots'] = _ApiClient["default"].convertToType(data['snapshots'], {
            'String': _SnapshotInformation["default"]
          });
        }
        if (data.hasOwnProperty('responseHeader')) {
          obj['responseHeader'] = _ResponseHeader["default"].constructFromObject(data['responseHeader']);
        }
        if (data.hasOwnProperty('error')) {
          obj['error'] = _ErrorInfo["default"].constructFromObject(data['error']);
        }
      }
      return obj;
    }
  }]);
}();
/**
 * The collection of snapshots found for the requested core.
 * @member {Object.<String, module:model/SnapshotInformation>} snapshots
 */
ListCoreSnapshotsResponse.prototype['snapshots'] = undefined;

/**
 * @member {module:model/ResponseHeader} responseHeader
 */
ListCoreSnapshotsResponse.prototype['responseHeader'] = undefined;

/**
 * @member {module:model/ErrorInfo} error
 */
ListCoreSnapshotsResponse.prototype['error'] = undefined;
var _default = exports["default"] = ListCoreSnapshotsResponse;
},{"../ApiClient":8,"./ErrorInfo":45,"./ResponseHeader":71,"./SnapshotInformation":80}],60:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
 * The MergeIndexesRequestBody model module.
 * @module model/MergeIndexesRequestBody
 * @version 9.6.0
 */
var MergeIndexesRequestBody = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>MergeIndexesRequestBody</code>.
   * @alias module:model/MergeIndexesRequestBody
   */
  function MergeIndexesRequestBody() {
    _classCallCheck(this, MergeIndexesRequestBody);
    MergeIndexesRequestBody.initialize(this);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  return _createClass(MergeIndexesRequestBody, null, [{
    key: "initialize",
    value: function initialize(obj) {}

    /**
     * Constructs a <code>MergeIndexesRequestBody</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/MergeIndexesRequestBody} obj Optional instance to populate.
     * @return {module:model/MergeIndexesRequestBody} The populated <code>MergeIndexesRequestBody</code> instance.
     */
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new MergeIndexesRequestBody();
        if (data.hasOwnProperty('indexDirs')) {
          obj['indexDirs'] = _ApiClient["default"].convertToType(data['indexDirs'], ['String']);
        }
        if (data.hasOwnProperty('srcCores')) {
          obj['srcCores'] = _ApiClient["default"].convertToType(data['srcCores'], ['String']);
        }
        if (data.hasOwnProperty('async')) {
          obj['async'] = _ApiClient["default"].convertToType(data['async'], 'String');
        }
        if (data.hasOwnProperty('updateChain')) {
          obj['updateChain'] = _ApiClient["default"].convertToType(data['updateChain'], 'String');
        }
      }
      return obj;
    }
  }]);
}();
/**
 * Multi-valued, directories that would be merged.
 * @member {Array.<String>} indexDirs
 */
MergeIndexesRequestBody.prototype['indexDirs'] = undefined;

/**
 * Multi-valued, source cores that would be merged.
 * @member {Array.<String>} srcCores
 */
MergeIndexesRequestBody.prototype['srcCores'] = undefined;

/**
 * Request ID to track this action which will be processed asynchronously.
 * @member {String} async
 */
MergeIndexesRequestBody.prototype['async'] = undefined;

/**
 * @member {String} updateChain
 */
MergeIndexesRequestBody.prototype['updateChain'] = undefined;
var _default = exports["default"] = MergeIndexesRequestBody;
},{"../ApiClient":8}],61:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
 * The MigrateReplicasRequestBody model module.
 * @module model/MigrateReplicasRequestBody
 * @version 9.6.0
 */
var MigrateReplicasRequestBody = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>MigrateReplicasRequestBody</code>.
   * @alias module:model/MigrateReplicasRequestBody
   * @param sourceNodes {Array.<String>} The set of nodes which all replicas will be migrated off of.
   */
  function MigrateReplicasRequestBody(sourceNodes) {
    _classCallCheck(this, MigrateReplicasRequestBody);
    MigrateReplicasRequestBody.initialize(this, sourceNodes);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  return _createClass(MigrateReplicasRequestBody, null, [{
    key: "initialize",
    value: function initialize(obj, sourceNodes) {
      obj['sourceNodes'] = sourceNodes;
    }

    /**
     * Constructs a <code>MigrateReplicasRequestBody</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/MigrateReplicasRequestBody} obj Optional instance to populate.
     * @return {module:model/MigrateReplicasRequestBody} The populated <code>MigrateReplicasRequestBody</code> instance.
     */
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new MigrateReplicasRequestBody();
        if (data.hasOwnProperty('sourceNodes')) {
          obj['sourceNodes'] = _ApiClient["default"].convertToType(data['sourceNodes'], ['String']);
        }
        if (data.hasOwnProperty('targetNodes')) {
          obj['targetNodes'] = _ApiClient["default"].convertToType(data['targetNodes'], ['String']);
        }
        if (data.hasOwnProperty('waitForFinalState')) {
          obj['waitForFinalState'] = _ApiClient["default"].convertToType(data['waitForFinalState'], 'Boolean');
        }
        if (data.hasOwnProperty('async')) {
          obj['async'] = _ApiClient["default"].convertToType(data['async'], 'String');
        }
      }
      return obj;
    }
  }]);
}();
/**
 * The set of nodes which all replicas will be migrated off of.
 * @member {Array.<String>} sourceNodes
 */
MigrateReplicasRequestBody.prototype['sourceNodes'] = undefined;

/**
 * A set of nodes to migrate the replicas to. If this is not provided, then the API will use the live data nodes not in 'sourceNodes'.
 * @member {Array.<String>} targetNodes
 */
MigrateReplicasRequestBody.prototype['targetNodes'] = undefined;

/**
 * If true, the request will complete only when all affected replicas become active. If false, the API will return the status of the single action, which may be before the new replicas are online and active.
 * @member {Boolean} waitForFinalState
 */
MigrateReplicasRequestBody.prototype['waitForFinalState'] = undefined;

/**
 * Request ID to track this action which will be processed asynchronously.
 * @member {String} async
 */
MigrateReplicasRequestBody.prototype['async'] = undefined;
var _default = exports["default"] = MigrateReplicasRequestBody;
},{"../ApiClient":8}],62:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
var _ErrorInfo = _interopRequireDefault(require("./ErrorInfo"));
var _ResponseHeader = _interopRequireDefault(require("./ResponseHeader"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
 * The PublicKeyResponse model module.
 * @module model/PublicKeyResponse
 * @version 9.6.0
 */
var PublicKeyResponse = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>PublicKeyResponse</code>.
   * @alias module:model/PublicKeyResponse
   */
  function PublicKeyResponse() {
    _classCallCheck(this, PublicKeyResponse);
    PublicKeyResponse.initialize(this);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  return _createClass(PublicKeyResponse, null, [{
    key: "initialize",
    value: function initialize(obj) {}

    /**
     * Constructs a <code>PublicKeyResponse</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/PublicKeyResponse} obj Optional instance to populate.
     * @return {module:model/PublicKeyResponse} The populated <code>PublicKeyResponse</code> instance.
     */
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new PublicKeyResponse();
        if (data.hasOwnProperty('responseHeader')) {
          obj['responseHeader'] = _ResponseHeader["default"].constructFromObject(data['responseHeader']);
        }
        if (data.hasOwnProperty('error')) {
          obj['error'] = _ErrorInfo["default"].constructFromObject(data['error']);
        }
        if (data.hasOwnProperty('key')) {
          obj['key'] = _ApiClient["default"].convertToType(data['key'], 'String');
        }
      }
      return obj;
    }
  }]);
}();
/**
 * @member {module:model/ResponseHeader} responseHeader
 */
PublicKeyResponse.prototype['responseHeader'] = undefined;

/**
 * @member {module:model/ErrorInfo} error
 */
PublicKeyResponse.prototype['error'] = undefined;

/**
 * The public key of the receiving Solr node.
 * @member {String} key
 */
PublicKeyResponse.prototype['key'] = undefined;
var _default = exports["default"] = PublicKeyResponse;
},{"../ApiClient":8,"./ErrorInfo":45,"./ResponseHeader":71}],63:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
 * The PurgeUnusedFilesRequestBody model module.
 * @module model/PurgeUnusedFilesRequestBody
 * @version 9.6.0
 */
var PurgeUnusedFilesRequestBody = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>PurgeUnusedFilesRequestBody</code>.
   * @alias module:model/PurgeUnusedFilesRequestBody
   */
  function PurgeUnusedFilesRequestBody() {
    _classCallCheck(this, PurgeUnusedFilesRequestBody);
    PurgeUnusedFilesRequestBody.initialize(this);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  return _createClass(PurgeUnusedFilesRequestBody, null, [{
    key: "initialize",
    value: function initialize(obj) {}

    /**
     * Constructs a <code>PurgeUnusedFilesRequestBody</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/PurgeUnusedFilesRequestBody} obj Optional instance to populate.
     * @return {module:model/PurgeUnusedFilesRequestBody} The populated <code>PurgeUnusedFilesRequestBody</code> instance.
     */
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new PurgeUnusedFilesRequestBody();
        if (data.hasOwnProperty('location')) {
          obj['location'] = _ApiClient["default"].convertToType(data['location'], 'String');
        }
        if (data.hasOwnProperty('repositoryName')) {
          obj['repositoryName'] = _ApiClient["default"].convertToType(data['repositoryName'], 'String');
        }
        if (data.hasOwnProperty('async')) {
          obj['async'] = _ApiClient["default"].convertToType(data['async'], 'String');
        }
      }
      return obj;
    }
  }]);
}();
/**
 * @member {String} location
 */
PurgeUnusedFilesRequestBody.prototype['location'] = undefined;

/**
 * @member {String} repositoryName
 */
PurgeUnusedFilesRequestBody.prototype['repositoryName'] = undefined;

/**
 * @member {String} async
 */
PurgeUnusedFilesRequestBody.prototype['async'] = undefined;
var _default = exports["default"] = PurgeUnusedFilesRequestBody;
},{"../ApiClient":8}],64:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
var _ErrorInfo = _interopRequireDefault(require("./ErrorInfo"));
var _PurgeUnusedStats = _interopRequireDefault(require("./PurgeUnusedStats"));
var _ResponseHeader = _interopRequireDefault(require("./ResponseHeader"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
 * The PurgeUnusedResponse model module.
 * @module model/PurgeUnusedResponse
 * @version 9.6.0
 */
var PurgeUnusedResponse = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>PurgeUnusedResponse</code>.
   * @alias module:model/PurgeUnusedResponse
   */
  function PurgeUnusedResponse() {
    _classCallCheck(this, PurgeUnusedResponse);
    PurgeUnusedResponse.initialize(this);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  return _createClass(PurgeUnusedResponse, null, [{
    key: "initialize",
    value: function initialize(obj) {}

    /**
     * Constructs a <code>PurgeUnusedResponse</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/PurgeUnusedResponse} obj Optional instance to populate.
     * @return {module:model/PurgeUnusedResponse} The populated <code>PurgeUnusedResponse</code> instance.
     */
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new PurgeUnusedResponse();
        if (data.hasOwnProperty('deleted')) {
          obj['deleted'] = _PurgeUnusedStats["default"].constructFromObject(data['deleted']);
        }
        if (data.hasOwnProperty('responseHeader')) {
          obj['responseHeader'] = _ResponseHeader["default"].constructFromObject(data['responseHeader']);
        }
        if (data.hasOwnProperty('error')) {
          obj['error'] = _ErrorInfo["default"].constructFromObject(data['error']);
        }
        if (data.hasOwnProperty('requestid')) {
          obj['requestid'] = _ApiClient["default"].convertToType(data['requestid'], 'String');
        }
        if (data.hasOwnProperty('success')) {
          obj['success'] = _ApiClient["default"].convertToType(data['success'], Object);
        }
        if (data.hasOwnProperty('failure')) {
          obj['failure'] = _ApiClient["default"].convertToType(data['failure'], Object);
        }
        if (data.hasOwnProperty('warning')) {
          obj['warning'] = _ApiClient["default"].convertToType(data['warning'], 'String');
        }
      }
      return obj;
    }
  }]);
}();
/**
 * @member {module:model/PurgeUnusedStats} deleted
 */
PurgeUnusedResponse.prototype['deleted'] = undefined;

/**
 * @member {module:model/ResponseHeader} responseHeader
 */
PurgeUnusedResponse.prototype['responseHeader'] = undefined;

/**
 * @member {module:model/ErrorInfo} error
 */
PurgeUnusedResponse.prototype['error'] = undefined;

/**
 * @member {String} requestid
 */
PurgeUnusedResponse.prototype['requestid'] = undefined;

/**
 * @member {Object} success
 */
PurgeUnusedResponse.prototype['success'] = undefined;

/**
 * @member {Object} failure
 */
PurgeUnusedResponse.prototype['failure'] = undefined;

/**
 * @member {String} warning
 */
PurgeUnusedResponse.prototype['warning'] = undefined;
var _default = exports["default"] = PurgeUnusedResponse;
},{"../ApiClient":8,"./ErrorInfo":45,"./PurgeUnusedStats":65,"./ResponseHeader":71}],65:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
 * The PurgeUnusedStats model module.
 * @module model/PurgeUnusedStats
 * @version 9.6.0
 */
var PurgeUnusedStats = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>PurgeUnusedStats</code>.
   * @alias module:model/PurgeUnusedStats
   */
  function PurgeUnusedStats() {
    _classCallCheck(this, PurgeUnusedStats);
    PurgeUnusedStats.initialize(this);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  return _createClass(PurgeUnusedStats, null, [{
    key: "initialize",
    value: function initialize(obj) {}

    /**
     * Constructs a <code>PurgeUnusedStats</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/PurgeUnusedStats} obj Optional instance to populate.
     * @return {module:model/PurgeUnusedStats} The populated <code>PurgeUnusedStats</code> instance.
     */
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new PurgeUnusedStats();
        if (data.hasOwnProperty('numBackupIds')) {
          obj['numBackupIds'] = _ApiClient["default"].convertToType(data['numBackupIds'], 'Number');
        }
        if (data.hasOwnProperty('numShardBackupIds')) {
          obj['numShardBackupIds'] = _ApiClient["default"].convertToType(data['numShardBackupIds'], 'Number');
        }
        if (data.hasOwnProperty('numIndexFiles')) {
          obj['numIndexFiles'] = _ApiClient["default"].convertToType(data['numIndexFiles'], 'Number');
        }
      }
      return obj;
    }
  }]);
}();
/**
 * @member {Number} numBackupIds
 */
PurgeUnusedStats.prototype['numBackupIds'] = undefined;

/**
 * @member {Number} numShardBackupIds
 */
PurgeUnusedStats.prototype['numShardBackupIds'] = undefined;

/**
 * @member {Number} numIndexFiles
 */
PurgeUnusedStats.prototype['numIndexFiles'] = undefined;
var _default = exports["default"] = PurgeUnusedStats;
},{"../ApiClient":8}],66:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
 * The ReloadCollectionRequestBody model module.
 * @module model/ReloadCollectionRequestBody
 * @version 9.6.0
 */
var ReloadCollectionRequestBody = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>ReloadCollectionRequestBody</code>.
   * @alias module:model/ReloadCollectionRequestBody
   */
  function ReloadCollectionRequestBody() {
    _classCallCheck(this, ReloadCollectionRequestBody);
    ReloadCollectionRequestBody.initialize(this);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  return _createClass(ReloadCollectionRequestBody, null, [{
    key: "initialize",
    value: function initialize(obj) {}

    /**
     * Constructs a <code>ReloadCollectionRequestBody</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/ReloadCollectionRequestBody} obj Optional instance to populate.
     * @return {module:model/ReloadCollectionRequestBody} The populated <code>ReloadCollectionRequestBody</code> instance.
     */
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new ReloadCollectionRequestBody();
        if (data.hasOwnProperty('async')) {
          obj['async'] = _ApiClient["default"].convertToType(data['async'], 'String');
        }
      }
      return obj;
    }
  }]);
}();
/**
 * @member {String} async
 */
ReloadCollectionRequestBody.prototype['async'] = undefined;
var _default = exports["default"] = ReloadCollectionRequestBody;
},{"../ApiClient":8}],67:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
 * The ReloadCoreRequestBody model module.
 * @module model/ReloadCoreRequestBody
 * @version 9.6.0
 */
var ReloadCoreRequestBody = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>ReloadCoreRequestBody</code>.
   * Additional parameters for reloading the core
   * @alias module:model/ReloadCoreRequestBody
   */
  function ReloadCoreRequestBody() {
    _classCallCheck(this, ReloadCoreRequestBody);
    ReloadCoreRequestBody.initialize(this);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  return _createClass(ReloadCoreRequestBody, null, [{
    key: "initialize",
    value: function initialize(obj) {}

    /**
     * Constructs a <code>ReloadCoreRequestBody</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/ReloadCoreRequestBody} obj Optional instance to populate.
     * @return {module:model/ReloadCoreRequestBody} The populated <code>ReloadCoreRequestBody</code> instance.
     */
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new ReloadCoreRequestBody();
        if (data.hasOwnProperty('async')) {
          obj['async'] = _ApiClient["default"].convertToType(data['async'], 'String');
        }
      }
      return obj;
    }
  }]);
}();
/**
 * Request ID to track this action which will be processed asynchronously.
 * @member {String} async
 */
ReloadCoreRequestBody.prototype['async'] = undefined;
var _default = exports["default"] = ReloadCoreRequestBody;
},{"../ApiClient":8}],68:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
 * The RenameCollectionRequestBody model module.
 * @module model/RenameCollectionRequestBody
 * @version 9.6.0
 */
var RenameCollectionRequestBody = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>RenameCollectionRequestBody</code>.
   * @alias module:model/RenameCollectionRequestBody
   * @param to {String} 
   */
  function RenameCollectionRequestBody(to) {
    _classCallCheck(this, RenameCollectionRequestBody);
    RenameCollectionRequestBody.initialize(this, to);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  return _createClass(RenameCollectionRequestBody, null, [{
    key: "initialize",
    value: function initialize(obj, to) {
      obj['to'] = to;
    }

    /**
     * Constructs a <code>RenameCollectionRequestBody</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/RenameCollectionRequestBody} obj Optional instance to populate.
     * @return {module:model/RenameCollectionRequestBody} The populated <code>RenameCollectionRequestBody</code> instance.
     */
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new RenameCollectionRequestBody();
        if (data.hasOwnProperty('to')) {
          obj['to'] = _ApiClient["default"].convertToType(data['to'], 'String');
        }
        if (data.hasOwnProperty('followAliases')) {
          obj['followAliases'] = _ApiClient["default"].convertToType(data['followAliases'], 'Boolean');
        }
        if (data.hasOwnProperty('async')) {
          obj['async'] = _ApiClient["default"].convertToType(data['async'], 'String');
        }
      }
      return obj;
    }
  }]);
}();
/**
 * @member {String} to
 */
RenameCollectionRequestBody.prototype['to'] = undefined;

/**
 * @member {Boolean} followAliases
 */
RenameCollectionRequestBody.prototype['followAliases'] = undefined;

/**
 * @member {String} async
 */
RenameCollectionRequestBody.prototype['async'] = undefined;
var _default = exports["default"] = RenameCollectionRequestBody;
},{"../ApiClient":8}],69:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
 * The RenameCoreRequestBody model module.
 * @module model/RenameCoreRequestBody
 * @version 9.6.0
 */
var RenameCoreRequestBody = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>RenameCoreRequestBody</code>.
   * @alias module:model/RenameCoreRequestBody
   * @param to {String} The new name for the Solr core.
   */
  function RenameCoreRequestBody(to) {
    _classCallCheck(this, RenameCoreRequestBody);
    RenameCoreRequestBody.initialize(this, to);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  return _createClass(RenameCoreRequestBody, null, [{
    key: "initialize",
    value: function initialize(obj, to) {
      obj['to'] = to;
    }

    /**
     * Constructs a <code>RenameCoreRequestBody</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/RenameCoreRequestBody} obj Optional instance to populate.
     * @return {module:model/RenameCoreRequestBody} The populated <code>RenameCoreRequestBody</code> instance.
     */
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new RenameCoreRequestBody();
        if (data.hasOwnProperty('to')) {
          obj['to'] = _ApiClient["default"].convertToType(data['to'], 'String');
        }
        if (data.hasOwnProperty('async')) {
          obj['async'] = _ApiClient["default"].convertToType(data['async'], 'String');
        }
      }
      return obj;
    }
  }]);
}();
/**
 * The new name for the Solr core.
 * @member {String} to
 */
RenameCoreRequestBody.prototype['to'] = undefined;

/**
 * Request ID to track this action which will be processed asynchronously.
 * @member {String} async
 */
RenameCoreRequestBody.prototype['async'] = undefined;
var _default = exports["default"] = RenameCoreRequestBody;
},{"../ApiClient":8}],70:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
 * The ReplaceNodeRequestBody model module.
 * @module model/ReplaceNodeRequestBody
 * @version 9.6.0
 */
var ReplaceNodeRequestBody = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>ReplaceNodeRequestBody</code>.
   * @alias module:model/ReplaceNodeRequestBody
   */
  function ReplaceNodeRequestBody() {
    _classCallCheck(this, ReplaceNodeRequestBody);
    ReplaceNodeRequestBody.initialize(this);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  return _createClass(ReplaceNodeRequestBody, null, [{
    key: "initialize",
    value: function initialize(obj) {}

    /**
     * Constructs a <code>ReplaceNodeRequestBody</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/ReplaceNodeRequestBody} obj Optional instance to populate.
     * @return {module:model/ReplaceNodeRequestBody} The populated <code>ReplaceNodeRequestBody</code> instance.
     */
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new ReplaceNodeRequestBody();
        if (data.hasOwnProperty('targetNodeName')) {
          obj['targetNodeName'] = _ApiClient["default"].convertToType(data['targetNodeName'], 'String');
        }
        if (data.hasOwnProperty('waitForFinalState')) {
          obj['waitForFinalState'] = _ApiClient["default"].convertToType(data['waitForFinalState'], 'Boolean');
        }
        if (data.hasOwnProperty('async')) {
          obj['async'] = _ApiClient["default"].convertToType(data['async'], 'String');
        }
      }
      return obj;
    }
  }]);
}();
/**
 * The target node where replicas will be copied. If this parameter is not provided, Solr will identify nodes automatically based on policies or number of cores in each node.
 * @member {String} targetNodeName
 */
ReplaceNodeRequestBody.prototype['targetNodeName'] = undefined;

/**
 * If true, the request will complete only when all affected replicas become active. If false, the API will return the status of the single action, which may be before the new replica is online and active.
 * @member {Boolean} waitForFinalState
 */
ReplaceNodeRequestBody.prototype['waitForFinalState'] = undefined;

/**
 * Request ID to track this action which will be processed asynchronously.
 * @member {String} async
 */
ReplaceNodeRequestBody.prototype['async'] = undefined;
var _default = exports["default"] = ReplaceNodeRequestBody;
},{"../ApiClient":8}],71:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
 * The ResponseHeader model module.
 * @module model/ResponseHeader
 * @version 9.6.0
 */
var ResponseHeader = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>ResponseHeader</code>.
   * @alias module:model/ResponseHeader
   */
  function ResponseHeader() {
    _classCallCheck(this, ResponseHeader);
    ResponseHeader.initialize(this);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  return _createClass(ResponseHeader, null, [{
    key: "initialize",
    value: function initialize(obj) {}

    /**
     * Constructs a <code>ResponseHeader</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/ResponseHeader} obj Optional instance to populate.
     * @return {module:model/ResponseHeader} The populated <code>ResponseHeader</code> instance.
     */
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new ResponseHeader();
        if (data.hasOwnProperty('status')) {
          obj['status'] = _ApiClient["default"].convertToType(data['status'], 'Number');
        }
        if (data.hasOwnProperty('QTime')) {
          obj['QTime'] = _ApiClient["default"].convertToType(data['QTime'], 'Number');
        }
        if (data.hasOwnProperty('partialResults')) {
          obj['partialResults'] = _ApiClient["default"].convertToType(data['partialResults'], 'Boolean');
        }
      }
      return obj;
    }
  }]);
}();
/**
 * @member {Number} status
 */
ResponseHeader.prototype['status'] = undefined;

/**
 * @member {Number} QTime
 */
ResponseHeader.prototype['QTime'] = undefined;

/**
 * @member {Boolean} partialResults
 */
ResponseHeader.prototype['partialResults'] = undefined;
var _default = exports["default"] = ResponseHeader;
},{"../ApiClient":8}],72:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
 * The RestoreCoreRequestBody model module.
 * @module model/RestoreCoreRequestBody
 * @version 9.6.0
 */
var RestoreCoreRequestBody = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>RestoreCoreRequestBody</code>.
   * @alias module:model/RestoreCoreRequestBody
   */
  function RestoreCoreRequestBody() {
    _classCallCheck(this, RestoreCoreRequestBody);
    RestoreCoreRequestBody.initialize(this);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  return _createClass(RestoreCoreRequestBody, null, [{
    key: "initialize",
    value: function initialize(obj) {}

    /**
     * Constructs a <code>RestoreCoreRequestBody</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/RestoreCoreRequestBody} obj Optional instance to populate.
     * @return {module:model/RestoreCoreRequestBody} The populated <code>RestoreCoreRequestBody</code> instance.
     */
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new RestoreCoreRequestBody();
        if (data.hasOwnProperty('name')) {
          obj['name'] = _ApiClient["default"].convertToType(data['name'], 'String');
        }
        if (data.hasOwnProperty('shardBackupId')) {
          obj['shardBackupId'] = _ApiClient["default"].convertToType(data['shardBackupId'], 'String');
        }
        if (data.hasOwnProperty('location')) {
          obj['location'] = _ApiClient["default"].convertToType(data['location'], 'String');
        }
        if (data.hasOwnProperty('async')) {
          obj['async'] = _ApiClient["default"].convertToType(data['async'], 'String');
        }
        if (data.hasOwnProperty('backupRepository')) {
          obj['backupRepository'] = _ApiClient["default"].convertToType(data['backupRepository'], 'String');
        }
      }
      return obj;
    }
  }]);
}();
/**
 * @member {String} name
 */
RestoreCoreRequestBody.prototype['name'] = undefined;

/**
 * @member {String} shardBackupId
 */
RestoreCoreRequestBody.prototype['shardBackupId'] = undefined;

/**
 * @member {String} location
 */
RestoreCoreRequestBody.prototype['location'] = undefined;

/**
 * @member {String} async
 */
RestoreCoreRequestBody.prototype['async'] = undefined;

/**
 * @member {String} backupRepository
 */
RestoreCoreRequestBody.prototype['backupRepository'] = undefined;
var _default = exports["default"] = RestoreCoreRequestBody;
},{"../ApiClient":8}],73:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
 * The ScaleCollectionRequestBody model module.
 * @module model/ScaleCollectionRequestBody
 * @version 9.6.0
 */
var ScaleCollectionRequestBody = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>ScaleCollectionRequestBody</code>.
   * @alias module:model/ScaleCollectionRequestBody
   * @param numToDelete {Number} 
   */
  function ScaleCollectionRequestBody(numToDelete) {
    _classCallCheck(this, ScaleCollectionRequestBody);
    ScaleCollectionRequestBody.initialize(this, numToDelete);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  return _createClass(ScaleCollectionRequestBody, null, [{
    key: "initialize",
    value: function initialize(obj, numToDelete) {
      obj['numToDelete'] = numToDelete;
    }

    /**
     * Constructs a <code>ScaleCollectionRequestBody</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/ScaleCollectionRequestBody} obj Optional instance to populate.
     * @return {module:model/ScaleCollectionRequestBody} The populated <code>ScaleCollectionRequestBody</code> instance.
     */
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new ScaleCollectionRequestBody();
        if (data.hasOwnProperty('numToDelete')) {
          obj['numToDelete'] = _ApiClient["default"].convertToType(data['numToDelete'], 'Number');
        }
        if (data.hasOwnProperty('followAliases')) {
          obj['followAliases'] = _ApiClient["default"].convertToType(data['followAliases'], 'Boolean');
        }
        if (data.hasOwnProperty('deleteInstanceDir')) {
          obj['deleteInstanceDir'] = _ApiClient["default"].convertToType(data['deleteInstanceDir'], 'Boolean');
        }
        if (data.hasOwnProperty('deleteDataDir')) {
          obj['deleteDataDir'] = _ApiClient["default"].convertToType(data['deleteDataDir'], 'Boolean');
        }
        if (data.hasOwnProperty('deleteIndex')) {
          obj['deleteIndex'] = _ApiClient["default"].convertToType(data['deleteIndex'], 'Boolean');
        }
        if (data.hasOwnProperty('onlyIfDown')) {
          obj['onlyIfDown'] = _ApiClient["default"].convertToType(data['onlyIfDown'], 'Boolean');
        }
        if (data.hasOwnProperty('async')) {
          obj['async'] = _ApiClient["default"].convertToType(data['async'], 'String');
        }
      }
      return obj;
    }
  }]);
}();
/**
 * @member {Number} numToDelete
 */
ScaleCollectionRequestBody.prototype['numToDelete'] = undefined;

/**
 * @member {Boolean} followAliases
 */
ScaleCollectionRequestBody.prototype['followAliases'] = undefined;

/**
 * @member {Boolean} deleteInstanceDir
 */
ScaleCollectionRequestBody.prototype['deleteInstanceDir'] = undefined;

/**
 * @member {Boolean} deleteDataDir
 */
ScaleCollectionRequestBody.prototype['deleteDataDir'] = undefined;

/**
 * @member {Boolean} deleteIndex
 */
ScaleCollectionRequestBody.prototype['deleteIndex'] = undefined;

/**
 * @member {Boolean} onlyIfDown
 */
ScaleCollectionRequestBody.prototype['onlyIfDown'] = undefined;

/**
 * @member {String} async
 */
ScaleCollectionRequestBody.prototype['async'] = undefined;
var _default = exports["default"] = ScaleCollectionRequestBody;
},{"../ApiClient":8}],74:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
var _ErrorInfo = _interopRequireDefault(require("./ErrorInfo"));
var _ResponseHeader = _interopRequireDefault(require("./ResponseHeader"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
 * The SchemaInfoResponse model module.
 * @module model/SchemaInfoResponse
 * @version 9.6.0
 */
var SchemaInfoResponse = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>SchemaInfoResponse</code>.
   * @alias module:model/SchemaInfoResponse
   */
  function SchemaInfoResponse() {
    _classCallCheck(this, SchemaInfoResponse);
    SchemaInfoResponse.initialize(this);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  return _createClass(SchemaInfoResponse, null, [{
    key: "initialize",
    value: function initialize(obj) {}

    /**
     * Constructs a <code>SchemaInfoResponse</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/SchemaInfoResponse} obj Optional instance to populate.
     * @return {module:model/SchemaInfoResponse} The populated <code>SchemaInfoResponse</code> instance.
     */
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new SchemaInfoResponse();
        if (data.hasOwnProperty('responseHeader')) {
          obj['responseHeader'] = _ResponseHeader["default"].constructFromObject(data['responseHeader']);
        }
        if (data.hasOwnProperty('error')) {
          obj['error'] = _ErrorInfo["default"].constructFromObject(data['error']);
        }
        if (data.hasOwnProperty('schema')) {
          obj['schema'] = _ApiClient["default"].convertToType(data['schema'], {
            'String': Object
          });
        }
      }
      return obj;
    }
  }]);
}();
/**
 * @member {module:model/ResponseHeader} responseHeader
 */
SchemaInfoResponse.prototype['responseHeader'] = undefined;

/**
 * @member {module:model/ErrorInfo} error
 */
SchemaInfoResponse.prototype['error'] = undefined;

/**
 * @member {Object.<String, Object>} schema
 */
SchemaInfoResponse.prototype['schema'] = undefined;
var _default = exports["default"] = SchemaInfoResponse;
},{"../ApiClient":8,"./ErrorInfo":45,"./ResponseHeader":71}],75:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
var _ErrorInfo = _interopRequireDefault(require("./ErrorInfo"));
var _ResponseHeader = _interopRequireDefault(require("./ResponseHeader"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
 * The SchemaNameResponse model module.
 * @module model/SchemaNameResponse
 * @version 9.6.0
 */
var SchemaNameResponse = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>SchemaNameResponse</code>.
   * @alias module:model/SchemaNameResponse
   */
  function SchemaNameResponse() {
    _classCallCheck(this, SchemaNameResponse);
    SchemaNameResponse.initialize(this);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  return _createClass(SchemaNameResponse, null, [{
    key: "initialize",
    value: function initialize(obj) {}

    /**
     * Constructs a <code>SchemaNameResponse</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/SchemaNameResponse} obj Optional instance to populate.
     * @return {module:model/SchemaNameResponse} The populated <code>SchemaNameResponse</code> instance.
     */
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new SchemaNameResponse();
        if (data.hasOwnProperty('responseHeader')) {
          obj['responseHeader'] = _ResponseHeader["default"].constructFromObject(data['responseHeader']);
        }
        if (data.hasOwnProperty('error')) {
          obj['error'] = _ErrorInfo["default"].constructFromObject(data['error']);
        }
        if (data.hasOwnProperty('name')) {
          obj['name'] = _ApiClient["default"].convertToType(data['name'], 'String');
        }
      }
      return obj;
    }
  }]);
}();
/**
 * @member {module:model/ResponseHeader} responseHeader
 */
SchemaNameResponse.prototype['responseHeader'] = undefined;

/**
 * @member {module:model/ErrorInfo} error
 */
SchemaNameResponse.prototype['error'] = undefined;

/**
 * @member {String} name
 */
SchemaNameResponse.prototype['name'] = undefined;
var _default = exports["default"] = SchemaNameResponse;
},{"../ApiClient":8,"./ErrorInfo":45,"./ResponseHeader":71}],76:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
var _ErrorInfo = _interopRequireDefault(require("./ErrorInfo"));
var _ResponseHeader = _interopRequireDefault(require("./ResponseHeader"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
 * The SchemaSimilarityResponse model module.
 * @module model/SchemaSimilarityResponse
 * @version 9.6.0
 */
var SchemaSimilarityResponse = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>SchemaSimilarityResponse</code>.
   * @alias module:model/SchemaSimilarityResponse
   */
  function SchemaSimilarityResponse() {
    _classCallCheck(this, SchemaSimilarityResponse);
    SchemaSimilarityResponse.initialize(this);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  return _createClass(SchemaSimilarityResponse, null, [{
    key: "initialize",
    value: function initialize(obj) {}

    /**
     * Constructs a <code>SchemaSimilarityResponse</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/SchemaSimilarityResponse} obj Optional instance to populate.
     * @return {module:model/SchemaSimilarityResponse} The populated <code>SchemaSimilarityResponse</code> instance.
     */
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new SchemaSimilarityResponse();
        if (data.hasOwnProperty('responseHeader')) {
          obj['responseHeader'] = _ResponseHeader["default"].constructFromObject(data['responseHeader']);
        }
        if (data.hasOwnProperty('error')) {
          obj['error'] = _ErrorInfo["default"].constructFromObject(data['error']);
        }
        if (data.hasOwnProperty('similarity')) {
          obj['similarity'] = _ApiClient["default"].convertToType(data['similarity'], Object);
        }
      }
      return obj;
    }
  }]);
}();
/**
 * @member {module:model/ResponseHeader} responseHeader
 */
SchemaSimilarityResponse.prototype['responseHeader'] = undefined;

/**
 * @member {module:model/ErrorInfo} error
 */
SchemaSimilarityResponse.prototype['error'] = undefined;

/**
 * @member {Object} similarity
 */
SchemaSimilarityResponse.prototype['similarity'] = undefined;
var _default = exports["default"] = SchemaSimilarityResponse;
},{"../ApiClient":8,"./ErrorInfo":45,"./ResponseHeader":71}],77:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
var _ErrorInfo = _interopRequireDefault(require("./ErrorInfo"));
var _ResponseHeader = _interopRequireDefault(require("./ResponseHeader"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
 * The SchemaUniqueKeyResponse model module.
 * @module model/SchemaUniqueKeyResponse
 * @version 9.6.0
 */
var SchemaUniqueKeyResponse = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>SchemaUniqueKeyResponse</code>.
   * @alias module:model/SchemaUniqueKeyResponse
   */
  function SchemaUniqueKeyResponse() {
    _classCallCheck(this, SchemaUniqueKeyResponse);
    SchemaUniqueKeyResponse.initialize(this);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  return _createClass(SchemaUniqueKeyResponse, null, [{
    key: "initialize",
    value: function initialize(obj) {}

    /**
     * Constructs a <code>SchemaUniqueKeyResponse</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/SchemaUniqueKeyResponse} obj Optional instance to populate.
     * @return {module:model/SchemaUniqueKeyResponse} The populated <code>SchemaUniqueKeyResponse</code> instance.
     */
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new SchemaUniqueKeyResponse();
        if (data.hasOwnProperty('responseHeader')) {
          obj['responseHeader'] = _ResponseHeader["default"].constructFromObject(data['responseHeader']);
        }
        if (data.hasOwnProperty('error')) {
          obj['error'] = _ErrorInfo["default"].constructFromObject(data['error']);
        }
        if (data.hasOwnProperty('uniqueKey')) {
          obj['uniqueKey'] = _ApiClient["default"].convertToType(data['uniqueKey'], 'String');
        }
      }
      return obj;
    }
  }]);
}();
/**
 * @member {module:model/ResponseHeader} responseHeader
 */
SchemaUniqueKeyResponse.prototype['responseHeader'] = undefined;

/**
 * @member {module:model/ErrorInfo} error
 */
SchemaUniqueKeyResponse.prototype['error'] = undefined;

/**
 * @member {String} uniqueKey
 */
SchemaUniqueKeyResponse.prototype['uniqueKey'] = undefined;
var _default = exports["default"] = SchemaUniqueKeyResponse;
},{"../ApiClient":8,"./ErrorInfo":45,"./ResponseHeader":71}],78:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
var _ErrorInfo = _interopRequireDefault(require("./ErrorInfo"));
var _ResponseHeader = _interopRequireDefault(require("./ResponseHeader"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
 * The SchemaVersionResponse model module.
 * @module model/SchemaVersionResponse
 * @version 9.6.0
 */
var SchemaVersionResponse = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>SchemaVersionResponse</code>.
   * @alias module:model/SchemaVersionResponse
   */
  function SchemaVersionResponse() {
    _classCallCheck(this, SchemaVersionResponse);
    SchemaVersionResponse.initialize(this);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  return _createClass(SchemaVersionResponse, null, [{
    key: "initialize",
    value: function initialize(obj) {}

    /**
     * Constructs a <code>SchemaVersionResponse</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/SchemaVersionResponse} obj Optional instance to populate.
     * @return {module:model/SchemaVersionResponse} The populated <code>SchemaVersionResponse</code> instance.
     */
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new SchemaVersionResponse();
        if (data.hasOwnProperty('responseHeader')) {
          obj['responseHeader'] = _ResponseHeader["default"].constructFromObject(data['responseHeader']);
        }
        if (data.hasOwnProperty('error')) {
          obj['error'] = _ErrorInfo["default"].constructFromObject(data['error']);
        }
        if (data.hasOwnProperty('version')) {
          obj['version'] = _ApiClient["default"].convertToType(data['version'], 'Number');
        }
      }
      return obj;
    }
  }]);
}();
/**
 * @member {module:model/ResponseHeader} responseHeader
 */
SchemaVersionResponse.prototype['responseHeader'] = undefined;

/**
 * @member {module:model/ErrorInfo} error
 */
SchemaVersionResponse.prototype['error'] = undefined;

/**
 * @member {Number} version
 */
SchemaVersionResponse.prototype['version'] = undefined;
var _default = exports["default"] = SchemaVersionResponse;
},{"../ApiClient":8,"./ErrorInfo":45,"./ResponseHeader":71}],79:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
var _ErrorInfo = _interopRequireDefault(require("./ErrorInfo"));
var _ResponseHeader = _interopRequireDefault(require("./ResponseHeader"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
 * The SchemaZkVersionResponse model module.
 * @module model/SchemaZkVersionResponse
 * @version 9.6.0
 */
var SchemaZkVersionResponse = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>SchemaZkVersionResponse</code>.
   * @alias module:model/SchemaZkVersionResponse
   */
  function SchemaZkVersionResponse() {
    _classCallCheck(this, SchemaZkVersionResponse);
    SchemaZkVersionResponse.initialize(this);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  return _createClass(SchemaZkVersionResponse, null, [{
    key: "initialize",
    value: function initialize(obj) {}

    /**
     * Constructs a <code>SchemaZkVersionResponse</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/SchemaZkVersionResponse} obj Optional instance to populate.
     * @return {module:model/SchemaZkVersionResponse} The populated <code>SchemaZkVersionResponse</code> instance.
     */
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new SchemaZkVersionResponse();
        if (data.hasOwnProperty('zkversion')) {
          obj['zkversion'] = _ApiClient["default"].convertToType(data['zkversion'], 'Number');
        }
        if (data.hasOwnProperty('responseHeader')) {
          obj['responseHeader'] = _ResponseHeader["default"].constructFromObject(data['responseHeader']);
        }
        if (data.hasOwnProperty('error')) {
          obj['error'] = _ErrorInfo["default"].constructFromObject(data['error']);
        }
      }
      return obj;
    }
  }]);
}();
/**
 * @member {Number} zkversion
 */
SchemaZkVersionResponse.prototype['zkversion'] = undefined;

/**
 * @member {module:model/ResponseHeader} responseHeader
 */
SchemaZkVersionResponse.prototype['responseHeader'] = undefined;

/**
 * @member {module:model/ErrorInfo} error
 */
SchemaZkVersionResponse.prototype['error'] = undefined;
var _default = exports["default"] = SchemaZkVersionResponse;
},{"../ApiClient":8,"./ErrorInfo":45,"./ResponseHeader":71}],80:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
 * The SnapshotInformation model module.
 * @module model/SnapshotInformation
 * @version 9.6.0
 */
var SnapshotInformation = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>SnapshotInformation</code>.
   * The collection of snapshots found for the requested core.
   * @alias module:model/SnapshotInformation
   */
  function SnapshotInformation() {
    _classCallCheck(this, SnapshotInformation);
    SnapshotInformation.initialize(this);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  return _createClass(SnapshotInformation, null, [{
    key: "initialize",
    value: function initialize(obj) {}

    /**
     * Constructs a <code>SnapshotInformation</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/SnapshotInformation} obj Optional instance to populate.
     * @return {module:model/SnapshotInformation} The populated <code>SnapshotInformation</code> instance.
     */
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new SnapshotInformation();
        if (data.hasOwnProperty('indexDirPath')) {
          obj['indexDirPath'] = _ApiClient["default"].convertToType(data['indexDirPath'], 'String');
        }
        if (data.hasOwnProperty('generationNumber')) {
          obj['generationNumber'] = _ApiClient["default"].convertToType(data['generationNumber'], 'Number');
        }
      }
      return obj;
    }
  }]);
}();
/**
 * The path to the directory containing the index files.
 * @member {String} indexDirPath
 */
SnapshotInformation.prototype['indexDirPath'] = undefined;

/**
 * The generation value for the snapshot.
 * @member {Number} generationNumber
 */
SnapshotInformation.prototype['generationNumber'] = undefined;
var _default = exports["default"] = SnapshotInformation;
},{"../ApiClient":8}],81:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
var _ErrorInfo = _interopRequireDefault(require("./ErrorInfo"));
var _ResponseHeader = _interopRequireDefault(require("./ResponseHeader"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
 * The SolrJerseyResponse model module.
 * @module model/SolrJerseyResponse
 * @version 9.6.0
 */
var SolrJerseyResponse = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>SolrJerseyResponse</code>.
   * @alias module:model/SolrJerseyResponse
   */
  function SolrJerseyResponse() {
    _classCallCheck(this, SolrJerseyResponse);
    SolrJerseyResponse.initialize(this);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  return _createClass(SolrJerseyResponse, null, [{
    key: "initialize",
    value: function initialize(obj) {}

    /**
     * Constructs a <code>SolrJerseyResponse</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/SolrJerseyResponse} obj Optional instance to populate.
     * @return {module:model/SolrJerseyResponse} The populated <code>SolrJerseyResponse</code> instance.
     */
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new SolrJerseyResponse();
        if (data.hasOwnProperty('responseHeader')) {
          obj['responseHeader'] = _ResponseHeader["default"].constructFromObject(data['responseHeader']);
        }
        if (data.hasOwnProperty('error')) {
          obj['error'] = _ErrorInfo["default"].constructFromObject(data['error']);
        }
      }
      return obj;
    }
  }]);
}();
/**
 * @member {module:model/ResponseHeader} responseHeader
 */
SolrJerseyResponse.prototype['responseHeader'] = undefined;

/**
 * @member {module:model/ErrorInfo} error
 */
SolrJerseyResponse.prototype['error'] = undefined;
var _default = exports["default"] = SolrJerseyResponse;
},{"../ApiClient":8,"./ErrorInfo":45,"./ResponseHeader":71}],82:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
var _ErrorInfo = _interopRequireDefault(require("./ErrorInfo"));
var _ResponseHeader = _interopRequireDefault(require("./ResponseHeader"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
 * The SubResponseAccumulatingJerseyResponse model module.
 * @module model/SubResponseAccumulatingJerseyResponse
 * @version 9.6.0
 */
var SubResponseAccumulatingJerseyResponse = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>SubResponseAccumulatingJerseyResponse</code>.
   * @alias module:model/SubResponseAccumulatingJerseyResponse
   */
  function SubResponseAccumulatingJerseyResponse() {
    _classCallCheck(this, SubResponseAccumulatingJerseyResponse);
    SubResponseAccumulatingJerseyResponse.initialize(this);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  return _createClass(SubResponseAccumulatingJerseyResponse, null, [{
    key: "initialize",
    value: function initialize(obj) {}

    /**
     * Constructs a <code>SubResponseAccumulatingJerseyResponse</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/SubResponseAccumulatingJerseyResponse} obj Optional instance to populate.
     * @return {module:model/SubResponseAccumulatingJerseyResponse} The populated <code>SubResponseAccumulatingJerseyResponse</code> instance.
     */
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new SubResponseAccumulatingJerseyResponse();
        if (data.hasOwnProperty('responseHeader')) {
          obj['responseHeader'] = _ResponseHeader["default"].constructFromObject(data['responseHeader']);
        }
        if (data.hasOwnProperty('error')) {
          obj['error'] = _ErrorInfo["default"].constructFromObject(data['error']);
        }
        if (data.hasOwnProperty('requestid')) {
          obj['requestid'] = _ApiClient["default"].convertToType(data['requestid'], 'String');
        }
        if (data.hasOwnProperty('success')) {
          obj['success'] = _ApiClient["default"].convertToType(data['success'], Object);
        }
        if (data.hasOwnProperty('failure')) {
          obj['failure'] = _ApiClient["default"].convertToType(data['failure'], Object);
        }
        if (data.hasOwnProperty('warning')) {
          obj['warning'] = _ApiClient["default"].convertToType(data['warning'], 'String');
        }
      }
      return obj;
    }
  }]);
}();
/**
 * @member {module:model/ResponseHeader} responseHeader
 */
SubResponseAccumulatingJerseyResponse.prototype['responseHeader'] = undefined;

/**
 * @member {module:model/ErrorInfo} error
 */
SubResponseAccumulatingJerseyResponse.prototype['error'] = undefined;

/**
 * @member {String} requestid
 */
SubResponseAccumulatingJerseyResponse.prototype['requestid'] = undefined;

/**
 * @member {Object} success
 */
SubResponseAccumulatingJerseyResponse.prototype['success'] = undefined;

/**
 * @member {Object} failure
 */
SubResponseAccumulatingJerseyResponse.prototype['failure'] = undefined;

/**
 * @member {String} warning
 */
SubResponseAccumulatingJerseyResponse.prototype['warning'] = undefined;
var _default = exports["default"] = SubResponseAccumulatingJerseyResponse;
},{"../ApiClient":8,"./ErrorInfo":45,"./ResponseHeader":71}],83:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
 * The SwapCoresRequestBody model module.
 * @module model/SwapCoresRequestBody
 * @version 9.6.0
 */
var SwapCoresRequestBody = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>SwapCoresRequestBody</code>.
   * @alias module:model/SwapCoresRequestBody
   */
  function SwapCoresRequestBody() {
    _classCallCheck(this, SwapCoresRequestBody);
    SwapCoresRequestBody.initialize(this);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  return _createClass(SwapCoresRequestBody, null, [{
    key: "initialize",
    value: function initialize(obj) {}

    /**
     * Constructs a <code>SwapCoresRequestBody</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/SwapCoresRequestBody} obj Optional instance to populate.
     * @return {module:model/SwapCoresRequestBody} The populated <code>SwapCoresRequestBody</code> instance.
     */
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new SwapCoresRequestBody();
        if (data.hasOwnProperty('with')) {
          obj['with'] = _ApiClient["default"].convertToType(data['with'], 'String');
        }
        if (data.hasOwnProperty('async')) {
          obj['async'] = _ApiClient["default"].convertToType(data['async'], 'String');
        }
      }
      return obj;
    }
  }]);
}();
/**
 * The name of the other core to be swapped.
 * @member {String} with
 */
SwapCoresRequestBody.prototype['with'] = undefined;

/**
 * Request ID to track this action which will be processed asynchronously.
 * @member {String} async
 */
SwapCoresRequestBody.prototype['async'] = undefined;
var _default = exports["default"] = SwapCoresRequestBody;
},{"../ApiClient":8}],84:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
 * The UnloadCoreRequestBody model module.
 * @module model/UnloadCoreRequestBody
 * @version 9.6.0
 */
var UnloadCoreRequestBody = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>UnloadCoreRequestBody</code>.
   * @alias module:model/UnloadCoreRequestBody
   */
  function UnloadCoreRequestBody() {
    _classCallCheck(this, UnloadCoreRequestBody);
    UnloadCoreRequestBody.initialize(this);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  return _createClass(UnloadCoreRequestBody, null, [{
    key: "initialize",
    value: function initialize(obj) {}

    /**
     * Constructs a <code>UnloadCoreRequestBody</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/UnloadCoreRequestBody} obj Optional instance to populate.
     * @return {module:model/UnloadCoreRequestBody} The populated <code>UnloadCoreRequestBody</code> instance.
     */
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new UnloadCoreRequestBody();
        if (data.hasOwnProperty('deleteIndex')) {
          obj['deleteIndex'] = _ApiClient["default"].convertToType(data['deleteIndex'], 'Boolean');
        }
        if (data.hasOwnProperty('deleteDataDir')) {
          obj['deleteDataDir'] = _ApiClient["default"].convertToType(data['deleteDataDir'], 'Boolean');
        }
        if (data.hasOwnProperty('deleteInstanceDir')) {
          obj['deleteInstanceDir'] = _ApiClient["default"].convertToType(data['deleteInstanceDir'], 'Boolean');
        }
        if (data.hasOwnProperty('async')) {
          obj['async'] = _ApiClient["default"].convertToType(data['async'], 'String');
        }
      }
      return obj;
    }
  }]);
}();
/**
 * If true, will remove the index when unloading the core.
 * @member {Boolean} deleteIndex
 */
UnloadCoreRequestBody.prototype['deleteIndex'] = undefined;

/**
 * If true, removes the data directory and all sub-directories.
 * @member {Boolean} deleteDataDir
 */
UnloadCoreRequestBody.prototype['deleteDataDir'] = undefined;

/**
 * If true, removes everything related to the core, including the index directory, configuration files and other related files.
 * @member {Boolean} deleteInstanceDir
 */
UnloadCoreRequestBody.prototype['deleteInstanceDir'] = undefined;

/**
 * Request ID to track this action which will be processed asynchronously.
 * @member {String} async
 */
UnloadCoreRequestBody.prototype['async'] = undefined;
var _default = exports["default"] = UnloadCoreRequestBody;
},{"../ApiClient":8}],85:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
 * The UpdateAliasPropertiesRequestBody model module.
 * @module model/UpdateAliasPropertiesRequestBody
 * @version 9.6.0
 */
var UpdateAliasPropertiesRequestBody = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>UpdateAliasPropertiesRequestBody</code>.
   * @alias module:model/UpdateAliasPropertiesRequestBody
   * @param properties {Object.<String, Object>} Properties and values to be updated on alias.
   */
  function UpdateAliasPropertiesRequestBody(properties) {
    _classCallCheck(this, UpdateAliasPropertiesRequestBody);
    UpdateAliasPropertiesRequestBody.initialize(this, properties);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  return _createClass(UpdateAliasPropertiesRequestBody, null, [{
    key: "initialize",
    value: function initialize(obj, properties) {
      obj['properties'] = properties;
    }

    /**
     * Constructs a <code>UpdateAliasPropertiesRequestBody</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/UpdateAliasPropertiesRequestBody} obj Optional instance to populate.
     * @return {module:model/UpdateAliasPropertiesRequestBody} The populated <code>UpdateAliasPropertiesRequestBody</code> instance.
     */
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new UpdateAliasPropertiesRequestBody();
        if (data.hasOwnProperty('properties')) {
          obj['properties'] = _ApiClient["default"].convertToType(data['properties'], {
            'String': Object
          });
        }
        if (data.hasOwnProperty('async')) {
          obj['async'] = _ApiClient["default"].convertToType(data['async'], 'String');
        }
      }
      return obj;
    }
  }]);
}();
/**
 * Properties and values to be updated on alias.
 * @member {Object.<String, Object>} properties
 */
UpdateAliasPropertiesRequestBody.prototype['properties'] = undefined;

/**
 * Request ID to track this action which will be processed asynchronously.
 * @member {String} async
 */
UpdateAliasPropertiesRequestBody.prototype['async'] = undefined;
var _default = exports["default"] = UpdateAliasPropertiesRequestBody;
},{"../ApiClient":8}],86:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
 * The UpdateAliasPropertyRequestBody model module.
 * @module model/UpdateAliasPropertyRequestBody
 * @version 9.6.0
 */
var UpdateAliasPropertyRequestBody = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>UpdateAliasPropertyRequestBody</code>.
   * @alias module:model/UpdateAliasPropertyRequestBody
   * @param value {Object} 
   */
  function UpdateAliasPropertyRequestBody(value) {
    _classCallCheck(this, UpdateAliasPropertyRequestBody);
    UpdateAliasPropertyRequestBody.initialize(this, value);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  return _createClass(UpdateAliasPropertyRequestBody, null, [{
    key: "initialize",
    value: function initialize(obj, value) {
      obj['value'] = value;
    }

    /**
     * Constructs a <code>UpdateAliasPropertyRequestBody</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/UpdateAliasPropertyRequestBody} obj Optional instance to populate.
     * @return {module:model/UpdateAliasPropertyRequestBody} The populated <code>UpdateAliasPropertyRequestBody</code> instance.
     */
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new UpdateAliasPropertyRequestBody();
        if (data.hasOwnProperty('value')) {
          obj['value'] = _ApiClient["default"].convertToType(data['value'], Object);
        }
      }
      return obj;
    }
  }]);
}();
/**
 * @member {Object} value
 */
UpdateAliasPropertyRequestBody.prototype['value'] = undefined;
var _default = exports["default"] = UpdateAliasPropertyRequestBody;
},{"../ApiClient":8}],87:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ApiClient = _interopRequireDefault(require("../ApiClient"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * v2 API
 * OpenAPI spec for Solr's v2 API endpoints
 *
 * The version of the OpenAPI document: 9.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */
/**
 * The UpdateCollectionPropertyRequestBody model module.
 * @module model/UpdateCollectionPropertyRequestBody
 * @version 9.6.0
 */
var UpdateCollectionPropertyRequestBody = /*#__PURE__*/function () {
  /**
   * Constructs a new <code>UpdateCollectionPropertyRequestBody</code>.
   * @alias module:model/UpdateCollectionPropertyRequestBody
   * @param value {String} 
   */
  function UpdateCollectionPropertyRequestBody(value) {
    _classCallCheck(this, UpdateCollectionPropertyRequestBody);
    UpdateCollectionPropertyRequestBody.initialize(this, value);
  }

  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  return _createClass(UpdateCollectionPropertyRequestBody, null, [{
    key: "initialize",
    value: function initialize(obj, value) {
      obj['value'] = value;
    }

    /**
     * Constructs a <code>UpdateCollectionPropertyRequestBody</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/UpdateCollectionPropertyRequestBody} obj Optional instance to populate.
     * @return {module:model/UpdateCollectionPropertyRequestBody} The populated <code>UpdateCollectionPropertyRequestBody</code> instance.
     */
  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new UpdateCollectionPropertyRequestBody();
        if (data.hasOwnProperty('value')) {
          obj['value'] = _ApiClient["default"].convertToType(data['value'], 'String');
        }
      }
      return obj;
    }
  }]);
}();
/**
 * @member {String} value
 */
UpdateCollectionPropertyRequestBody.prototype['value'] = undefined;
var _default = exports["default"] = UpdateCollectionPropertyRequestBody;
},{"../ApiClient":8}],88:[function(require,module,exports){

/**
 * Expose `Emitter`.
 */

if (typeof module !== 'undefined') {
  module.exports = Emitter;
}

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }

  // Remove event specific arrays for event types that no
  // one is subscribed for to avoid memory leak.
  if (callbacks.length === 0) {
    delete this._callbacks['$' + event];
  }

  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};

  var args = new Array(arguments.length - 1)
    , callbacks = this._callbacks['$' + event];

  for (var i = 1; i < arguments.length; i++) {
    args[i - 1] = arguments[i];
  }

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{}],89:[function(require,module,exports){
module.exports = stringify
stringify.default = stringify
stringify.stable = deterministicStringify
stringify.stableStringify = deterministicStringify

var LIMIT_REPLACE_NODE = '[...]'
var CIRCULAR_REPLACE_NODE = '[Circular]'

var arr = []
var replacerStack = []

function defaultOptions () {
  return {
    depthLimit: Number.MAX_SAFE_INTEGER,
    edgesLimit: Number.MAX_SAFE_INTEGER
  }
}

// Regular stringify
function stringify (obj, replacer, spacer, options) {
  if (typeof options === 'undefined') {
    options = defaultOptions()
  }

  decirc(obj, '', 0, [], undefined, 0, options)
  var res
  try {
    if (replacerStack.length === 0) {
      res = JSON.stringify(obj, replacer, spacer)
    } else {
      res = JSON.stringify(obj, replaceGetterValues(replacer), spacer)
    }
  } catch (_) {
    return JSON.stringify('[unable to serialize, circular reference is too complex to analyze]')
  } finally {
    while (arr.length !== 0) {
      var part = arr.pop()
      if (part.length === 4) {
        Object.defineProperty(part[0], part[1], part[3])
      } else {
        part[0][part[1]] = part[2]
      }
    }
  }
  return res
}

function setReplace (replace, val, k, parent) {
  var propertyDescriptor = Object.getOwnPropertyDescriptor(parent, k)
  if (propertyDescriptor.get !== undefined) {
    if (propertyDescriptor.configurable) {
      Object.defineProperty(parent, k, { value: replace })
      arr.push([parent, k, val, propertyDescriptor])
    } else {
      replacerStack.push([val, k, replace])
    }
  } else {
    parent[k] = replace
    arr.push([parent, k, val])
  }
}

function decirc (val, k, edgeIndex, stack, parent, depth, options) {
  depth += 1
  var i
  if (typeof val === 'object' && val !== null) {
    for (i = 0; i < stack.length; i++) {
      if (stack[i] === val) {
        setReplace(CIRCULAR_REPLACE_NODE, val, k, parent)
        return
      }
    }

    if (
      typeof options.depthLimit !== 'undefined' &&
      depth > options.depthLimit
    ) {
      setReplace(LIMIT_REPLACE_NODE, val, k, parent)
      return
    }

    if (
      typeof options.edgesLimit !== 'undefined' &&
      edgeIndex + 1 > options.edgesLimit
    ) {
      setReplace(LIMIT_REPLACE_NODE, val, k, parent)
      return
    }

    stack.push(val)
    // Optimize for Arrays. Big arrays could kill the performance otherwise!
    if (Array.isArray(val)) {
      for (i = 0; i < val.length; i++) {
        decirc(val[i], i, i, stack, val, depth, options)
      }
    } else {
      var keys = Object.keys(val)
      for (i = 0; i < keys.length; i++) {
        var key = keys[i]
        decirc(val[key], key, i, stack, val, depth, options)
      }
    }
    stack.pop()
  }
}

// Stable-stringify
function compareFunction (a, b) {
  if (a < b) {
    return -1
  }
  if (a > b) {
    return 1
  }
  return 0
}

function deterministicStringify (obj, replacer, spacer, options) {
  if (typeof options === 'undefined') {
    options = defaultOptions()
  }

  var tmp = deterministicDecirc(obj, '', 0, [], undefined, 0, options) || obj
  var res
  try {
    if (replacerStack.length === 0) {
      res = JSON.stringify(tmp, replacer, spacer)
    } else {
      res = JSON.stringify(tmp, replaceGetterValues(replacer), spacer)
    }
  } catch (_) {
    return JSON.stringify('[unable to serialize, circular reference is too complex to analyze]')
  } finally {
    // Ensure that we restore the object as it was.
    while (arr.length !== 0) {
      var part = arr.pop()
      if (part.length === 4) {
        Object.defineProperty(part[0], part[1], part[3])
      } else {
        part[0][part[1]] = part[2]
      }
    }
  }
  return res
}

function deterministicDecirc (val, k, edgeIndex, stack, parent, depth, options) {
  depth += 1
  var i
  if (typeof val === 'object' && val !== null) {
    for (i = 0; i < stack.length; i++) {
      if (stack[i] === val) {
        setReplace(CIRCULAR_REPLACE_NODE, val, k, parent)
        return
      }
    }
    try {
      if (typeof val.toJSON === 'function') {
        return
      }
    } catch (_) {
      return
    }

    if (
      typeof options.depthLimit !== 'undefined' &&
      depth > options.depthLimit
    ) {
      setReplace(LIMIT_REPLACE_NODE, val, k, parent)
      return
    }

    if (
      typeof options.edgesLimit !== 'undefined' &&
      edgeIndex + 1 > options.edgesLimit
    ) {
      setReplace(LIMIT_REPLACE_NODE, val, k, parent)
      return
    }

    stack.push(val)
    // Optimize for Arrays. Big arrays could kill the performance otherwise!
    if (Array.isArray(val)) {
      for (i = 0; i < val.length; i++) {
        deterministicDecirc(val[i], i, i, stack, val, depth, options)
      }
    } else {
      // Create a temporary object in the required way
      var tmp = {}
      var keys = Object.keys(val).sort(compareFunction)
      for (i = 0; i < keys.length; i++) {
        var key = keys[i]
        deterministicDecirc(val[key], key, i, stack, val, depth, options)
        tmp[key] = val[key]
      }
      if (typeof parent !== 'undefined') {
        arr.push([parent, k, val])
        parent[k] = tmp
      } else {
        return tmp
      }
    }
    stack.pop()
  }
}

// wraps replacer function to handle values we couldn't replace
// and mark them as replaced value
function replaceGetterValues (replacer) {
  replacer =
    typeof replacer !== 'undefined'
      ? replacer
      : function (k, v) {
        return v
      }
  return function (key, val) {
    if (replacerStack.length > 0) {
      for (var i = 0; i < replacerStack.length; i++) {
        var part = replacerStack[i]
        if (part[1] === key && part[0] === val) {
          val = part[2]
          replacerStack.splice(i, 1)
          break
        }
      }
    }
    return replacer.call(this, key, val)
  }
}

},{}],90:[function(require,module,exports){
"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function Agent() {
  this._defaults = [];
}

['use', 'on', 'once', 'set', 'query', 'type', 'accept', 'auth', 'withCredentials', 'sortQuery', 'retry', 'ok', 'redirects', 'timeout', 'buffer', 'serialize', 'parse', 'ca', 'key', 'pfx', 'cert', 'disableTLSCerts'].forEach(function (fn) {
  // Default setting for all requests from this agent
  Agent.prototype[fn] = function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    this._defaults.push({
      fn: fn,
      args: args
    });

    return this;
  };
});

Agent.prototype._setDefaults = function (req) {
  this._defaults.forEach(function (def) {
    req[def.fn].apply(req, _toConsumableArray(def.args));
  });
};

module.exports = Agent;

},{}],91:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * Root reference for iframes.
 */
var root;

if (typeof window !== 'undefined') {
  // Browser window
  root = window;
} else if (typeof self === 'undefined') {
  // Other environments
  console.warn('Using browser-only version of superagent in non-browser environment');
  root = void 0;
} else {
  // Web Worker
  root = self;
}

var Emitter = require('component-emitter');

var safeStringify = require('fast-safe-stringify');

var RequestBase = require('./request-base');

var isObject = require('./is-object');

var ResponseBase = require('./response-base');

var Agent = require('./agent-base');
/**
 * Noop.
 */


function noop() {}
/**
 * Expose `request`.
 */


module.exports = function (method, url) {
  // callback
  if (typeof url === 'function') {
    return new exports.Request('GET', method).end(url);
  } // url first


  if (arguments.length === 1) {
    return new exports.Request('GET', method);
  }

  return new exports.Request(method, url);
};

exports = module.exports;
var request = exports;
exports.Request = Request;
/**
 * Determine XHR.
 */

request.getXHR = function () {
  if (root.XMLHttpRequest && (!root.location || root.location.protocol !== 'file:' || !root.ActiveXObject)) {
    return new XMLHttpRequest();
  }

  try {
    return new ActiveXObject('Microsoft.XMLHTTP');
  } catch (_unused) {}

  try {
    return new ActiveXObject('Msxml2.XMLHTTP.6.0');
  } catch (_unused2) {}

  try {
    return new ActiveXObject('Msxml2.XMLHTTP.3.0');
  } catch (_unused3) {}

  try {
    return new ActiveXObject('Msxml2.XMLHTTP');
  } catch (_unused4) {}

  throw new Error('Browser-only version of superagent could not find XHR');
};
/**
 * Removes leading and trailing whitespace, added to support IE.
 *
 * @param {String} s
 * @return {String}
 * @api private
 */


var trim = ''.trim ? function (s) {
  return s.trim();
} : function (s) {
  return s.replace(/(^\s*|\s*$)/g, '');
};
/**
 * Serialize the given `obj`.
 *
 * @param {Object} obj
 * @return {String}
 * @api private
 */

function serialize(obj) {
  if (!isObject(obj)) return obj;
  var pairs = [];

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) pushEncodedKeyValuePair(pairs, key, obj[key]);
  }

  return pairs.join('&');
}
/**
 * Helps 'serialize' with serializing arrays.
 * Mutates the pairs array.
 *
 * @param {Array} pairs
 * @param {String} key
 * @param {Mixed} val
 */


function pushEncodedKeyValuePair(pairs, key, val) {
  if (val === undefined) return;

  if (val === null) {
    pairs.push(encodeURI(key));
    return;
  }

  if (Array.isArray(val)) {
    val.forEach(function (v) {
      pushEncodedKeyValuePair(pairs, key, v);
    });
  } else if (isObject(val)) {
    for (var subkey in val) {
      if (Object.prototype.hasOwnProperty.call(val, subkey)) pushEncodedKeyValuePair(pairs, "".concat(key, "[").concat(subkey, "]"), val[subkey]);
    }
  } else {
    pairs.push(encodeURI(key) + '=' + encodeURIComponent(val));
  }
}
/**
 * Expose serialization method.
 */


request.serializeObject = serialize;
/**
 * Parse the given x-www-form-urlencoded `str`.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function parseString(str) {
  var obj = {};
  var pairs = str.split('&');
  var pair;
  var pos;

  for (var i = 0, len = pairs.length; i < len; ++i) {
    pair = pairs[i];
    pos = pair.indexOf('=');

    if (pos === -1) {
      obj[decodeURIComponent(pair)] = '';
    } else {
      obj[decodeURIComponent(pair.slice(0, pos))] = decodeURIComponent(pair.slice(pos + 1));
    }
  }

  return obj;
}
/**
 * Expose parser.
 */


request.parseString = parseString;
/**
 * Default MIME type map.
 *
 *     superagent.types.xml = 'application/xml';
 *
 */

request.types = {
  html: 'text/html',
  json: 'application/json',
  xml: 'text/xml',
  urlencoded: 'application/x-www-form-urlencoded',
  form: 'application/x-www-form-urlencoded',
  'form-data': 'application/x-www-form-urlencoded'
};
/**
 * Default serialization map.
 *
 *     superagent.serialize['application/xml'] = function(obj){
 *       return 'generated xml here';
 *     };
 *
 */

request.serialize = {
  'application/x-www-form-urlencoded': serialize,
  'application/json': safeStringify
};
/**
 * Default parsers.
 *
 *     superagent.parse['application/xml'] = function(str){
 *       return { object parsed from str };
 *     };
 *
 */

request.parse = {
  'application/x-www-form-urlencoded': parseString,
  'application/json': JSON.parse
};
/**
 * Parse the given header `str` into
 * an object containing the mapped fields.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function parseHeader(str) {
  var lines = str.split(/\r?\n/);
  var fields = {};
  var index;
  var line;
  var field;
  var val;

  for (var i = 0, len = lines.length; i < len; ++i) {
    line = lines[i];
    index = line.indexOf(':');

    if (index === -1) {
      // could be empty line, just skip it
      continue;
    }

    field = line.slice(0, index).toLowerCase();
    val = trim(line.slice(index + 1));
    fields[field] = val;
  }

  return fields;
}
/**
 * Check if `mime` is json or has +json structured syntax suffix.
 *
 * @param {String} mime
 * @return {Boolean}
 * @api private
 */


function isJSON(mime) {
  // should match /json or +json
  // but not /json-seq
  return /[/+]json($|[^-\w])/.test(mime);
}
/**
 * Initialize a new `Response` with the given `xhr`.
 *
 *  - set flags (.ok, .error, etc)
 *  - parse header
 *
 * Examples:
 *
 *  Aliasing `superagent` as `request` is nice:
 *
 *      request = superagent;
 *
 *  We can use the promise-like API, or pass callbacks:
 *
 *      request.get('/').end(function(res){});
 *      request.get('/', function(res){});
 *
 *  Sending data can be chained:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' })
 *        .end(function(res){});
 *
 *  Or passed to `.send()`:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' }, function(res){});
 *
 *  Or passed to `.post()`:
 *
 *      request
 *        .post('/user', { name: 'tj' })
 *        .end(function(res){});
 *
 * Or further reduced to a single call for simple cases:
 *
 *      request
 *        .post('/user', { name: 'tj' }, function(res){});
 *
 * @param {XMLHTTPRequest} xhr
 * @param {Object} options
 * @api private
 */


function Response(req) {
  this.req = req;
  this.xhr = this.req.xhr; // responseText is accessible only if responseType is '' or 'text' and on older browsers

  this.text = this.req.method !== 'HEAD' && (this.xhr.responseType === '' || this.xhr.responseType === 'text') || typeof this.xhr.responseType === 'undefined' ? this.xhr.responseText : null;
  this.statusText = this.req.xhr.statusText;
  var status = this.xhr.status; // handle IE9 bug: http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request

  if (status === 1223) {
    status = 204;
  }

  this._setStatusProperties(status);

  this.headers = parseHeader(this.xhr.getAllResponseHeaders());
  this.header = this.headers; // getAllResponseHeaders sometimes falsely returns "" for CORS requests, but
  // getResponseHeader still works. so we get content-type even if getting
  // other headers fails.

  this.header['content-type'] = this.xhr.getResponseHeader('content-type');

  this._setHeaderProperties(this.header);

  if (this.text === null && req._responseType) {
    this.body = this.xhr.response;
  } else {
    this.body = this.req.method === 'HEAD' ? null : this._parseBody(this.text ? this.text : this.xhr.response);
  }
} // eslint-disable-next-line new-cap


ResponseBase(Response.prototype);
/**
 * Parse the given body `str`.
 *
 * Used for auto-parsing of bodies. Parsers
 * are defined on the `superagent.parse` object.
 *
 * @param {String} str
 * @return {Mixed}
 * @api private
 */

Response.prototype._parseBody = function (str) {
  var parse = request.parse[this.type];

  if (this.req._parser) {
    return this.req._parser(this, str);
  }

  if (!parse && isJSON(this.type)) {
    parse = request.parse['application/json'];
  }

  return parse && str && (str.length > 0 || str instanceof Object) ? parse(str) : null;
};
/**
 * Return an `Error` representative of this response.
 *
 * @return {Error}
 * @api public
 */


Response.prototype.toError = function () {
  var req = this.req;
  var method = req.method;
  var url = req.url;
  var msg = "cannot ".concat(method, " ").concat(url, " (").concat(this.status, ")");
  var err = new Error(msg);
  err.status = this.status;
  err.method = method;
  err.url = url;
  return err;
};
/**
 * Expose `Response`.
 */


request.Response = Response;
/**
 * Initialize a new `Request` with the given `method` and `url`.
 *
 * @param {String} method
 * @param {String} url
 * @api public
 */

function Request(method, url) {
  var self = this;
  this._query = this._query || [];
  this.method = method;
  this.url = url;
  this.header = {}; // preserves header name case

  this._header = {}; // coerces header names to lowercase

  this.on('end', function () {
    var err = null;
    var res = null;

    try {
      res = new Response(self);
    } catch (err_) {
      err = new Error('Parser is unable to parse the response');
      err.parse = true;
      err.original = err_; // issue #675: return the raw response if the response parsing fails

      if (self.xhr) {
        // ie9 doesn't have 'response' property
        err.rawResponse = typeof self.xhr.responseType === 'undefined' ? self.xhr.responseText : self.xhr.response; // issue #876: return the http status code if the response parsing fails

        err.status = self.xhr.status ? self.xhr.status : null;
        err.statusCode = err.status; // backwards-compat only
      } else {
        err.rawResponse = null;
        err.status = null;
      }

      return self.callback(err);
    }

    self.emit('response', res);
    var new_err;

    try {
      if (!self._isResponseOK(res)) {
        new_err = new Error(res.statusText || res.text || 'Unsuccessful HTTP response');
      }
    } catch (err_) {
      new_err = err_; // ok() callback can throw
    } // #1000 don't catch errors from the callback to avoid double calling it


    if (new_err) {
      new_err.original = err;
      new_err.response = res;
      new_err.status = res.status;
      self.callback(new_err, res);
    } else {
      self.callback(null, res);
    }
  });
}
/**
 * Mixin `Emitter` and `RequestBase`.
 */
// eslint-disable-next-line new-cap


Emitter(Request.prototype); // eslint-disable-next-line new-cap

RequestBase(Request.prototype);
/**
 * Set Content-Type to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.xml = 'application/xml';
 *
 *      request.post('/')
 *        .type('xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 *      request.post('/')
 *        .type('application/xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 * @param {String} type
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.type = function (type) {
  this.set('Content-Type', request.types[type] || type);
  return this;
};
/**
 * Set Accept to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.json = 'application/json';
 *
 *      request.get('/agent')
 *        .accept('json')
 *        .end(callback);
 *
 *      request.get('/agent')
 *        .accept('application/json')
 *        .end(callback);
 *
 * @param {String} accept
 * @return {Request} for chaining
 * @api public
 */


Request.prototype.accept = function (type) {
  this.set('Accept', request.types[type] || type);
  return this;
};
/**
 * Set Authorization field value with `user` and `pass`.
 *
 * @param {String} user
 * @param {String} [pass] optional in case of using 'bearer' as type
 * @param {Object} options with 'type' property 'auto', 'basic' or 'bearer' (default 'basic')
 * @return {Request} for chaining
 * @api public
 */


Request.prototype.auth = function (user, pass, options) {
  if (arguments.length === 1) pass = '';

  if (_typeof(pass) === 'object' && pass !== null) {
    // pass is optional and can be replaced with options
    options = pass;
    pass = '';
  }

  if (!options) {
    options = {
      type: typeof btoa === 'function' ? 'basic' : 'auto'
    };
  }

  var encoder = function encoder(string) {
    if (typeof btoa === 'function') {
      return btoa(string);
    }

    throw new Error('Cannot use basic auth, btoa is not a function');
  };

  return this._auth(user, pass, options, encoder);
};
/**
 * Add query-string `val`.
 *
 * Examples:
 *
 *   request.get('/shoes')
 *     .query('size=10')
 *     .query({ color: 'blue' })
 *
 * @param {Object|String} val
 * @return {Request} for chaining
 * @api public
 */


Request.prototype.query = function (val) {
  if (typeof val !== 'string') val = serialize(val);
  if (val) this._query.push(val);
  return this;
};
/**
 * Queue the given `file` as an attachment to the specified `field`,
 * with optional `options` (or filename).
 *
 * ``` js
 * request.post('/upload')
 *   .attach('content', new Blob(['<a id="a"><b id="b">hey!</b></a>'], { type: "text/html"}))
 *   .end(callback);
 * ```
 *
 * @param {String} field
 * @param {Blob|File} file
 * @param {String|Object} options
 * @return {Request} for chaining
 * @api public
 */


Request.prototype.attach = function (field, file, options) {
  if (file) {
    if (this._data) {
      throw new Error("superagent can't mix .send() and .attach()");
    }

    this._getFormData().append(field, file, options || file.name);
  }

  return this;
};

Request.prototype._getFormData = function () {
  if (!this._formData) {
    this._formData = new root.FormData();
  }

  return this._formData;
};
/**
 * Invoke the callback with `err` and `res`
 * and handle arity check.
 *
 * @param {Error} err
 * @param {Response} res
 * @api private
 */


Request.prototype.callback = function (err, res) {
  if (this._shouldRetry(err, res)) {
    return this._retry();
  }

  var fn = this._callback;
  this.clearTimeout();

  if (err) {
    if (this._maxRetries) err.retries = this._retries - 1;
    this.emit('error', err);
  }

  fn(err, res);
};
/**
 * Invoke callback with x-domain error.
 *
 * @api private
 */


Request.prototype.crossDomainError = function () {
  var err = new Error('Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.');
  err.crossDomain = true;
  err.status = this.status;
  err.method = this.method;
  err.url = this.url;
  this.callback(err);
}; // This only warns, because the request is still likely to work


Request.prototype.agent = function () {
  console.warn('This is not supported in browser version of superagent');
  return this;
};

Request.prototype.ca = Request.prototype.agent;
Request.prototype.buffer = Request.prototype.ca; // This throws, because it can't send/receive data as expected

Request.prototype.write = function () {
  throw new Error('Streaming is not supported in browser version of superagent');
};

Request.prototype.pipe = Request.prototype.write;
/**
 * Check if `obj` is a host object,
 * we don't want to serialize these :)
 *
 * @param {Object} obj host object
 * @return {Boolean} is a host object
 * @api private
 */

Request.prototype._isHost = function (obj) {
  // Native objects stringify to [object File], [object Blob], [object FormData], etc.
  return obj && _typeof(obj) === 'object' && !Array.isArray(obj) && Object.prototype.toString.call(obj) !== '[object Object]';
};
/**
 * Initiate request, invoking callback `fn(res)`
 * with an instanceof `Response`.
 *
 * @param {Function} fn
 * @return {Request} for chaining
 * @api public
 */


Request.prototype.end = function (fn) {
  if (this._endCalled) {
    console.warn('Warning: .end() was called twice. This is not supported in superagent');
  }

  this._endCalled = true; // store callback

  this._callback = fn || noop; // querystring

  this._finalizeQueryString();

  this._end();
};

Request.prototype._setUploadTimeout = function () {
  var self = this; // upload timeout it's wokrs only if deadline timeout is off

  if (this._uploadTimeout && !this._uploadTimeoutTimer) {
    this._uploadTimeoutTimer = setTimeout(function () {
      self._timeoutError('Upload timeout of ', self._uploadTimeout, 'ETIMEDOUT');
    }, this._uploadTimeout);
  }
}; // eslint-disable-next-line complexity


Request.prototype._end = function () {
  if (this._aborted) return this.callback(new Error('The request has been aborted even before .end() was called'));
  var self = this;
  this.xhr = request.getXHR();
  var xhr = this.xhr;
  var data = this._formData || this._data;

  this._setTimeouts(); // state change


  xhr.onreadystatechange = function () {
    var readyState = xhr.readyState;

    if (readyState >= 2 && self._responseTimeoutTimer) {
      clearTimeout(self._responseTimeoutTimer);
    }

    if (readyState !== 4) {
      return;
    } // In IE9, reads to any property (e.g. status) off of an aborted XHR will
    // result in the error "Could not complete the operation due to error c00c023f"


    var status;

    try {
      status = xhr.status;
    } catch (_unused5) {
      status = 0;
    }

    if (!status) {
      if (self.timedout || self._aborted) return;
      return self.crossDomainError();
    }

    self.emit('end');
  }; // progress


  var handleProgress = function handleProgress(direction, e) {
    if (e.total > 0) {
      e.percent = e.loaded / e.total * 100;

      if (e.percent === 100) {
        clearTimeout(self._uploadTimeoutTimer);
      }
    }

    e.direction = direction;
    self.emit('progress', e);
  };

  if (this.hasListeners('progress')) {
    try {
      xhr.addEventListener('progress', handleProgress.bind(null, 'download'));

      if (xhr.upload) {
        xhr.upload.addEventListener('progress', handleProgress.bind(null, 'upload'));
      }
    } catch (_unused6) {// Accessing xhr.upload fails in IE from a web worker, so just pretend it doesn't exist.
      // Reported here:
      // https://connect.microsoft.com/IE/feedback/details/837245/xmlhttprequest-upload-throws-invalid-argument-when-used-from-web-worker-context
    }
  }

  if (xhr.upload) {
    this._setUploadTimeout();
  } // initiate request


  try {
    if (this.username && this.password) {
      xhr.open(this.method, this.url, true, this.username, this.password);
    } else {
      xhr.open(this.method, this.url, true);
    }
  } catch (err) {
    // see #1149
    return this.callback(err);
  } // CORS


  if (this._withCredentials) xhr.withCredentials = true; // body

  if (!this._formData && this.method !== 'GET' && this.method !== 'HEAD' && typeof data !== 'string' && !this._isHost(data)) {
    // serialize stuff
    var contentType = this._header['content-type'];

    var _serialize = this._serializer || request.serialize[contentType ? contentType.split(';')[0] : ''];

    if (!_serialize && isJSON(contentType)) {
      _serialize = request.serialize['application/json'];
    }

    if (_serialize) data = _serialize(data);
  } // set header fields


  for (var field in this.header) {
    if (this.header[field] === null) continue;
    if (Object.prototype.hasOwnProperty.call(this.header, field)) xhr.setRequestHeader(field, this.header[field]);
  }

  if (this._responseType) {
    xhr.responseType = this._responseType;
  } // send stuff


  this.emit('request', this); // IE11 xhr.send(undefined) sends 'undefined' string as POST payload (instead of nothing)
  // We need null here if data is undefined

  xhr.send(typeof data === 'undefined' ? null : data);
};

request.agent = function () {
  return new Agent();
};

['GET', 'POST', 'OPTIONS', 'PATCH', 'PUT', 'DELETE'].forEach(function (method) {
  Agent.prototype[method.toLowerCase()] = function (url, fn) {
    var req = new request.Request(method, url);

    this._setDefaults(req);

    if (fn) {
      req.end(fn);
    }

    return req;
  };
});
Agent.prototype.del = Agent.prototype.delete;
/**
 * GET `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.get = function (url, data, fn) {
  var req = request('GET', url);

  if (typeof data === 'function') {
    fn = data;
    data = null;
  }

  if (data) req.query(data);
  if (fn) req.end(fn);
  return req;
};
/**
 * HEAD `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */


request.head = function (url, data, fn) {
  var req = request('HEAD', url);

  if (typeof data === 'function') {
    fn = data;
    data = null;
  }

  if (data) req.query(data);
  if (fn) req.end(fn);
  return req;
};
/**
 * OPTIONS query to `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */


request.options = function (url, data, fn) {
  var req = request('OPTIONS', url);

  if (typeof data === 'function') {
    fn = data;
    data = null;
  }

  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};
/**
 * DELETE `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} [data]
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */


function del(url, data, fn) {
  var req = request('DELETE', url);

  if (typeof data === 'function') {
    fn = data;
    data = null;
  }

  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
}

request.del = del;
request.delete = del;
/**
 * PATCH `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} [data]
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.patch = function (url, data, fn) {
  var req = request('PATCH', url);

  if (typeof data === 'function') {
    fn = data;
    data = null;
  }

  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};
/**
 * POST `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} [data]
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */


request.post = function (url, data, fn) {
  var req = request('POST', url);

  if (typeof data === 'function') {
    fn = data;
    data = null;
  }

  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};
/**
 * PUT `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */


request.put = function (url, data, fn) {
  var req = request('PUT', url);

  if (typeof data === 'function') {
    fn = data;
    data = null;
  }

  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

},{"./agent-base":90,"./is-object":92,"./request-base":93,"./response-base":94,"component-emitter":88,"fast-safe-stringify":89}],92:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * Check if `obj` is an object.
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */
function isObject(obj) {
  return obj !== null && _typeof(obj) === 'object';
}

module.exports = isObject;

},{}],93:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * Module of mixed-in functions shared between node and client code
 */
var isObject = require('./is-object');
/**
 * Expose `RequestBase`.
 */


module.exports = RequestBase;
/**
 * Initialize a new `RequestBase`.
 *
 * @api public
 */

function RequestBase(obj) {
  if (obj) return mixin(obj);
}
/**
 * Mixin the prototype properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */


function mixin(obj) {
  for (var key in RequestBase.prototype) {
    if (Object.prototype.hasOwnProperty.call(RequestBase.prototype, key)) obj[key] = RequestBase.prototype[key];
  }

  return obj;
}
/**
 * Clear previous timeout.
 *
 * @return {Request} for chaining
 * @api public
 */


RequestBase.prototype.clearTimeout = function () {
  clearTimeout(this._timer);
  clearTimeout(this._responseTimeoutTimer);
  clearTimeout(this._uploadTimeoutTimer);
  delete this._timer;
  delete this._responseTimeoutTimer;
  delete this._uploadTimeoutTimer;
  return this;
};
/**
 * Override default response body parser
 *
 * This function will be called to convert incoming data into request.body
 *
 * @param {Function}
 * @api public
 */


RequestBase.prototype.parse = function (fn) {
  this._parser = fn;
  return this;
};
/**
 * Set format of binary response body.
 * In browser valid formats are 'blob' and 'arraybuffer',
 * which return Blob and ArrayBuffer, respectively.
 *
 * In Node all values result in Buffer.
 *
 * Examples:
 *
 *      req.get('/')
 *        .responseType('blob')
 *        .end(callback);
 *
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */


RequestBase.prototype.responseType = function (val) {
  this._responseType = val;
  return this;
};
/**
 * Override default request body serializer
 *
 * This function will be called to convert data set via .send or .attach into payload to send
 *
 * @param {Function}
 * @api public
 */


RequestBase.prototype.serialize = function (fn) {
  this._serializer = fn;
  return this;
};
/**
 * Set timeouts.
 *
 * - response timeout is time between sending request and receiving the first byte of the response. Includes DNS and connection time.
 * - deadline is the time from start of the request to receiving response body in full. If the deadline is too short large files may not load at all on slow connections.
 * - upload is the time  since last bit of data was sent or received. This timeout works only if deadline timeout is off
 *
 * Value of 0 or false means no timeout.
 *
 * @param {Number|Object} ms or {response, deadline}
 * @return {Request} for chaining
 * @api public
 */


RequestBase.prototype.timeout = function (options) {
  if (!options || _typeof(options) !== 'object') {
    this._timeout = options;
    this._responseTimeout = 0;
    this._uploadTimeout = 0;
    return this;
  }

  for (var option in options) {
    if (Object.prototype.hasOwnProperty.call(options, option)) {
      switch (option) {
        case 'deadline':
          this._timeout = options.deadline;
          break;

        case 'response':
          this._responseTimeout = options.response;
          break;

        case 'upload':
          this._uploadTimeout = options.upload;
          break;

        default:
          console.warn('Unknown timeout option', option);
      }
    }
  }

  return this;
};
/**
 * Set number of retry attempts on error.
 *
 * Failed requests will be retried 'count' times if timeout or err.code >= 500.
 *
 * @param {Number} count
 * @param {Function} [fn]
 * @return {Request} for chaining
 * @api public
 */


RequestBase.prototype.retry = function (count, fn) {
  // Default to 1 if no count passed or true
  if (arguments.length === 0 || count === true) count = 1;
  if (count <= 0) count = 0;
  this._maxRetries = count;
  this._retries = 0;
  this._retryCallback = fn;
  return this;
};

var ERROR_CODES = ['ECONNRESET', 'ETIMEDOUT', 'EADDRINFO', 'ESOCKETTIMEDOUT'];
/**
 * Determine if a request should be retried.
 * (Borrowed from segmentio/superagent-retry)
 *
 * @param {Error} err an error
 * @param {Response} [res] response
 * @returns {Boolean} if segment should be retried
 */

RequestBase.prototype._shouldRetry = function (err, res) {
  if (!this._maxRetries || this._retries++ >= this._maxRetries) {
    return false;
  }

  if (this._retryCallback) {
    try {
      var override = this._retryCallback(err, res);

      if (override === true) return true;
      if (override === false) return false; // undefined falls back to defaults
    } catch (err_) {
      console.error(err_);
    }
  }

  if (res && res.status && res.status >= 500 && res.status !== 501) return true;

  if (err) {
    if (err.code && ERROR_CODES.includes(err.code)) return true; // Superagent timeout

    if (err.timeout && err.code === 'ECONNABORTED') return true;
    if (err.crossDomain) return true;
  }

  return false;
};
/**
 * Retry request
 *
 * @return {Request} for chaining
 * @api private
 */


RequestBase.prototype._retry = function () {
  this.clearTimeout(); // node

  if (this.req) {
    this.req = null;
    this.req = this.request();
  }

  this._aborted = false;
  this.timedout = false;
  this.timedoutError = null;
  return this._end();
};
/**
 * Promise support
 *
 * @param {Function} resolve
 * @param {Function} [reject]
 * @return {Request}
 */


RequestBase.prototype.then = function (resolve, reject) {
  var _this = this;

  if (!this._fullfilledPromise) {
    var self = this;

    if (this._endCalled) {
      console.warn('Warning: superagent request was sent twice, because both .end() and .then() were called. Never call .end() if you use promises');
    }

    this._fullfilledPromise = new Promise(function (resolve, reject) {
      self.on('abort', function () {
        if (_this._maxRetries && _this._maxRetries > _this._retries) {
          return;
        }

        if (_this.timedout && _this.timedoutError) {
          reject(_this.timedoutError);
          return;
        }

        var err = new Error('Aborted');
        err.code = 'ABORTED';
        err.status = _this.status;
        err.method = _this.method;
        err.url = _this.url;
        reject(err);
      });
      self.end(function (err, res) {
        if (err) reject(err);else resolve(res);
      });
    });
  }

  return this._fullfilledPromise.then(resolve, reject);
};

RequestBase.prototype.catch = function (cb) {
  return this.then(undefined, cb);
};
/**
 * Allow for extension
 */


RequestBase.prototype.use = function (fn) {
  fn(this);
  return this;
};

RequestBase.prototype.ok = function (cb) {
  if (typeof cb !== 'function') throw new Error('Callback required');
  this._okCallback = cb;
  return this;
};

RequestBase.prototype._isResponseOK = function (res) {
  if (!res) {
    return false;
  }

  if (this._okCallback) {
    return this._okCallback(res);
  }

  return res.status >= 200 && res.status < 300;
};
/**
 * Get request header `field`.
 * Case-insensitive.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */


RequestBase.prototype.get = function (field) {
  return this._header[field.toLowerCase()];
};
/**
 * Get case-insensitive header `field` value.
 * This is a deprecated internal API. Use `.get(field)` instead.
 *
 * (getHeader is no longer used internally by the superagent code base)
 *
 * @param {String} field
 * @return {String}
 * @api private
 * @deprecated
 */


RequestBase.prototype.getHeader = RequestBase.prototype.get;
/**
 * Set header `field` to `val`, or multiple fields with one object.
 * Case-insensitive.
 *
 * Examples:
 *
 *      req.get('/')
 *        .set('Accept', 'application/json')
 *        .set('X-API-Key', 'foobar')
 *        .end(callback);
 *
 *      req.get('/')
 *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
 *        .end(callback);
 *
 * @param {String|Object} field
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.set = function (field, val) {
  if (isObject(field)) {
    for (var key in field) {
      if (Object.prototype.hasOwnProperty.call(field, key)) this.set(key, field[key]);
    }

    return this;
  }

  this._header[field.toLowerCase()] = val;
  this.header[field] = val;
  return this;
};
/**
 * Remove header `field`.
 * Case-insensitive.
 *
 * Example:
 *
 *      req.get('/')
 *        .unset('User-Agent')
 *        .end(callback);
 *
 * @param {String} field field name
 */


RequestBase.prototype.unset = function (field) {
  delete this._header[field.toLowerCase()];
  delete this.header[field];
  return this;
};
/**
 * Write the field `name` and `val`, or multiple fields with one object
 * for "multipart/form-data" request bodies.
 *
 * ``` js
 * request.post('/upload')
 *   .field('foo', 'bar')
 *   .end(callback);
 *
 * request.post('/upload')
 *   .field({ foo: 'bar', baz: 'qux' })
 *   .end(callback);
 * ```
 *
 * @param {String|Object} name name of field
 * @param {String|Blob|File|Buffer|fs.ReadStream} val value of field
 * @return {Request} for chaining
 * @api public
 */


RequestBase.prototype.field = function (name, val) {
  // name should be either a string or an object.
  if (name === null || undefined === name) {
    throw new Error('.field(name, val) name can not be empty');
  }

  if (this._data) {
    throw new Error(".field() can't be used if .send() is used. Please use only .send() or only .field() & .attach()");
  }

  if (isObject(name)) {
    for (var key in name) {
      if (Object.prototype.hasOwnProperty.call(name, key)) this.field(key, name[key]);
    }

    return this;
  }

  if (Array.isArray(val)) {
    for (var i in val) {
      if (Object.prototype.hasOwnProperty.call(val, i)) this.field(name, val[i]);
    }

    return this;
  } // val should be defined now


  if (val === null || undefined === val) {
    throw new Error('.field(name, val) val can not be empty');
  }

  if (typeof val === 'boolean') {
    val = String(val);
  }

  this._getFormData().append(name, val);

  return this;
};
/**
 * Abort the request, and clear potential timeout.
 *
 * @return {Request} request
 * @api public
 */


RequestBase.prototype.abort = function () {
  if (this._aborted) {
    return this;
  }

  this._aborted = true;
  if (this.xhr) this.xhr.abort(); // browser

  if (this.req) this.req.abort(); // node

  this.clearTimeout();
  this.emit('abort');
  return this;
};

RequestBase.prototype._auth = function (user, pass, options, base64Encoder) {
  switch (options.type) {
    case 'basic':
      this.set('Authorization', "Basic ".concat(base64Encoder("".concat(user, ":").concat(pass))));
      break;

    case 'auto':
      this.username = user;
      this.password = pass;
      break;

    case 'bearer':
      // usage would be .auth(accessToken, { type: 'bearer' })
      this.set('Authorization', "Bearer ".concat(user));
      break;

    default:
      break;
  }

  return this;
};
/**
 * Enable transmission of cookies with x-domain requests.
 *
 * Note that for this to work the origin must not be
 * using "Access-Control-Allow-Origin" with a wildcard,
 * and also must set "Access-Control-Allow-Credentials"
 * to "true".
 *
 * @api public
 */


RequestBase.prototype.withCredentials = function (on) {
  // This is browser-only functionality. Node side is no-op.
  if (on === undefined) on = true;
  this._withCredentials = on;
  return this;
};
/**
 * Set the max redirects to `n`. Does nothing in browser XHR implementation.
 *
 * @param {Number} n
 * @return {Request} for chaining
 * @api public
 */


RequestBase.prototype.redirects = function (n) {
  this._maxRedirects = n;
  return this;
};
/**
 * Maximum size of buffered response body, in bytes. Counts uncompressed size.
 * Default 200MB.
 *
 * @param {Number} n number of bytes
 * @return {Request} for chaining
 */


RequestBase.prototype.maxResponseSize = function (n) {
  if (typeof n !== 'number') {
    throw new TypeError('Invalid argument');
  }

  this._maxResponseSize = n;
  return this;
};
/**
 * Convert to a plain javascript object (not JSON string) of scalar properties.
 * Note as this method is designed to return a useful non-this value,
 * it cannot be chained.
 *
 * @return {Object} describing method, url, and data of this request
 * @api public
 */


RequestBase.prototype.toJSON = function () {
  return {
    method: this.method,
    url: this.url,
    data: this._data,
    headers: this._header
  };
};
/**
 * Send `data` as the request body, defaulting the `.type()` to "json" when
 * an object is given.
 *
 * Examples:
 *
 *       // manual json
 *       request.post('/user')
 *         .type('json')
 *         .send('{"name":"tj"}')
 *         .end(callback)
 *
 *       // auto json
 *       request.post('/user')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // manual x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send('name=tj')
 *         .end(callback)
 *
 *       // auto x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // defaults to x-www-form-urlencoded
 *      request.post('/user')
 *        .send('name=tobi')
 *        .send('species=ferret')
 *        .end(callback)
 *
 * @param {String|Object} data
 * @return {Request} for chaining
 * @api public
 */
// eslint-disable-next-line complexity


RequestBase.prototype.send = function (data) {
  var isObj = isObject(data);
  var type = this._header['content-type'];

  if (this._formData) {
    throw new Error(".send() can't be used if .attach() or .field() is used. Please use only .send() or only .field() & .attach()");
  }

  if (isObj && !this._data) {
    if (Array.isArray(data)) {
      this._data = [];
    } else if (!this._isHost(data)) {
      this._data = {};
    }
  } else if (data && this._data && this._isHost(this._data)) {
    throw new Error("Can't merge these send calls");
  } // merge


  if (isObj && isObject(this._data)) {
    for (var key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) this._data[key] = data[key];
    }
  } else if (typeof data === 'string') {
    // default to x-www-form-urlencoded
    if (!type) this.type('form');
    type = this._header['content-type'];

    if (type === 'application/x-www-form-urlencoded') {
      this._data = this._data ? "".concat(this._data, "&").concat(data) : data;
    } else {
      this._data = (this._data || '') + data;
    }
  } else {
    this._data = data;
  }

  if (!isObj || this._isHost(data)) {
    return this;
  } // default to json


  if (!type) this.type('json');
  return this;
};
/**
 * Sort `querystring` by the sort function
 *
 *
 * Examples:
 *
 *       // default order
 *       request.get('/user')
 *         .query('name=Nick')
 *         .query('search=Manny')
 *         .sortQuery()
 *         .end(callback)
 *
 *       // customized sort function
 *       request.get('/user')
 *         .query('name=Nick')
 *         .query('search=Manny')
 *         .sortQuery(function(a, b){
 *           return a.length - b.length;
 *         })
 *         .end(callback)
 *
 *
 * @param {Function} sort
 * @return {Request} for chaining
 * @api public
 */


RequestBase.prototype.sortQuery = function (sort) {
  // _sort default to true but otherwise can be a function or boolean
  this._sort = typeof sort === 'undefined' ? true : sort;
  return this;
};
/**
 * Compose querystring to append to req.url
 *
 * @api private
 */


RequestBase.prototype._finalizeQueryString = function () {
  var query = this._query.join('&');

  if (query) {
    this.url += (this.url.includes('?') ? '&' : '?') + query;
  }

  this._query.length = 0; // Makes the call idempotent

  if (this._sort) {
    var index = this.url.indexOf('?');

    if (index >= 0) {
      var queryArr = this.url.slice(index + 1).split('&');

      if (typeof this._sort === 'function') {
        queryArr.sort(this._sort);
      } else {
        queryArr.sort();
      }

      this.url = this.url.slice(0, index) + '?' + queryArr.join('&');
    }
  }
}; // For backwards compat only


RequestBase.prototype._appendQueryString = function () {
  console.warn('Unsupported');
};
/**
 * Invoke callback with timeout error.
 *
 * @api private
 */


RequestBase.prototype._timeoutError = function (reason, timeout, errno) {
  if (this._aborted) {
    return;
  }

  var err = new Error("".concat(reason + timeout, "ms exceeded"));
  err.timeout = timeout;
  err.code = 'ECONNABORTED';
  err.errno = errno;
  this.timedout = true;
  this.timedoutError = err;
  this.abort();
  this.callback(err);
};

RequestBase.prototype._setTimeouts = function () {
  var self = this; // deadline

  if (this._timeout && !this._timer) {
    this._timer = setTimeout(function () {
      self._timeoutError('Timeout of ', self._timeout, 'ETIME');
    }, this._timeout);
  } // response timeout


  if (this._responseTimeout && !this._responseTimeoutTimer) {
    this._responseTimeoutTimer = setTimeout(function () {
      self._timeoutError('Response timeout of ', self._responseTimeout, 'ETIMEDOUT');
    }, this._responseTimeout);
  }
};

},{"./is-object":92}],94:[function(require,module,exports){
"use strict";

/**
 * Module dependencies.
 */
var utils = require('./utils');
/**
 * Expose `ResponseBase`.
 */


module.exports = ResponseBase;
/**
 * Initialize a new `ResponseBase`.
 *
 * @api public
 */

function ResponseBase(obj) {
  if (obj) return mixin(obj);
}
/**
 * Mixin the prototype properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */


function mixin(obj) {
  for (var key in ResponseBase.prototype) {
    if (Object.prototype.hasOwnProperty.call(ResponseBase.prototype, key)) obj[key] = ResponseBase.prototype[key];
  }

  return obj;
}
/**
 * Get case-insensitive `field` value.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */


ResponseBase.prototype.get = function (field) {
  return this.header[field.toLowerCase()];
};
/**
 * Set header related properties:
 *
 *   - `.type` the content type without params
 *
 * A response of "Content-Type: text/plain; charset=utf-8"
 * will provide you with a `.type` of "text/plain".
 *
 * @param {Object} header
 * @api private
 */


ResponseBase.prototype._setHeaderProperties = function (header) {
  // TODO: moar!
  // TODO: make this a util
  // content-type
  var ct = header['content-type'] || '';
  this.type = utils.type(ct); // params

  var params = utils.params(ct);

  for (var key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) this[key] = params[key];
  }

  this.links = {}; // links

  try {
    if (header.link) {
      this.links = utils.parseLinks(header.link);
    }
  } catch (_unused) {// ignore
  }
};
/**
 * Set flags such as `.ok` based on `status`.
 *
 * For example a 2xx response will give you a `.ok` of __true__
 * whereas 5xx will be __false__ and `.error` will be __true__. The
 * `.clientError` and `.serverError` are also available to be more
 * specific, and `.statusType` is the class of error ranging from 1..5
 * sometimes useful for mapping respond colors etc.
 *
 * "sugar" properties are also defined for common cases. Currently providing:
 *
 *   - .noContent
 *   - .badRequest
 *   - .unauthorized
 *   - .notAcceptable
 *   - .notFound
 *
 * @param {Number} status
 * @api private
 */


ResponseBase.prototype._setStatusProperties = function (status) {
  var type = status / 100 | 0; // status / class

  this.statusCode = status;
  this.status = this.statusCode;
  this.statusType = type; // basics

  this.info = type === 1;
  this.ok = type === 2;
  this.redirect = type === 3;
  this.clientError = type === 4;
  this.serverError = type === 5;
  this.error = type === 4 || type === 5 ? this.toError() : false; // sugar

  this.created = status === 201;
  this.accepted = status === 202;
  this.noContent = status === 204;
  this.badRequest = status === 400;
  this.unauthorized = status === 401;
  this.notAcceptable = status === 406;
  this.forbidden = status === 403;
  this.notFound = status === 404;
  this.unprocessableEntity = status === 422;
};

},{"./utils":95}],95:[function(require,module,exports){
"use strict";

/**
 * Return the mime type for the given `str`.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */
exports.type = function (str) {
  return str.split(/ *; */).shift();
};
/**
 * Return header field parameters.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */


exports.params = function (str) {
  return str.split(/ *; */).reduce(function (obj, str) {
    var parts = str.split(/ *= */);
    var key = parts.shift();
    var val = parts.shift();
    if (key && val) obj[key] = val;
    return obj;
  }, {});
};
/**
 * Parse Link header fields.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */


exports.parseLinks = function (str) {
  return str.split(/ *, */).reduce(function (obj, str) {
    var parts = str.split(/ *; */);
    var url = parts[0].slice(1, -1);
    var rel = parts[1].split(/ *= */)[1].slice(1, -1);
    obj[rel] = url;
    return obj;
  }, {});
};
/**
 * Strip content related fields from `header`.
 *
 * @param {Object} header
 * @return {Object} header
 * @api private
 */


exports.cleanHeader = function (header, changesOrigin) {
  delete header['content-type'];
  delete header['content-length'];
  delete header['transfer-encoding'];
  delete header.host; // secuirty

  if (changesOrigin) {
    delete header.authorization;
    delete header.cookie;
  }

  return header;
};

},{}]},{},[26])(26)
});
